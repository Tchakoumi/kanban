import { ICreateBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { ErrorMessage, useNotification } from '@kanban/toast';
import { ReportRounded } from '@mui/icons-material';
import { Box, Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createNewBoard, useBoardDetails, useBoards } from '../../services';
import BoardItem from './boardItem';
import ManageBoardDialog from './manageBoardDialog';

export default function Boards() {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  const {
    push,
    query: { board_id },
  } = useRouter();

  const {
    isLoading: areColumnsLoading,
    data,
    error: columnsError,
  } = useBoardDetails(String(board_id));

  useEffect(() => {
    if (columnsError) {
      const notif = new useNotification();
      notif.notify({ render: 'Notifying' });
      notif.update({
        type: 'ERROR',
        render:
          columnsError?.message ??
          'Something went wrong while loading board details ',
        autoClose: 3000,
        icon: () => <ReportRounded fontSize="medium" color="error" />,
      });
    }
  }, [columnsError]);

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
      .then(() => {
        mutate();
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
      <Box sx={{ display: 'grid', rowGap: 1 }}>
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
                handleClick={() => push(`/${board_id}`)}
                title={board_name}
                isActive={data ? data.board_id === board_id : false}
              />
            ))}
        <BoardItem
          handleClick={() => setIsCreateBoardDialogOpen(true)}
          title={'+Create New Board'}
          colored
          disabled={areColumnsLoading}
        />
      </Box>
    </>
  );
}
