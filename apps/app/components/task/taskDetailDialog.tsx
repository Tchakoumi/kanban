import { DialogTransition } from '@kanban/dialog';
import { ITask } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { useNotification } from '@kanban/toast';
import {
  KeyboardArrowDownOutlined,
  MoreVertOutlined,
  ReportRounded,
} from '@mui/icons-material';
import {
  Box,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useColumns, useSubtasks } from '../../services';
import Subtask from './subtask';
import TaskMore from './taskMore';

export default function TaskDetailDialog({
  isDialogOpen,
  closeDialog,
  task: {
    column_id: c_id,
    task_description: description,
    task_title: title,
    task_id,
  },
  handleEdit,
  handleDelete,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  task: ITask;
  handleEdit: () => void;
  handleDelete: () => void;
}) {
  const {
    query: { board_id },
  } = useRouter();
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  const {
    subTasks,
    isLoading: areSubtasksLoading,
    error: isError,
  } = useSubtasks(task_id);
  const { columns, areColumnsLoading, columnsError } = useColumns(
    String(board_id)
  );

  if (columnsError) {
    const notif = new useNotification();
    notif.notify({ render: 'Notifying' });
    notif.update({
      type: 'ERROR',
      render: columnsError ?? 'Something went wrong while loading ',
      autoClose: 3000,
      icon: () => <ReportRounded fontSize="medium" color="error" />,
    });
  }

  function changeTaskColumn(new_column_id: string) {
    //TODO: CALL API HERE TO CHANGE TASKS COLUMN ID SENDING IT TO THE LAST POSITION. USE DATA task_id and new_column_id
    //TODO: MUTATE useBoardDetails
    alert(`moved task "${task_id}" to column "${new_column_id}"`);
  }

  function handleCheckSubtask(subtask_id: string, new_status: boolean) {
    //TODO: CALL API HERE TO CHANGE SUBTASKS DONE STATUS
    //TODO: MUTATE useBoardDetails
    alert(`changed task's done status`);
  }

  if (isError) {
    const notif = new useNotification();
    notif.notify({ render: 'Notifying' });
    notif.update({
      type: 'ERROR',
      render: isError ?? 'Something went wrong while loading ',
      autoClose: 3000,
      icon: () => <ReportRounded fontSize="medium" color="error" />,
    });
  }

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function closeMenu() {
    setIsMoreMenuOpen(false);
    setAnchorEl(null);
  }

  //TODO make change subtask status and change task column disabled during revalidating of useBoardDetails
  return (
    <>
      <TaskMore
        anchorEl={anchorEl}
        closeMenu={closeMenu}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        isMenuOpen={isMoreMenuOpen}
      />
      <Dialog
        open={isDialogOpen}
        TransitionComponent={DialogTransition}
        onClose={closeDialog}
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              columnGap: 3,
              alignItems: 'center',
            }}
          >
            <Typography variant="h2">{title}</Typography>
            <Tooltip arrow title="More">
              <IconButton
                size="small"
                onClick={(event) => {
                  setIsMoreMenuOpen(true);
                  setAnchorEl(event.currentTarget);
                }}
              >
                <MoreVertOutlined />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="caption"
            sx={{ color: theme.common.medium_grey }}
          >
            {description}
          </Typography>

          <Stack direction="column" spacing={2}>
            <Typography
              variant="h3"
              sx={{ color: theme.common.medium_grey }}
            >{`Subtasks (${2} of ${3})`}</Typography>

            <Stack direction="column" spacing={1}>
              {areSubtasksLoading
                ? [...new Array(2)].map((_, index) => (
                    <Skeleton key={index} height={48} />
                  ))
                : subTasks.map((subtask, index) => (
                    <Subtask
                      subtask={subtask}
                      key={index}
                      handleCheckSubtask={(status) =>
                        handleCheckSubtask(subtask.subtask_id, status)
                      }
                    />
                  ))}
            </Stack>
          </Stack>

          <FormControl>
            <Select
              displayEmpty
              IconComponent={KeyboardArrowDownOutlined}
              fullWidth
              size="small"
              value={c_id}
              disabled={areColumnsLoading}
              onChange={(event) => changeTaskColumn(event.target.value)}
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
          </FormControl>
        </Box>
      </Dialog>
    </>
  );
}
