import { ConfirmDialog } from '@kanban/dialog';
import { IColumnDetails, IEditTask, ITask } from '@kanban/interfaces';
import { ErrorMessage, useNotification } from '@kanban/toast';
import { ReportRounded } from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { deleteTask, updateTask, useActiveBoard } from '../../services';
import { CSSProperties, useState } from 'react';
import Task from '../task';
import ManageTaskDialog from '../task/manageTaskDialog';
import TaskDetailDialog from '../task/taskDetailDialog';
import randomColor from '../../common';
import Scrollbars from 'rc-scrollbars';

export function ColumnTitle({
  color_code,
  title,
  totalTasks,
  skeleton = false,
}: {
  color_code: CSSProperties['color'];
  title: string;
  totalTasks: number;
  skeleton?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: 1.5,
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: skeleton ? randomColor() : color_code,
          height: '15px',
          width: '15px',
          borderRadius: '100%',
        }}
      />
      <Typography
        variant="body2"
        sx={{
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textTransform: 'uppercase',
        }}
      >
        {skeleton ? (
          <Skeleton sx={{ maxWidth: '120px' }} />
        ) : (
          `${title} (${totalTasks})`
        )}
      </Typography>
    </Box>
  );
}

export default function Column({
  column: { column_color_code: color, column_title: title, tasks },
}: {
  column: IColumnDetails;
}) {
  const [isTaskDetailDailogOpen, setIsTaskDetailDialogOpen] =
    useState<boolean>(false);
  const [openTask, setOpenTask] = useState<ITask>();

  const [isConfirmDeleteTaskDialogOpen, setIsConfirmDeleteTaskDialogOpen] =
    useState<boolean>(false);

  const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] =
    useState<boolean>(false);

  const [actionnedTask, setActionnedTask] = useState<string>();
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  const { mutate } = useActiveBoard(String(actionnedTask));

  function deleteTaskHandler(task_id: string) {
    setActionnedTask(task_id);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: 'Deleting task...',
    });
    deleteTask(task_id)
      .then(() => {
        mutate();
        notif.update({
          render: 'Task Deleted',
          autoClose: 2000,
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => deleteTaskHandler(task_id)}
              notification={notif}
              message={
                error?.message ||
                'Something went wrong while deleting task. Please try again!!!'
              }
            />
          ),
          autoClose: 5000,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setActionnedTask(undefined));
  }

  function editTask(val: IEditTask) {
    setActionnedTask(val.task_id);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: 'Saving task modifications...',
    });
    updateTask(val.task_id, val)
      .then(() => {
        mutate();
        notif.update({
          render: 'Task saved!',
          autoClose: 2000,
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => editTask(val)}
              notification={notif}
              message={
                error?.message ||
                'Something went wrong while saving task. Please try again!!!'
              }
            />
          ),
          autoClose: 5000,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setActionnedTask(undefined));
  }

  return (
    <>
      {openTask && (
        <>
          <ManageTaskDialog
            closeDialog={() => setIsEditBoardDialogOpen(false)}
            isDialogOpen={isEditBoardDialogOpen}
            submitDialog={editTask}
            editableTask={openTask}
          />
          <TaskDetailDialog
            task={openTask}
            closeDialog={() => setIsTaskDetailDialogOpen(false)}
            isDialogOpen={isTaskDetailDailogOpen}
            handleDelete={() => {
              setIsTaskDetailDialogOpen(false);
              setIsConfirmDeleteTaskDialogOpen(true);
            }}
            handleEdit={() => {
              setIsTaskDetailDialogOpen(false);
              setIsEditBoardDialogOpen(true);
            }}
          />
          <ConfirmDialog
            closeDialog={() => {
              setOpenTask(undefined);
              setIsConfirmDeleteTaskDialogOpen(false);
            }}
            dialogMessage={`Are you sure you want to delete the " ${openTask.task_title} " task and its subtasks? This action cannot be reversed.`}
            isDialogOpen={isConfirmDeleteTaskDialogOpen}
            confirmButton="Delete"
            danger
            dialogTitle="Delete this task?"
            confirm={() => {
              deleteTaskHandler(openTask.task_id);
            }}
          />
        </>
      )}

      <Box
        sx={{
          width: '280px',
          height: '100%',
          display: 'grid',
          rowGap: 3,
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <ColumnTitle
          color_code={color}
          title={title}
          totalTasks={tasks.length}
        />
        <Scrollbars autoHide universal>
          <Box
            sx={{
              display: 'grid',
              height: '100%',
              alignContent: 'start',
              rowGap: 2.5,
            }}
          >
            {tasks
              .sort((a, b) => (a.task_position > b.task_position ? 1 : -1))
              .map((task, index) => (
                <Task
                  task={task}
                  key={index}
                  openDetails={
                    actionnedTask === task.task_id
                      ? null
                      : () => {
                          setIsTaskDetailDialogOpen(true);
                          setOpenTask(task);
                        }
                  }
                />
              ))}
          </Box>
        </Scrollbars>
      </Box>
    </>
  );
}
