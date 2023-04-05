import { generateTheme, useMode } from '@kanban/theme';
import { useNotification } from '@kanban/toast';
import { ReportRounded } from '@mui/icons-material';
import { Box, Skeleton } from '@mui/material';
import Chart, { ChartItem } from 'chart.js/auto';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useStatistics } from '../../services';

export default function Graph() {
  const { formatNumber, formatDate } = useIntl();
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  const {
    data,
    error: graphDataError,
    isLoading: isDataLoading,
  } = useStatistics();

  useEffect(() => {
    if (graphDataError) {
      const notif = new useNotification();
      notif.notify({ render: 'Notifying' });
      notif.update({
        type: 'ERROR',
        render:
          graphDataError?.message ??
          'Something went wrong while loading boards ',
        autoClose: 3000,
        icon: () => <ReportRounded fontSize="medium" color="error" />,
      });
    }
  }, [graphDataError]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = (data: any) => {
    return {
      type: 'line',
      data,
      options: {
        maintainAspectRatio: true,
        responsive: true,
        // aspectRatio: ,
        tension: 0.2,
        scales: {
          y: {
            stacked: true,
            grid: {
              display: true,
              color: theme.common.line_light,
            },
          },
          x: {
            grid: {
              display: true,
              color: theme.common.line_light,
            },
          },
        },
        parsing: {
          xAxisKey: 'datetime',
          yAxisKey: 'count',
        },
      },
    };
  };

  const updateGraph = () => {
    const dataChart = Chart.getChart('dataChart');
    if (dataChart) dataChart.destroy();

    new Chart(
      document.getElementById('dataChart') as ChartItem,
      config({
        datasets: [
          {
            label: 'Task movements over time',
            data: (data ? data.movedTasksStats : [])
              .sort((a, b) =>
                new Date(a.datetime) > new Date(b.datetime) ? -1 : 1
              )
              .map(({ datetime, count }) => ({
                count: formatNumber(count),
                datetime: formatDate(datetime, {
                  year: '2-digit',
                  month: 'short',
                  day: '2-digit',
                }),
              })),
            borderColor: theme.palette.primary.light,
            fill: true,
            order: 2,
          },
          {
            label: 'Task updates over time',
            data: (data ? data.updatedTaskStats : [])
              .sort((a, b) =>
                new Date(a.datetime) > new Date(b.datetime) ? -1 : 1
              )
              .map(({ datetime, count }) => ({
                count: formatNumber(count),
                datetime: formatDate(datetime, {
                  year: '2-digit',
                  month: 'short',
                  day: '2-digit',
                }),
              })),

            borderColor: theme.palette.error.light,
            fill: true,
            order: 2,
          },
        ],
      })
    );
  };

  useEffect(() => {
    updateGraph();
    // eslint-disable-next-line
  }, [data]);

  return (
    <>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: isDataLoading ? 'none' : 'grid',
          justifyItems: 'center',
        }}
      >
        <Box component={'canvas'} id="dataChart"></Box>
      </div>
      {isDataLoading && (
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            columnGap: theme.spacing(1),
            width: '100%',
            height: '100%',
          }}
        >
          {[...new Array(9)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              animation="wave"
              height={`${(index + 1) * 10}%`}
            />
          ))}
        </div>
      )}
    </>
  );
}
