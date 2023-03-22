import { IColumn } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { AddOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

export default function Columns({ columns }: { columns: IColumn[] }) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  return (
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
        'Columns'
      )}
    </Box>
  );
}
