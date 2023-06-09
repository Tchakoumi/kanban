import { generateTheme, useMode } from '@kanban/theme';
import { useNotification } from '@kanban/toast';
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  ReportRounded,
} from '@mui/icons-material';
import { Box, Menu, Skeleton, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useBoardDetails } from '../../services';
import Boards from '../board/boards';
import ThemeSwitcher from '../secondaryNav/themeSwitcher';

export default function ActiveBoard() {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  const {
    query: { board_id },
    pathname,
  } = useRouter();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    isLoading: areColumnsLoading,
    data,
    error: columnsError,
  } = useBoardDetails(board_id as string);

  useEffect(() => {
    if (columnsError) {
      const notif = new useNotification();
      notif.notify({ render: 'Notifying' });
      notif.update({
        type: 'ERROR',
        render:
          columnsError?.message ??
          'Something went wrong while loading board details ',
        autoClose: 3000,
        icon: () => <ReportRounded fontSize="medium" color="error" />,
      });
    }
  }, [columnsError]);

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
        <Tooltip
          arrow
          title={
            data?.board_name ??
            (pathname === '/dashboard'
              ? 'Platform Usage Statistics'
              : 'Select a board')
          }
          followCursor
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
            {areColumnsLoading ? (
              <Skeleton sx={{ maxWidth: '200px' }} />
            ) : (
              data?.board_name ??
              (pathname === '/dashboard'
                ? 'Platform Usage Statistics'
                : 'Select a board')
            )}
          </Typography>
        </Tooltip>
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
          <Boards />
          <ThemeSwitcher />
        </Box>
      </Menu>
    </>
  );
}
