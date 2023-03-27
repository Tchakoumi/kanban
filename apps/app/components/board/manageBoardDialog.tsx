import { DialogTransition } from '@kanban/dialog';
import { IBoard, IColumn, ICreateBoard, IEditBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { useNotification } from '@kanban/toast';
import { CloseOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { useColumns } from '../../services';

export default function ManageBoardDialog({
  isDialogOpen,
  closeDialog,
  submitDialog,
  editableBoard,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  submitDialog: (val: ICreateBoard | IEditBoard) => void;
  editableBoard?: IBoard;
}) {
  const {
    query: { board_id },
  } = useRouter();
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  const {
    data: columns,
    error: columnsError,
    isLoading: areColumnsLoading,
  } = useColumns(String(board_id));

  if (columnsError) {
    const notif = new useNotification();
    notif.notify({ render: 'Notifying' });
    notif.update({
      type: 'ERROR',
      render: columnsError ?? 'Something went wrong while loading columns',
      autoClose: 3000,
      icon: () => <ReportRounded fontSize="medium" color="error" />,
    });
  }

  const initialValues: Omit<ICreateBoard, 'newColumns'> = editableBoard ?? {
    board_name: '',
  };

  const validationSchema = Yup.object().shape({
    board_name: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      const newTask: ICreateBoard = {
        ...values,
        newColumns: boardColumns.map(({ column_title, column_color_code }) => {
          return { column_title, column_color_code };
        }),
      };

      const editedTask: IEditBoard = {
        ...values,
        board_id: String(board_id),
        deletedColumnIds,
        updatedColumns,
        newColumns: boardColumns
          .filter(
            ({ column_id: c_id }) =>
              !columns.find(({ column_id: co_id }) => co_id === c_id)
          )
          .map(({ column_title, column_color_code }) => {
            return { column_color_code, column_title };
          }),
      };
      submitDialog(editableBoard ? editedTask : newTask);
      resetForm();
      handleClose();
    },
  });

  const [deletedColumnIds, setDeletedColumnIds] = useState<string[]>([]);
  const [updatedColumns, setUpdatedBoards] = useState<IColumn[]>([]);

  const [boardColumns, setBoardColumns] = useState<IColumn[]>([]);

  if (
    boardColumns.length + deletedColumnIds.length < columns.length &&
    editableBoard
  )
    setBoardColumns(columns);

  function handleClose() {
    closeDialog();
    formik.resetForm();
    setBoardColumns([]);
    setDeletedColumnIds([]);
    setUpdatedBoards([]);
  }

  const [showColumnError, setShowColumnError] = useState<boolean>(false);

  function removeColumn(column_id: string) {
    if (editableBoard) {
      if (columns.find(({ column_id: c_id }) => c_id === column_id)) {
        setDeletedColumnIds([...deletedColumnIds, column_id]);
        //remove the deleted column from list of updated tasks (in case it was updated before deleted)
        setUpdatedBoards(
          updatedColumns.filter(({ column_id: c_id }) => c_id !== column_id)
        );
      }
    }

    setBoardColumns(
      boardColumns.filter(({ column_id: c_id, column_title: ct }) => {
        if (ct === '') setShowColumnError(false);
        return c_id !== column_id;
      })
    );
  }

  function changeColumn(column_id, value) {
    const editedColumn = columns.find(
      ({ column_id: c_id }) => c_id === column_id
    );
    if (editedColumn) {
      const newUpdated = updatedColumns.filter(
        ({ column_id: c_id }) => c_id !== column_id
      );
      setUpdatedBoards(
        editedColumn.column_title === value
          ? newUpdated
          : [...newUpdated, { ...editedColumn, column_title: value }]
      );
    }

    const newColumns = boardColumns.map((column) => {
      const { column_id: c_id } = column;
      if (c_id !== column_id) return column;

      //ONLY REMOVE ERROR WHEN THERE'S NO OTHER LEFT
      if (!boardColumns.find(({ column_title: ct }) => ct === ''))
        setShowColumnError(false);

      if (value === '') setShowColumnError(true);
      return { ...column, column_title: value };
    });

    setBoardColumns(newColumns);
  }

  function addBoardColumn() {
    if (boardColumns.find(({ column_title: ct }) => ct === ''))
      setShowColumnError(true);
    else
      setBoardColumns([
        ...boardColumns,
        {
          column_color_code: '',
          column_id: uuidv4(),
          column_position: 0,
          column_title: '',
        },
      ]);
  }

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      onClose={handleClose}
    >
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === 'dark' ? theme.common.dark_grey : '',
          width: {
            mobile: 'initial',
            tablet: '480px',
          },
          padding: '32px',
          display: 'grid',
          rowGap: 3,
        }}
      >
        <Typography variant="h2">{`${
          editableBoard ? 'Edit' : 'Add New'
        } Board`}</Typography>
        <Box
          sx={{ display: 'grid', rowGap: 3 }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            fullWidth
            required
            autoFocus
            label="Board Name"
            size="small"
            error={
              formik.touched.board_name && Boolean(formik.errors.board_name)
            }
            helperText={formik.touched.board_name && formik.errors.board_name}
            {...formik.getFieldProps('board_name')}
          />

          <Stack direction={'column'} spacing={1}>
            <Typography>Board Columns</Typography>
            {boardColumns.map(({ column_id, column_title }, index) => (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  columnGap: 2,
                }}
              >
                <TextField
                  size="small"
                  value={column_title}
                  placeholder="e.g. Todo"
                  required
                  onChange={(event) => {
                    changeColumn(column_id, event.target.value);
                  }}
                  error={showColumnError && column_title === ''}
                  InputProps={{
                    endAdornment:
                      showColumnError && column_title === '' ? (
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.error.main,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {"Can't be empty"}
                        </Typography>
                      ) : (
                        ''
                      ),
                  }}
                />
                <CloseOutlined
                  onClick={() => removeColumn(column_id)}
                  sx={{
                    color:
                      showColumnError && column_title === ''
                        ? theme.palette.error.main
                        : theme.common.medium_grey,
                    '&:hover': { color: theme.palette.error.main },
                  }}
                />
              </Box>
            ))}
            <Button
              color="secondary"
              variant="contained"
              disableElevation
              disabled={areColumnsLoading && editableBoard !== undefined}
              onClick={addBoardColumn}
            >
              + Add New Column
            </Button>
          </Stack>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={
              editableBoard &&
              deletedColumnIds.length === 0 &&
              updatedColumns.length === 0 &&
              editableBoard.board_name === formik.values.board_name &&
              boardColumns.length + deletedColumnIds.length === columns.length
            }
            disableElevation
          >
            {editableBoard ? 'Save Changes' : 'Create Board'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
