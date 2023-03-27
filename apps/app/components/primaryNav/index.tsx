import { ICreateTask } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { ErrorMessage, useNotification } from '@kanban/toast';
import { AddOutlined, ReportRounded } from '@mui/icons-material';
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import favicon from '../../public/favicon_colored.png';
import logo_dark from '../../public/logo_dark.png';
import logo_light from '../../public/logo_light.png';
import { createNewTask, useBoardDetails, useColumns } from '../../services';
import ManageTaskDialog from '../task/manageTaskDialog';
import ActiveBoard from './activeBoard';
import BoardMore from './boardMore';

export default function PrimaryNav({
  isSecondaryNavOpen,
}: {
  isSecondaryNavOpen: boolean;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme();
  const {
    query: { board_id },
  } = useRouter();
  const { data: activeBoard, mutate } = useBoardDetails(board_id as string);

  const {
    data: columns,
    error: columnsError,
    isLoading: areColumnsLoading,
  } = useColumns(String(board_id));

  if (columnsError) {
    const notif = new useNotification();
    notif.notify({ render: 'Notifying' });
    notif.update({
      type: 'ERROR',
      render: columnsError ?? 'Something went wrong while loading columns ',
      autoClose: 3000,
      icon: () => <ReportRounded fontSize="medium" color="error" />,
    });
  }

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function createTask(task: ICreateTask) {
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: 'Creating task...',
    });
    createNewTask(task)
      .then(() => {
        mutate();
        notif.update({
          render: 'Task Created',
          autoClose: 2000,
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createTask(task)}
              notification={notif}
              message={
                error?.message ||
                'Something went wrong while creating task. Please try again!!!'
              }
            />
          ),
          autoClose: 5000,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  }

  return (
    <>
      <ManageTaskDialog
        closeDialog={() => setIsAddDialogOpen(false)}
        isDialogOpen={isAddDialogOpen}
        submitDialog={createTask}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            mobile: 'auto 1fr',
            tablet: isSecondaryNavOpen ? '1fr' : 'auto 1fr',
          },
          columnGap: 3,
          backgroundColor:
            activeMode === 'light'
              ? theme.common.white
              : theme.common.dark_grey,
          alignItems: 'center',
          paddingLeft: 3,
          paddingRight: 3,
          height: {
            desktop: '96px',
            tabled: '80px',
            mobile: '64px',
          },
        }}
      >
        <Box
          sx={{
            display: {
              mobile: 'grid',
              tablet: isSecondaryNavOpen ? 'none' : 'grid',
            },
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: {
                mobile: 'none',
                tablet: 'block',
              },
            }}
          >
            <Image
              src={activeMode === 'dark' ? logo_dark : logo_light}
              alt="Kanban"
            />
          </Box>
          <Box
            sx={{
              display: {
                mobile: 'block',
                tablet: 'none',
              },
            }}
          >
            <Image src={favicon} alt="Kanban" />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isSecondaryNavOpen
              ? '1fr auto'
              : 'auto 1fr auto',
            columnGap: 3,
            alignSelf: 'stretch',
            alignItems: 'center',
          }}
        >
          <Divider
            sx={{
              display: isSecondaryNavOpen ? 'none' : 'block',
              backgroundColor:
                generateTheme(activeMode).common[
                  activeMode === 'light' ? 'line_light' : 'line_dark'
                ],
              alignSelf: 'stretch',
            }}
            orientation="vertical"
          />
          <ActiveBoard />
          <Box
            sx={{
              justifySelf: 'end',
              display: 'grid',
              alignItems: 'center',
              gridAutoFlow: 'column',
              gap: 1,
            }}
          >
            <Tooltip
              arrow
              title="Add new task"
              sx={{
                display: {
                  mobile: 'block',
                  tablet: 'none',
                },
              }}
            >
              <Button
                color="primary"
                variant="contained"
                disabled={
                  !activeBoard || areColumnsLoading || columns.length === 0
                }
                startIcon={<AddOutlined />}
                onClick={() => setIsAddDialogOpen(true)}
                sx={{
                  '&:disabled': {
                    backgroundColor: 'rgba(99, 95, 199, 1)',
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: {
                      mobile: 0,
                      tablet: 1,
                    },
                    marginLeft: {
                      mobile: 0,
                      tablet: -0.5,
                    },
                  },
                }}
              >
                <Typography
                  variant="button"
                  sx={{
                    textTransform: 'none',
                    display: {
                      tablet: 'block',
                      mobile: 'none',
                    },
                  }}
                >
                  Add New Task
                </Typography>
              </Button>
            </Tooltip>
            <BoardMore disabled={!activeBoard} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
