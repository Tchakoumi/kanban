import { IBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
} from '@mui/icons-material';
import { Box, Menu, Typography } from '@mui/material';
import { useState } from 'react';
import Boards from '../board/boards';
import ThemeSwitcher from '../secondaryNav/themeSwitcher';

export default function ActiveBoard({
  activeBoard,
  boards,
  openBoard,
}: {
  activeBoard?: IBoard;
  openBoard: (board: IBoard) => void;
  boards: IBoard[];
}) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function closeMenu() {
    setIsMoreMenuOpen(false);
    setAnchorEl(null);
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          alignItems: 'center',
          columnGap: 1,
        }}
        onClick={(event) => {
          setIsMoreMenuOpen(true);
          setAnchorEl(event.currentTarget);
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              mobile: theme.typography.h2.fontSize,
              tablet: theme.typography.h1.fontSize,
            },
            overflow: 'hidden',
            wordBreak: 'initial',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {activeBoard ? activeBoard.board_name : 'Select a board'}
        </Typography>
        <Box
          sx={{
            display: {
              mobile: 'block',
              tablet: 'none',
            },
          }}
        >
          {isMoreMenuOpen ? (
            <KeyboardArrowUpOutlined />
          ) : (
            <KeyboardArrowDownOutlined />
          )}
        </Box>
      </Box>
      <Menu
        elevation={0}
        anchorEl={anchorEl}
        open={isMoreMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 65,
          horizontal: 'left',
        }}
        sx={{
          display: {
            mobile: 'block',
            tablet: 'none',
          },
        }}
      >
        <Box>
          <Boards
            boards={boards}
            openBoard={openBoard}
            activeBoard={activeBoard}
          />
          <ThemeSwitcher />
        </Box>
      </Menu>
    </>
  );
}
