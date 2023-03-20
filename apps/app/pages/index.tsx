import { useNotification } from '@kanban/toast';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

export function Index() {
  function toastNotif() {
    const notif = new useNotification();
    notif.notify({ render: 'make things happen' });
  }
  return (
    <Box>
      <Typography variant="h1">Kanban working</Typography>
      <Typography variant="h2">Kanban working</Typography>
      <Typography variant="h3">Kanban working</Typography>
      <Typography variant="body1">Kanban working</Typography>
      <Typography variant="body2">Kanban working</Typography>
      <Typography variant="caption">Kanban working</Typography>
      <Button variant="contained" color="primary" onClick={toastNotif}>
        Testing
      </Button>
      <Button variant="contained" size="small" color="secondary">
        Testing
      </Button>
      <Button variant="contained" color="error">
        Testing
      </Button>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          value={10}
          size="small"
          label="Age"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default Index;
