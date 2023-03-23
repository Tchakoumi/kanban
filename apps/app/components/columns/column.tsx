import { IColumnDetails } from '@kanban/interfaces';
import { Box, Typography } from '@mui/material';
import { CSSProperties } from 'react';
import Task from '../task';

function ColumnTitle({
  color_code,
  title,
  totalTasks,
}: {
  color_code: CSSProperties['color'];
  title: string;
  totalTasks: number;
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
          backgroundColor: color_code,
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
        {`${title} (${totalTasks})`}
      </Typography>
    </Box>
  );
}

export default function Column({
  column: { column_color_code: color, column_title: title, tasks },
}: {
  column: IColumnDetails;
}) {
  return (
    <Box
      sx={{
        width: '280px',
        height: '100%',
        display: 'grid',
        rowGap: 3,
        alignContent: 'start',
      }}
    >
      <ColumnTitle color_code={color} title={title} totalTasks={tasks.length} />
      <Box sx={{ display: 'grid', rowGap: 2.5 }}>
        {tasks
          .sort((a, b) => (a.task_position > b.task_position ? 1 : -1))
          .map((task, index) => (
            <Task task={task} key={index} />
          ))}
      </Box>
    </Box>
  );
}
