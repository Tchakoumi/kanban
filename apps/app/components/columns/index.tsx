import { IColumnDetails, ITask } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { AddOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Scrollbars } from 'rc-scrollbars';
import { useState } from 'react';
import TaskDetailDialog from '../task/taskDetailDialog';
import Column from './column';

export default function Columns({ columns }: { columns: IColumnDetails[] }) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  const [isTaskDetailDialogOpen, setIsTaskDetailDailogOpen] =
    useState<boolean>(true);

  const task: ITask = {
    column_id: 'heoi',
    task_description:
      'Take things easy on you I hope you are taking care of yourself while others are doing same for themselves',
    task_id: 'heooi',
    task_position: 1,
    task_title: 'Make things happen',
    total_done_subtasks: 2,
    total_undone_subtasks: 2,
  };

  const columnss: {
    column_id: string;
    column_title: string;
  }[] = [
    {
      column_id: 'heoi',
      column_title: 'Todo',
    },
    {
      column_id: 'heooi',
      column_title: 'Doing',
    },
  ];

  return (
    <>
      <TaskDetailDialog
        columns={columnss}
        task={task}
        closeDialog={() => setIsTaskDetailDailogOpen(false)}
        isDialogOpen={isTaskDetailDialogOpen}
      />
      <Box sx={{ height: '100%' }}>
        {columns.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'grid',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
              alignContent: 'center',
              rowGap: 4,
            }}
          >
            <Typography
              textAlign="center"
              variant="h2"
              color={theme.common.medium_grey}
            >
              This board is empty. Create a new column to get started.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
            >
              Add New Column
            </Button>
          </Box>
        ) : (
          <Scrollbars autoHide universal>
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                justifyContent: 'start',
                columnGap: 3,
                height: '100%',
              }}
            >
              {columns
                .sort((a, b) =>
                  a.column_position > b.column_position ? 1 : -1
                )
                .map((column, index) => (
                  <Column column={column} key={index} />
                ))}
              <Box
                sx={{
                  background:
                    activeMode === 'light'
                      ? 'linear-gradient(180deg, #E9EFFA 0%, rgba(233, 239, 250, 0.5) 100%)'
                      : 'linear-gradient(180deg, rgba(43, 44, 55, 0.25) 0%, rgba(43, 44, 55, 0.125) 100%)',
                  height: '100%',
                  display: 'grid',
                  alignItems: 'center',
                  justifyItems: 'center',
                  width: '280px',
                  marginTop: '39px',
                  borderRadius: '8px',
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: theme.common.medium_grey,
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.primary.main },
                  }}
                >
                  + New Column
                </Typography>
              </Box>
            </Box>
          </Scrollbars>
        )}
      </Box>
    </>
  );
}
