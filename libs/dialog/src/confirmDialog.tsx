import { generateTheme } from '@kanban/theme';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DialogTransition } from './dialog-transition';

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
  const theme = generateTheme();

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle
        sx={{
          color: danger ? generateTheme().palette.error.main : 'initial',
          ...theme.typography.h2,
        }}
      >
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            width: {
              mobile: 'initial',
              tablet: '480px',
            },
            justifySelf: 'center',
            whiteSpace: 'break-spaces',
            ...theme.typography.caption,
          }}
        >
          {dialogMessage}
        </DialogContentText>
      </DialogContent>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: 2,
          padding: '0 24px',
          paddingBottom: '20px',
        }}
      >
        <Button
          sx={{ textTransform: 'none' }}
          color={danger ? 'error' : 'primary'}
          variant={danger ? 'contained' : 'outlined'}
          onClick={() => {
            confirm();
            closeDialog();
          }}
          disableElevation
        >
          {confirmButton}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          color={danger ? 'secondary' : 'error'}
          variant={danger ? 'contained' : 'text'}
          onClick={closeDialog}
          disableElevation
        >
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
}
