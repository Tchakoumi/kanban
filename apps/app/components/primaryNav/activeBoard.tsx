import { IBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
} from '@mui/icons-material';
import { Box, Menu, Skeleton, Typography } from '@mui/material';
import { useActiveBoard } from '../../services';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Boards from '../board/boards';
import ThemeSwitcher from '../secondaryNav/themeSwitcher';

export default function ActiveBoard({ boards }: { boards: IBoard[] }) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  const {
    query: { board_id },
  } = useRouter();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { activeBoard, isLoading } = useActiveBoard(board_id as string);

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
          {isLoading ? (
            <Skeleton sx={{ maxWidth: '200px' }} />
          ) : activeBoard ? (
            activeBoard.board_name
          ) : (
            'Select a board'
          )}
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
          <Boards boards={boards} />
          <ThemeSwitcher />
        </Box>
      </Menu>
    </>
  );
}
