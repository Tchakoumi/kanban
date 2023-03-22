import { IBoard } from '@kanban/interfaces';
import { generateTheme, useMode } from '@kanban/theme';
import { Box, Typography } from '@mui/material';
import BoardItem from './boardItem';

export default function Boards({
  boards,
  activeBoard,
  openBoard,
}: {
  boards: IBoard[];
  activeBoard?: IBoard;
  openBoard: (board: IBoard) => void;
}) {
  const { activeMode } = useMode();
  const theme = generateTheme(activeMode);

  return (
    <Box sx={{ display: 'grid', rowGap: 1 }}>
      <Typography
        sx={{
          padding: 1.1875,
          paddingLeft: 2,
          paddingRight: 2,
          ...theme.typography.h3,
          letterSpacing: '2.4px',
          textTransform: 'uppercase',
          color: theme.common.medium_grey,
        }}
      >{`all boards (${boards.length})`}</Typography>
      {boards.map(({ board_id, board_name }, index) => (
        <BoardItem
          key={index}
          handleClick={() => openBoard({ board_id, board_name })}
          title={board_name}
          isActive={activeBoard?.board_id === board_id}
        />
      ))}
      <BoardItem
        handleClick={() => alert('new')}
        title={'+Create New Board'}
        colored
      />
    </Box>
  );
}
