import { generateTheme, ModeType, useMode } from '@kanban/theme';
import { DarkMode, LightMode } from '@mui/icons-material';
import { FormControlLabel, Stack } from '@mui/material';
import { IOSSwitch } from '../primaryNav/iosSwitch';

export default function ThemeSwitcher() {
  const { activeMode, modeDispatch } = useMode();
  const theme = generateTheme(activeMode);

  function changeMode(newMode?: ModeType) {
    const wantedMode = newMode ?? (activeMode === 'light' ? 'dark' : 'light');
    modeDispatch({
      type: wantedMode === 'light' ? 'USE_LIGHT' : 'USE_DARK',
    });
    localStorage.setItem(
      'activeTheme',
      wantedMode === 'light' ? 'light' : 'dark'
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        bgcolor:
          theme.palette.mode === 'dark'
            ? theme.common.very_dark_grey
            : theme.common.light_grey,
        padding: `5px 0`,
        margin: '0 5%',
        borderRadius: 1,
      }}
    >
      <LightMode
        onClick={() => changeMode('light')}
        sx={{
          color: activeMode === 'light' ? theme.palette.primary.main : 'grey',
          cursor: 'pointer',
        }}
      />
      <FormControlLabel
        control={
          <IOSSwitch
            sx={{ m: 1 }}
            checked={activeMode === 'dark'}
            onChange={() => changeMode()}
          />
        }
        label=""
      />
      <DarkMode
        onClick={() => changeMode('dark')}
        sx={{
          color:
            theme.common[activeMode === 'dark' ? 'light_grey' : 'medium_grey'],
          cursor: 'pointer',
        }}
      />
    </Stack>
  );
}
