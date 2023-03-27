import { DialogTransition } from '@kanban/dialog';
import { ICreateTask, IEditTask, ISubtask, ITask } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { useNotification } from '@kanban/toast';
import {
  CloseOutlined,
  KeyboardArrowDownOutlined,
  ReportRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { useColumns, useSubtasks } from '../../services';

export default function ManageTaskDialog({
  isDialogOpen,
  closeDialog,
  submitDialog,
  editableTask,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  submitDialog: (val: ICreateTask | IEditTask) => void;
  editableTask?: ITask;
}) {
  const {
    query: { board_id },
  } = useRouter();
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  const { columns, areColumnsLoading, columnsError } = useColumns(
    String(board_id)
  );

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

  const initialValues: Omit<ICreateTask, 'newSubtasks'> = editableTask ?? {
    column_id: '',
    task_description: '',
    task_title: '',
  };

  const validationSchema = Yup.object().shape({
    task_title: Yup.string().required(),
    task_description: Yup.string().required(),
    column_id: Yup.string()
      .oneOf(columns.map(({ column_id }) => column_id))
      .required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      const newTask: ICreateTask = {
        ...values,
        newSubtasks: subtasks.map(({ subtask_title }) => {
          return { subtask_title };
        }),
      };

      const editedTask: IEditTask = {
        ...values,
        task_id: editableTask.task_id,
        deletedSubtaskIds,
        updatedSubtasks,
        newTasks: subtasks
          .filter(
            ({ subtask_id: s_id }) =>
              !subTasks.find(({ subtask_id: st_id }) => st_id === s_id)
          )
          .map(({ subtask_title }) => {
            return { subtask_title };
          }),
      };
      submitDialog(editableTask ? editedTask : newTask);
      resetForm();
      handleClose();
    },
  });

  const {
    subTasks,
    isLoading: areSubtasksLoading,
    error: subtaskError,
  } = useSubtasks(editableTask ? editableTask.task_id : '');

  if (subtaskError) {
    //TODO: THE BELOW ERROR COMES FROM BACKEND WHEN THE STRING IS EMPTY.
    if (subtaskError !== 'errorForEmptyStringTaskId') {
      const notif = new useNotification();
      notif.notify({ render: 'Notifying' });
      notif.update({
        type: 'ERROR',
        render: subtaskError ?? 'Something went wrong while loading subtasks ',
        autoClose: 3000,
        icon: () => <ReportRounded fontSize="medium" color="error" />,
      });
    }
  }

  const [deletedSubtaskIds, setDeletedSubtaskIds] = useState<string[]>([]);
  const [updatedSubtasks, setUpdatedSubtasks] = useState<ISubtask[]>([]);

  const [subtasks, setSubtasks] = useState<ISubtask[]>([]);

  if (
    subtasks.length + deletedSubtaskIds.length < subTasks.length &&
    editableTask
  )
    setSubtasks(subTasks);

  function handleClose() {
    closeDialog();
    formik.resetForm();
    setSubtasks([]);
    setDeletedSubtaskIds([]);
    setUpdatedSubtasks([]);
  }

  const [showSubtaskError, setShowSubtaskError] = useState<boolean>(false);

  function removeSubTask(subtask_id: string) {
    if (editableTask) {
      if (subTasks.find(({ subtask_id: s_id }) => s_id === subtask_id)) {
        setDeletedSubtaskIds([...deletedSubtaskIds, subtask_id]);
        //remove the deleted task from list of updated tasks (in case it was updated before deleted)
        setUpdatedSubtasks(
          updatedSubtasks.filter(({ subtask_id: s_id }) => s_id !== subtask_id)
        );
      }
    }

    setSubtasks(
      subtasks.filter(({ subtask_id: s_id, subtask_title: st }) => {
        if (st === '') setShowSubtaskError(false);
        return s_id !== subtask_id;
      })
    );
  }

  function changeSubTask(subtask_id, value) {
    const editedSubtask = subTasks.find(
      ({ subtask_id: s_id }) => s_id === subtask_id
    );
    if (editedSubtask) {
      const newUpdated = updatedSubtasks.filter(
        ({ subtask_id: s_id }) => s_id !== subtask_id
      );
      setUpdatedSubtasks(
        editedSubtask.subtask_title === value
          ? newUpdated
          : [...newUpdated, { ...editedSubtask, subtask_title: value }]
      );
    }

    const newSubtasks = subtasks.map((subtask) => {
      const { subtask_id: s_id } = subtask;
      if (s_id !== subtask_id) return subtask;

      //ONLY REMOVE ERROR WHEN THERE'S NO OTHER LEFT
      if (!subtasks.find(({ subtask_title: st }) => st === ''))
        setShowSubtaskError(false);

      if (value === '') setShowSubtaskError(true);
      return { ...subtask, subtask_title: value };
    });

    setSubtasks(newSubtasks);
  }

  function addSubtask() {
    if (subtasks.find(({ subtask_title: st }) => st === ''))
      setShowSubtaskError(true);
    else
      setSubtasks([
        ...subtasks,
        { is_done: false, subtask_id: uuidv4(), subtask_title: '' },
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
          editableTask ? 'Edit' : 'Add New'
        } Task`}</Typography>
        <Box
          sx={{ display: 'grid', rowGap: 3 }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            fullWidth
            required
            autoFocus
            label="Title"
            size="small"
            error={
              formik.touched.task_title && Boolean(formik.errors.task_title)
            }
            helperText={formik.touched.task_title && formik.errors.task_title}
            {...formik.getFieldProps('task_title')}
          />
          <TextField
            fullWidth
            required
            multiline
            size="small"
            rows={3}
            label="Title"
            placeholder="e.g. It's always good to take a break. This 15 minute break will 
            recharge the batteries a little."
            error={
              formik.touched.task_description &&
              Boolean(formik.errors.task_description)
            }
            helperText={
              formik.touched.task_description && formik.errors.task_description
            }
            {...formik.getFieldProps('task_description')}
          />

          <Stack direction={'column'} spacing={1}>
            <Typography>Subtasks</Typography>
            {subtasks.map(({ subtask_id, subtask_title }, index) => (
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
                  value={subtask_title}
                  placeholder="e.g. Make coffee"
                  required
                  onChange={(event) => {
                    changeSubTask(subtask_id, event.target.value);
                  }}
                  error={showSubtaskError && subtask_title === ''}
                  InputProps={{
                    endAdornment:
                      showSubtaskError && subtask_title === '' ? (
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
                  onClick={() => removeSubTask(subtask_id)}
                  sx={{
                    color:
                      showSubtaskError && subtask_title === ''
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
              disabled={areSubtasksLoading && editableTask !== undefined}
              onClick={addSubtask}
            >
              + Add New Subtask
            </Button>
          </Stack>

          <Stack direction={'column'} spacing={1}>
            <Typography>Status</Typography>
            <FormControl fullWidth>
              <Select
                IconComponent={KeyboardArrowDownOutlined}
                error={
                  formik.touched.column_id && Boolean(formik.errors.column_id)
                }
                {...formik.getFieldProps('column_id')}
                size="small"
                disabled={areColumnsLoading}
                sx={{ ...theme.typography.caption }}
                input={<OutlinedInput />}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8,
                      width: 250,
                    },
                  },
                }}
              >
                {columns.map(({ column_id, column_title }, index) => (
                  <MenuItem
                    key={index}
                    value={column_id}
                    sx={{
                      ...theme.typography.caption,
                      color: theme.common.medium_grey,
                    }}
                  >
                    {column_title}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.column_id && formik.errors.column_id && (
                <FormHelperText sx={{ color: theme.palette.error.main }}>
                  {formik.errors.column_id}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={
              editableTask &&
              deletedSubtaskIds.length === 0 &&
              updatedSubtasks.length === 0 &&
              editableTask.task_title === formik.values.task_title &&
              formik.values.task_description ===
                editableTask.task_description &&
              formik.values.column_id === editableTask.column_id &&
              subtasks.length + deletedSubtaskIds.length === subTasks.length
            }
            disableElevation
          >
            {editableTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
