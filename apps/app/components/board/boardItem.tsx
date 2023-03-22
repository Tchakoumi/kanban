import { generateTheme, useMode } from '@kanban/theme';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import BoardIcon from '../../public/boardIcon.png';
import BoardIconGrey from '../../public/boardIcon_grey.png';
import ColoredBoardIcon from '../../public/boardIconColored.png';

export default function BoardItem({
  title,
  handleClick,
  colored = false,
  isActive = false,
}: {
  title: string;
  handleClick: () => void;
  colored?: boolean;
  isActive?: boolean;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);
  return (
    <Box
      onClick={handleClick}
      component={Button}
      sx={{
        '&:hover': {
          backgroundColor: isActive ? theme.palette.primary.dark : '',
        },
        backgroundColor: !isActive ? 'none' : theme.palette.primary.main,
        color: colored
          ? 'none'
          : theme.common[!isActive ? 'medium_grey' : 'white'],
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
      <Image
        src={colored ? ColoredBoardIcon : isActive ? BoardIcon : BoardIconGrey}
        alt="board"
      />
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
