import { generateTheme, useMode } from '@kanban/theme';
import { Box, Paper, Skeleton, Typography } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { ColumnTitle } from './column';

export default function ColumnSkeleton() {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  return (
    <Box
      sx={{
        width: '280px',
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: 3,
      }}
    >
      <ColumnTitle color_code={''} title={''} skeleton totalTasks={0} />
      <Scrollbars autoHide universal>
        <Box
          sx={{
            display: 'grid',
            height: '100%',
            alignContent: 'start',
            rowGap: 2.5,
          }}
        >
          {[...new Array(5)].map((_, index) => (
            <Box
              key={index}
              component={Paper}
              elevation={1}
              sx={{
                backgroundColor:
                  activeMode === 'dark'
                    ? theme.common.dark_grey
                    : theme.common.white,
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
              <Typography>
                <Skeleton />
              </Typography>
              <Typography
                variant="body2"
                sx={{ letterSpacing: 0 }}
              >{`${0} of ${0} subtasks`}</Typography>
            </Box>
          ))}
        </Box>
      </Scrollbars>
    </Box>
  );
}
