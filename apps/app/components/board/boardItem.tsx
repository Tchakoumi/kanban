import { generateTheme, useMode } from '@kanban/theme';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import BoardIcon from '../../public/boardIcon.png';
import BoardIconGrey from '../../public/boardIcon_grey.png';
import ColoredBoardIcon from '../../public/boardIconColored.png';
import { LineAxisOutlined } from '@mui/icons-material';

export default function BoardItem({
  title,
  handleClick,
  colored = false,
  isActive = false,
  disabled = false,
  dashboard = false,
}: {
  title: string;
  handleClick: () => void;
  colored?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  dashboard?: boolean;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  return (
    <Box
      onClick={handleClick}
      component={Button}
      disabled={disabled}
      sx={{
        '&:hover': {
          backgroundColor: isActive
            ? theme.palette.primary.main
            : theme.palette.mode === 'light'
            ? 'rgba(99, 95, 199, 0.1)'
            : theme.common.white,
          color: !isActive ? theme.palette.primary.main : '',
          '& .base': {
            display: isActive ? 'inline-block' : 'none',
          },
          '& .hover': {
            display: isActive ? 'none' : 'inline-block',
          },
        },
        backgroundColor: !isActive ? 'none' : theme.palette.primary.main,
        color: colored
          ? dashboard && isActive
            ? 'white'
            : 'none'
          : theme.common[!isActive ? 'medium_grey' : 'white'],
        '& .hover': {
          display: 'none',
        },
        '& .base': {
          display: 'inline-block',
        },
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: 1,
        alignItems: 'center',
        padding: 1.8125,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        marginRight: 3,
        cursor: 'pointer',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      {dashboard ? (
        <LineAxisOutlined
          sx={{ color: isActive ? 'white' : theme.palette.primary.main }}
        />
      ) : (
        <>
          <Image
            src={
              colored ? ColoredBoardIcon : isActive ? BoardIcon : BoardIconGrey
            }
            alt="board"
            className="base"
          />
          <Image src={ColoredBoardIcon} alt="board" className="hover" />
        </>
      )}
      <Typography
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '206px',
          whiteSpace: 'nowrap',
          textAlign: 'left',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
