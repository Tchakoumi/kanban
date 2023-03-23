import { ITask } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { Box, Paper, Typography } from '@mui/material';

export default function Task({
  task: {
    task_title: title,
    total_done_subtasks: done,
    total_undone_subtasks: undone,
  },
}: {
  task: ITask;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  return (
    <Box
      component={Paper}
      elevation={1}
      sx={{
        backgroundColor:
          activeMode === 'dark' ? theme.common.dark_grey : theme.common.white,
        padding: '23px 16px',
        display: 'grid',
        rowGap: 1,
        borderRadius: '8px',
        cursor: 'pointer',
        '&:hover': {
          '& .title': {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <Typography className="title">{title}</Typography>
      {(done > 0 || undone > 0) && (
        <Typography variant="body2" sx={{ letterSpacing: 0 }}>{`${done} of ${
          undone + done
        } subtasks`}</Typography>
      )}
    </Box>
  );
}
