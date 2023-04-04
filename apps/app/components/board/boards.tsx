import { ICreateBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { ErrorMessage, useNotification } from '@kanban/toast';
import { ReportRounded } from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useState } from 'react';
import { createNewBoard, useBoards } from '../../services';
import BoardItem from './boardItem';
import ManageBoardDialog from './manageBoardDialog';

export default function Boards() {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  const {
    push,
    pathname,
    query: { board_id: activeBoardId },
  } = useRouter();

  const {
    data: boards,
    isLoading: areBoardsLoading,
    error,
    mutate,
  } = useBoards();

  useEffect(() => {
    if (error) {
      const notif = new useNotification();
      notif.notify({ render: 'Notifying' });
      notif.update({
        type: 'ERROR',
        render: error?.message ?? 'Something went wrong while loading boards ',
        autoClose: 3000,
        icon: () => <ReportRounded fontSize="medium" color="error" />,
      });
    }
  }, [error]);

  const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] =
    useState<boolean>(false);

  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function createBoardHandler(val: ICreateBoard) {
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: 'Creating new board...',
    });
    createNewBoard(val)
      .then(({ board_id }) => {
        mutate();
        push(`/${board_id}`);
        notif.update({
          render: 'Board created!',
          autoClose: 2000,
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createBoardHandler(val)}
              notification={notif}
              message={
                error?.message ||
                'Something went wrong while creating board. Please try again!!!'
              }
            />
          ),
          autoClose: 2000,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  }

  return (
    <>
      <ManageBoardDialog
        closeDialog={() => setIsCreateBoardDialogOpen(false)}
        isDialogOpen={isCreateBoardDialogOpen}
        submitDialog={createBoardHandler}
      />
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: '1fr auto',
          rowGap: 1,
        }}
      >
        <Scrollbars autoHide universal>
          <Box
            sx={{
              display: 'grid',
              rowGap: 1,
              height: '100%',
              alignContent: 'start',
            }}
          >
            <Typography
              sx={{
                padding: 1.1875,
                paddingLeft: 2,
                paddingRight: 2,
                ...theme.typography.h3,
                letterSpacing: '2.4px',
                textTransform: 'uppercase',
                color: theme.common.medium_grey,
              }}
            >{`all boards (${boards ? boards.length : 0})`}</Typography>
            {!boards || areBoardsLoading
              ? [...new Array(3)].map((_, index) => (
                  <Skeleton
                    height="68px"
                    key={index}
                    sx={{
                      borderTopRightRadius: '30px',
                      borderBottomRightRadius: '30px',
                    }}
                  />
                ))
              : boards.map(({ board_id, board_name }, index) => (
                  <BoardItem
                    key={index}
                    title={board_name}
                    handleClick={() => push(`/${board_id}`)}
                    isActive={activeBoardId === board_id}
                  />
                ))}
            <BoardItem
              colored
              title={'+Create New Board'}
              disabled={isCreateBoardDialogOpen}
              handleClick={() => setIsCreateBoardDialogOpen(true)}
            />
          </Box>
        </Scrollbars>
        <BoardItem
          colored
          dashboard
          title={'Platform Dashboard'}
          disabled={false}
          isActive={pathname === '/dashboard'}
          handleClick={() => push('/dashboard')}
        />
      </Box>
    </>
  );
}
