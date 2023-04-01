import { DialogTransition } from '@kanban/dialog';
import { ICreateColumn } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import randomColor from '../../common';

export default function NewColumDialog({
  isDialogOpen,
  closeDialog,
  submitDialog,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  submitDialog: (val: ICreateColumn) => void;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  const {
    query: { board_id },
  } = useRouter();

  const initialValues: ICreateColumn = {
    column_color_code: '#000000',
    column_title: '',
    board_id: String(board_id),
  };

  const validationSchema = Yup.object().shape({
    column_title: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      submitDialog({ ...values, column_color_code: randomColor() });
      resetForm();
      handleClose();
    },
  });

  function handleClose() {
    closeDialog();
    formik.resetForm();
  }

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      onClose={handleClose}
    >
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === 'dark' ? theme.common.dark_grey : '',
          width: {
            mobile: 'initial',
            tablet: '480px',
          },
          padding: '32px',
          display: 'grid',
          rowGap: 3,
        }}
      >
        <Typography variant="h2">Add New Column</Typography>
        <Box
          sx={{ display: 'grid', rowGap: 3 }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            fullWidth
            required
            autoFocus
            label="Title"
            size="small"
            error={
              formik.touched.column_title && Boolean(formik.errors.column_title)
            }
            helperText={
              formik.touched.column_title && formik.errors.column_title
            }
            {...formik.getFieldProps('column_title')}
          />

          <Button
            type="submit"
            color="primary"
            variant="contained"
            disableElevation
          >
            Create Column
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
