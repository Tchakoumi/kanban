import { ISubtask } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { Checkbox, lighten, Stack, Typography } from '@mui/material';

export default function Subtask({
  subtask: { is_done, subtask_title: title },
  handleCheckSubtask,
}: {
  subtask: ISubtask;
  handleCheckSubtask: (new_status: boolean) => void;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.common.light_grey
            : theme.common.very_dark_grey,
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: !is_done
            ? lighten(theme.palette.primary.main, 0.25)
            : '',
        },
      }}
      component="label"
    >
      <Checkbox
        color="primary"
        onChange={(event) => handleCheckSubtask(event.target.checked)}
        checked={is_done}
      />
      <Typography
        variant="h3"
        sx={{
          textDecoration: is_done ? 'line-through' : 'none',
          color: is_done ? theme.common.medium_grey : '',
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}
