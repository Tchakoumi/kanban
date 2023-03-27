import { ICreateBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { ErrorMessage, useNotification } from '@kanban/toast';
import { ReportRounded } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useActiveBoard, useBoards } from '../../services';
import BoardItem from './boardItem';
import ManageBoardDialog from './manageBoardDialog';

export default function Boards() {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  const {
    push,
    query: { board_id },
  } = useRouter();

  const { activeBoard, isLoading, isError } = useActiveBoard(String(board_id));

  if (isError) {
    const notif = new useNotification();
    notif.notify({ render: 'Notifying' });
    notif.update({
      type: 'ERROR',
      render: isError
        ? 'errorMessage'
        : 'Something went wrong while loading boards ',
      autoClose: 3000,
      icon: () => <ReportRounded fontSize="medium" color="error" />,
    });
  }

  const { data: boards, isLoading: areBoardsLoading, error } = useBoards();

  useEffect(() => {
    if (error) {
      const notif = new useNotification();
      notif.notify({ render: 'Notifying' });
      notif.update({
        type: 'ERROR',
        render: error ?? 'Something went wrong while loading boards ',
        autoClose: 3000,
        icon: () => <ReportRounded fontSize="medium" color="error" />,
      });
    }
  }, [error]);

  const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] =
    useState<boolean>(false);

  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function createBoard(val: ICreateBoard) {
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: 'Creating new board...',
    });
    setTimeout(() => {
      //TODO: CALL API HERE TO create board with data val
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        notif.update({
          render: 'Board created!',
          autoClose: 2000,
        });
        setSubmissionNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createBoard(val)}
              notification={notif}
              //TODO: message should come from backend
              message={
                'Something went wrong while creating board. Please try again!!!'
              }
            />
          ),
          autoClose: 2000,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);

    //TODO: MUTATE useBoard
  }

  return (
    <>
      <ManageBoardDialog
        closeDialog={() => setIsCreateBoardDialogOpen(false)}
        isDialogOpen={isCreateBoardDialogOpen}
        submitDialog={createBoard}
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
        {/* TODO: SKELETON SCREEN */}

        {!boards || areBoardsLoading
          ? 'Skeleton screen'
          : boards.map(({ board_id, board_name }, index) => (
              <BoardItem
                key={index}
                handleClick={() => push(`/${board_id}`)}
                title={board_name}
                isActive={activeBoard?.board_id === board_id}
              />
            ))}
        <BoardItem
          handleClick={() => setIsCreateBoardDialogOpen(true)}
          title={'+Create New Board'}
          colored
          disabled={isLoading}
        />
      </Box>
    </>
  );
}
