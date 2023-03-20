import { DoneAllRounded } from '@mui/icons-material';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Id, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { generateTheme } from '@kanban/theme';

export class useNotification {
  toastId: Id;
  constructor() {
    this.toastId = uuidv4();
  }
  notify = ({ render }: { render: string | JSX.Element }) =>
    (this.toastId = toast.dark(
      <Typography variant="caption">{render}</Typography>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        icon: () => (
          <CircularProgress
            sx={{ color: generateTheme().palette.primary.contrastText }}
            thickness={3}
            size={20}
          />
        ),
      }
    ));

  dismiss = () => toast.dismiss(this.toastId);

  update = ({
    type,
    render,
    closeButton,
    hideProgressBar,
    autoClose,
    icon,
  }: {
    render?: string | JSX.Element;
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DEFAULT' | 'INFO';
    autoClose?: false | number;
    closeButton?: false | JSX.Element;
    hideProgressBar?: boolean;
    icon?: JSX.Element | (() => JSX.Element);
  }) =>
    toast.update(this.toastId, {
      type: toast.TYPE[type ?? 'SUCCESS'],
      render: <Typography variant="caption">{render ?? 'Success'}</Typography>,
      closeButton: closeButton ?? false,
      hideProgressBar: hideProgressBar ?? true,
      autoClose: autoClose ?? 5000,
      closeOnClick: true,
      icon:
        icon !== undefined ? icon : () => <DoneAllRounded color="success" />,
    });
}

export default useNotification;

export const ErrorMessage = ({
  retryFunction,
  notification,
  message,
  retryValue = 'Retry',
  closeValue = 'Close',
}: {
  retryFunction: () => void;
  notification: useNotification;
  message: string;
  retryValue?: string;
  closeValue?: string;
}) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="caption">{message}</Typography>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          justifyItems: 'center',
          marginTop: '10px',
        }}
      >
        <Button
          color="primary"
          size="small"
          variant="contained"
          onClick={() => {
            retryFunction();
            notification.dismiss();
          }}
          sx={{
            ...generateTheme().typography.body2,
            color: generateTheme().palette.primary.contrastText,
          }}
        >
          {retryValue}
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => notification.dismiss()}
          sx={{
            ...generateTheme().typography.body1,
            backgroundColor: generateTheme().palette.error.dark,
            transition: '0.3s',
            '&:hover': {
              backgroundColor: generateTheme().palette.error.main,
              transition: '0.3s',
            },
          }}
        >
          {closeValue}
        </Button>
      </Box>
    </Box>
  );
};

export interface NotificationInterface {
  notif: useNotification;
  usage: string;
}
export const filterNotificationUsage = (
  usage: string,
  notif: useNotification,
  notifications: NotificationInterface[]
) => {
  const newNotifs = notifications.filter(({ usage: usg, notif }) => {
    if (usage === usg) notif.dismiss();
    return usage !== usg;
  });
  return [...newNotifs, { usage, notif }];
};
