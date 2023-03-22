import { IBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { AddOutlined } from '@mui/icons-material';
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import favicon from '../../public/favicon_colored.png';
import logo_dark from '../../public/logo_dark.png';
import logo_light from '../../public/logo_light.png';
import ActiveBoard from './activeBoard';
import BoardMore from './boardMore';

export default function PrimaryNav({
  isSecondaryNavOpen,
  activeBoard,
  openBoard,
  boards,
  editBoard,
  deleteBoard,
}: {
  isSecondaryNavOpen: boolean;
  activeBoard?: IBoard;
  openBoard: (board: IBoard) => void;
  boards: IBoard[];
  editBoard: () => void;
  deleteBoard: () => void;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          mobile: 'auto 1fr',
          tablet: isSecondaryNavOpen ? '1fr' : 'auto 1fr',
        },
        columnGap: 3,
        backgroundColor:
          activeMode === 'light' ? theme.common.white : theme.common.dark_grey,
        alignItems: 'center',
        paddingLeft: 3,
        paddingRight: 3,
        height: {
          desktop: '96px',
          tabled: '80px',
          mobile: '64px',
        },
      }}
    >
      <Box
        sx={{
          display: {
            mobile: 'grid',
            tablet: isSecondaryNavOpen ? 'none' : 'grid',
          },
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: {
              mobile: 'none',
              tablet: 'block',
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
            display: {
              mobile: 'block',
              tablet: 'none',
            },
          }}
        >
          <Image src={favicon} alt="Kanban" />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isSecondaryNavOpen
            ? '1fr auto'
            : 'auto 1fr auto',
          columnGap: 3,
          alignSelf: 'stretch',
          alignItems: 'center',
        }}
      >
        <Divider
          sx={{
            display: isSecondaryNavOpen ? 'none' : 'block',
            backgroundColor:
              generateTheme(activeMode).common[
                activeMode === 'light' ? 'line_light' : 'line_dark'
              ],
            alignSelf: 'stretch',
          }}
          orientation="vertical"
        />
        <ActiveBoard
          activeBoard={activeBoard}
          boards={boards}
          openBoard={openBoard}
        />
        <Box
          sx={{
            justifySelf: 'end',
            display: 'grid',
            alignItems: 'center',
            gridAutoFlow: 'column',
            gap: 1,
          }}
        >
          <Tooltip
            arrow
            title="Add new task"
            sx={{
              display: {
                mobile: 'block',
                tablet: 'none',
              },
            }}
          >
            <Button
              color="primary"
              variant="contained"
              disabled={!activeBoard}
              startIcon={<AddOutlined />}
              sx={{
                '&:disabled': {
                  backgroundColor: 'rgba(99, 95, 199, 1)',
                },
                '& .MuiButton-startIcon': {
                  marginRight: {
                    mobile: 0,
                    tablet: 1,
                  },
                  marginLeft: {
                    mobile: 0,
                    tablet: -0.5,
                  },
                },
              }}
            >
              <Typography
                variant="button"
                sx={{
                  textTransform: 'none',
                  display: {
                    tablet: 'block',
                    mobile: 'none',
                  },
                }}
              >
                Add New Task
              </Typography>
            </Button>
          </Tooltip>
          <BoardMore
            editBoard={editBoard}
            deleteBoard={deleteBoard}
            disabled={!activeBoard}
          />
        </Box>
      </Box>
    </Box>
  );
}
