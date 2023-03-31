import { generateTheme, useMode } from '@kanban/theme';
import { useNotification } from '@kanban/toast';
import { AddOutlined, ReportRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Scrollbars from 'rc-scrollbars';
import { useEffect } from 'react';
import { useBoardDetails } from '../../services';
import Column from './column';
import ColumnSkeleton from './columnSkeleton';

export default function Columns() {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  const {
    query: { board_id },
  } = useRouter();

  const {
    isLoading: areColumnsLoading,
    data: boardDetails,
    error: columnsError,
  } = useBoardDetails(String(board_id));

  useEffect(() => {
    if (columnsError) {
      const notif = new useNotification();
      notif.notify({ render: 'Notifying' });
      notif.update({
        type: 'ERROR',
        render:
          columnsError?.message ?? 'Something went wrong while loading boards ',
        autoClose: 3000,
        icon: () => <ReportRounded fontSize="medium" color="error" />,
      });
    }
  }, [columnsError]);

  return (
    <Box sx={{ height: '100%' }}>
      {areColumnsLoading || !boardDetails ? (
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
            {[...new Array(3)].map((_, index) => (
              <ColumnSkeleton key={index} />
            ))}
          </Box>
        </Scrollbars>
      ) : (boardDetails.columns ?? []).length === 0 ? (
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
            {boardDetails.columns
              .sort((a, b) => (a.column_position > b.column_position ? 1 : -1))
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
  );
}
