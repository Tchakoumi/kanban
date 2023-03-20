import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DialogTransition } from './dialog-transition';
import { generateTheme } from '@kanban/theme';

export function ConfirmDialog({
  isDialogOpen,
  closeDialog,
  confirm,
  dialogMessage,
  dialogTitle = 'delete',
  confirmButton = 'delete',
  danger = false,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: () => void;
  dialogMessage: string;
  dialogTitle?: string;
  confirmButton?: string;
  danger?: boolean;
}) {
  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle
        sx={{ color: danger ? generateTheme().palette.error.main : 'initial' }}
      >
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          color={danger ? 'error' : 'primary'}
          variant={danger ? 'outlined' : 'contained'}
          onClick={() => {
            confirm();
            closeDialog();
          }}
        >
          {confirmButton}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          color={danger ? 'primary' : 'error'}
          variant={danger ? 'outlined' : 'text'}
          onClick={closeDialog}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
