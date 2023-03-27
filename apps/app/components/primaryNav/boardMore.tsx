import { ConfirmDialog } from '@kanban/dialog';
import { generateTheme } from '@kanban/theme';
import { MoreVertOutlined, ReportRounded } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useActiveBoard } from '../../services';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ManageBoardDialog from '../board/manageBoardDialog';
import { IEditBoard } from '@kanban/interfaces';
import { ErrorMessage, useNotification } from '@kanban/toast';

export default function BoardMore({ disabled }: { disabled: boolean }) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    push,
    query: { board_id },
  } = useRouter();

  const { data: activeBoard } = useActiveBoard(board_id as string);

  function closeMenu() {
    setIsMoreMenuOpen(false);
    setAnchorEl(null);
  }

  const [isConfirmDeleteBoardDialogOpen, setIsConfirmDeleteBoardDialogOpen] =
    useState<boolean>(false);

  function deleteBoard() {
    if (activeBoard) setIsConfirmDeleteBoardDialogOpen(true);
    else alert('No active board');
  }

  const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] =
    useState<boolean>(false);
  function editBoard() {
    if (activeBoard) setIsEditBoardDialogOpen(true);
  }

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function saveEditedBoard(val: IEditBoard) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: 'Saving board modifications...',
    });
    setTimeout(() => {
      //TODO: CALL API HERE TO edit board with data val
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        notif.update({
          render: 'Board saved!',
        });
        setSubmissionNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => saveEditedBoard(val)}
              notification={notif}
              //TODO: message should come from backend
              message={
                'Something went wrong while saving board. Please try again!!!'
              }
            />
          ),
          autoClose: 2000,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
      setIsSubmitting(undefined);
    }, 3000);

    //TODO: MUTATE useBoardDetails
    //TODO: MUTATE useBoard
  }

  return (
    <>
      <ManageBoardDialog
        closeDialog={() => setIsEditBoardDialogOpen(false)}
        isDialogOpen={isEditBoardDialogOpen}
        submitDialog={saveEditedBoard}
        editableBoard={activeBoard}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmDeleteBoardDialogOpen(false)}
        dialogMessage={`Are you sure you want to delete the " ${activeBoard?.board_name} " board? This action will remove all columns and tasks and cannot be reversed.`}
        isDialogOpen={isConfirmDeleteBoardDialogOpen}
        confirmButton="Delete"
        danger
        dialogTitle="Delete this board?"
        confirm={() => {
          alert(`delete activeBoard element`);
          push('/');
        }}
      />

      <Tooltip arrow title="more">
        <IconButton
          disabled={disabled || isSubmitting}
          size="small"
          onClick={(event) => {
            setIsMoreMenuOpen(true);
            setAnchorEl(event.currentTarget);
          }}
        >
          <MoreVertOutlined />
        </IconButton>
      </Tooltip>
      <Menu
        elevation={0}
        anchorEl={anchorEl}
        open={isMoreMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 60,
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={() => {
            editBoard();
            closeMenu();
          }}
          sx={{
            ...generateTheme().typography.caption,
            color: generateTheme().common.medium_grey,
          }}
        >
          Edit Board
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            deleteBoard();
          }}
          sx={{
            color: generateTheme().palette.error.main,
            ...generateTheme().typography.caption,
          }}
        >
          Delete Board
        </MenuItem>
      </Menu>
    </>
  );
}
