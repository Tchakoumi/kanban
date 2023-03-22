import { IBoard } from '@kanban/interfaces';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Columns from '../components/columns';
import Layout from '../components/layout';

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    return {
      props: {
        boards,
      },
    };
  } catch (error) {
    toast.error(error.message || 'Oops, There was an error.');
    return { notFound: true };
  }
};

export function Index({ boards }: { boards: IBoard[] }) {
  const { push } = useRouter();

  useEffect(() => {
    if (boards.length > 0) push(boards[0].board_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout boards={boards}>
      <Columns columns={[]} />
    </Layout>
  );
}

export default Index;
