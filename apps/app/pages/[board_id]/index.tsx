import { IBoard, IColumnDetails } from '@kanban/interfaces';
import { GetServerSideProps } from 'next';
import { toast } from 'react-toastify';
import Columns from '../../components/columns';
import Layout from '../../components/layout';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { board_id } = context.query;
  try {
    //TODO: CALL API HERE TO FETCH BOARDS
    const boards: IBoard[] = [
      {
        board_id: 'sleil',
        board_name: 'Platform Launch',
      },
      {
        board_id: 'sleisl',
        board_name: 'Platform Launcher',
      },
    ];

    //TODO: CALL API HERE TO LOAD COLUMNS OF ACTIVE TABLE with data board_id
    const columns: IColumnDetails[] = [
      {
        column_color_code: '#ff12a4',
        column_id: 'jweisl',
        column_position: 2,
        column_title: 'To-Do',
        tasks: [
          {
            column_id: 'soielsi',
            task_description: 'make things happen',
            task_id: 'wieosl',
            task_position: 3,
            task_title: 'Taking it one step at a time',
            total_done_subtasks: 3,
            total_undone_subtasks: 0,
          },
          {
            column_id: 'soielsi',
            task_description: 'make things happen',
            task_id: 'wieosl',
            task_position: 1,
            task_title: 'Taking it one step at a time',
            total_done_subtasks: 3,
            total_undone_subtasks: 0,
          },
          {
            column_id: 'soielasi',
            task_description: 'make things happen',
            task_id: 'wieosl',
            task_position: 1,
            task_title: 'Taking it one step at a time',
            total_done_subtasks: 3,
            total_undone_subtasks: 0,
          },
        ],
      },
      {
        column_color_code: '#ff12a4',
        column_id: 'jweil',
        column_position: 1,
        column_title: 'To-Do',
        tasks: [
          {
            column_id: 'ieowldo',
            task_description: 'make things happen',
            task_id: 'wieosl',
            task_position: 3,
            task_title: 'Hello world',
            total_done_subtasks: 3,
            total_undone_subtasks: 0,
          },
          {
            column_id: 'soielsi',
            task_description: 'make things happen',
            task_id: 'wieosl',
            task_position: 1,
            task_title: 'Taking it one step at a time',
            total_done_subtasks: 3,
            total_undone_subtasks: 0,
          },
        ],
      },
    ];
    return {
      props: {
        boards,
        columns,
      },
    };
  } catch (error) {
    toast.error(error.message || 'Oops, There was an error.');
    return { notFound: true };
  }
};

export function Index({
  boards,
  columns,
}: {
  boards: IBoard[];
  columns: IColumnDetails[];
}) {
  return (
    <Layout boards={boards}>
      <Columns columns={columns} />
    </Layout>
  );
}

export default Index;
