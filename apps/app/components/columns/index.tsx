import { ICreateBoard, ICreateColumn } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { ErrorMessage, useNotification } from '@kanban/toast';
import { AddOutlined, ReportRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useState } from 'react';
import {
  createNewBoard,
  createNewColumn,
  useBoardDetails,
  useBoards,
} from '../../services';
import ManageBoardDialog from '../board/manageBoardDialog';
import Column from './column';
import ColumnSkeleton from './columnSkeleton';
import NewColumDialog from './newColumnDialog';

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
    mutate: mutateActiveBoard,
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

  const [isNewBoardDialogOpen, setIsNewBoardDialogOpen] =
    useState<boolean>(false);
  const [isNewColumnDialogOpen, setIsNewColumnDialogOpen] =
    useState<boolean>(false);

  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();
  const { mutate } = useBoards();

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

  function createColumnHandler(val: ICreateColumn) {
    const notif = new useNotification();
    if (submissionNotif) submissionNotif.dismiss();
    setSubmissionNotif(notif);
    notif.notify({
      render: 'Creating column...',
    });
    createNewColumn(val)
      .then(() => {
        notif.update({
          render: 'Created column successfully',
        });
        setSubmissionNotif(undefined);
        mutateActiveBoard();
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createColumnHandler(val)}
              notification={notif}
              message={
                error?.message ||
                'There was a problem creating column. Please try again!!!'
              }
            />
          ),
        });
      });
  }

  return (
    <>
      <ManageBoardDialog
        closeDialog={() => setIsNewBoardDialogOpen(false)}
        isDialogOpen={isNewBoardDialogOpen}
        submitDialog={createBoardHandler}
      />
      <NewColumDialog
        closeDialog={() => setIsNewColumnDialogOpen(false)}
        isDialogOpen={isNewColumnDialogOpen}
        submitDialog={createColumnHandler}
      />
      <Box sx={{ height: '100%' }}>
        {areColumnsLoading ? (
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
        ) : (boardDetails?.columns ?? []).length === 0 ? (
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
              {board_id
                ? 'This board is empty. Create a new column to get started.'
                : 'This space is empty. Create a new board to get started.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
              onClick={() => {
                if (board_id) setIsNewColumnDialogOpen(true);
                else setIsNewBoardDialogOpen(true);
              }}
            >
              {board_id ? `Add New Column` : 'Add New Board'}
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
                .sort((a, b) =>
                  a.column_position > b.column_position ? 1 : -1
                )
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
    </>
  );
}
