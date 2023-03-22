import { generateTheme, useMode } from '@kanban/theme';
import { VisibilityOffOutlined } from '@mui/icons-material';
import { Box, Button, Collapse, Divider } from '@mui/material';
import Image from 'next/image';
import logo_dark from '../../public/logo_dark.png';
import logo_light from '../../public/logo_light.png';
import Boards from '../board/boards';
import ThemeSwitcher from './themeSwitcher';
import { IBoard } from '@kanban/interfaces';

export default function SecondaryNav({
  isSecondaryNavOpen,
  closeSecondaryNav,
  boards,
  openBoard,
  activeBoard,
}: {
  isSecondaryNavOpen: boolean;
  closeSecondaryNav: () => void;
  boards: IBoard[];
  openBoard: (board: IBoard) => void;
  activeBoard?: IBoard;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  return (
    <Box
      component={Collapse}
      timeout={170}
      orientation="horizontal"
      in={isSecondaryNavOpen}
      sx={{
        borderRight: `1.64px solid ${
          theme.common[activeMode === 'light' ? 'line_light' : 'line_dark']
        }`,
        '& .MuiCollapse-wrapper>.MuiCollapse-wrapperInner': {
          display: 'grid',
          gridTemplateRows: '1fr auto',
          alignItems: 'start',
        },
        display: {
          mobile: 'none',
          tablet: 'grid',
        },
        gridTemplateColumns: '1fr auto',
        columnGap: 1,
        height: '100%',
        backgroundColor:
          activeMode === 'light' ? theme.common.white : theme.common.dark_grey,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          height: '100%',
          gridTemplateRows: 'auto 1fr auto',
          rowGap: 3,
        }}
      >
        <Box
          sx={{
            paddingLeft: 3,
            display: 'grid',
            alignItems: 'center',
            height: {
              desktop: '96px',
              tabled: '80px',
              mobile: '64px',
            },
          }}
        >
          <Image
            src={activeMode === 'dark' ? logo_dark : logo_light}
            alt="Kanban"
          />
        </Box>
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            gridTemplateRows: '1fr auto',
            alignItems: 'start',
            rowGap: 2,
          }}
        >
          <Boards
            openBoard={openBoard}
            boards={boards}
            activeBoard={activeBoard}
          />
          <ThemeSwitcher />
        </Box>
        <Button
          startIcon={<VisibilityOffOutlined />}
          variant="text"
          color="inherit"
          onClick={closeSecondaryNav}
          sx={{
            marginBottom: 5.875,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.common.white
                  : 'rgba(99, 95, 199, 0.1)',
            },
          }}
        >
          Hide Sidebar
        </Button>
      </Box>
      <Divider
        orientation="vertical"
        sx={{
          alignSelf: 'stretch',
          height: '100%',
          backgroundColor:
            generateTheme(activeMode).common[
              activeMode === 'light' ? 'line_light' : 'line_dark'
            ],
        }}
      />
    </Box>
  );
}
