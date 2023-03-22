import { ConfirmDialog } from '@kanban/dialog';
import { IBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { Visibility } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Columns from '../components/columns';
import PrimaryNav from '../components/primaryNav';
import SecondaryNav from '../components/secondaryNav';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    //TODO: CALL API HERE TO FETCH BOARDS
    const boards: IBoard[] = [
      {
        board_id: 'sleil',
        board_name: 'Platform Launch',
        newColumns: [],
      },
      {
        board_id: 'sleisl',
        board_name: 'Platform Launcher',
        newColumns: [],
      },
    ];
    return {
      props: {
        boards,
      },
    };
  } catch (error) {
    toast.error(error.message || 'Oops, There was an error.');
    return { notFound: true };
  }
};

export function Index({ boards }: { boards: IBoard[] }) {
  const { activeMode } = useMode();
  const [isSecondaryNavOpen, setIsSecondaryNavOpen] = useState<boolean>(true);
  const theme = generateTheme(activeMode);

  const [activeBoard, setActiveBoard] = useState<IBoard>(
    boards.length > 0 ? boards[0] : undefined
  );

  function openBoard(board: IBoard) {
    setActiveBoard(board);
  }

  const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] =
    useState<boolean>(false);
  const [isConfirmDeleteBoardDialogOpen, setIsConfirmDeleteBoardDialogOpen] =
    useState<boolean>(false);

  function editBoard() {
    if (activeBoard) setIsEditBoardDialogOpen(true);
  }

  function deleteBoard() {
    if (activeBoard) setIsConfirmDeleteBoardDialogOpen(true);
  }

  return (
    <>
      <ConfirmDialog
        closeDialog={() => setIsConfirmDeleteBoardDialogOpen(false)}
        dialogMessage={`Are you sure you want to delete the "${activeBoard?.board_name}" board? This action will remove all columns and tasks and cannot be reversed.`}
        isDialogOpen={isConfirmDeleteBoardDialogOpen}
        confirmButton="Delete"
        danger
        dialogTitle="Delete this board?"
        confirm={() => {
          alert(`delete activeBoard element`);
          setActiveBoard(undefined);
        }}
      />
      <Box
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
        }}
      >
        <SecondaryNav
          boards={boards}
          openBoard={openBoard}
          activeBoard={activeBoard}
          isSecondaryNavOpen={isSecondaryNavOpen}
          closeSecondaryNav={() => setIsSecondaryNavOpen(false)}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            height: '100%',
          }}
        >
          <PrimaryNav
            boards={boards}
            openBoard={openBoard}
            activeBoard={activeBoard}
            isSecondaryNavOpen={isSecondaryNavOpen}
            editBoard={editBoard}
            deleteBoard={deleteBoard}
          />
          <Box sx={{ position: 'relative', padding: 3 }}>
            <Tooltip arrow title="Show Sidebar">
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  bottom: '32px',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.common.white,
                  padding: 1.8125,
                  borderTopRightRadius: 100,
                  borderBottomRightRadius: 100,
                  alignItems: 'center',
                  cursor: 'pointer',
                  display: isSecondaryNavOpen ? 'none' : 'grid',
                }}
                onClick={() => setIsSecondaryNavOpen(true)}
              >
                <Visibility />
              </Box>
            </Tooltip>
            <Columns />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Index;
