import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Columns from '../components/columns';
import Layout from '../components/layout';
import { useBoards } from '../services';

export function Index() {
  const { push } = useRouter();
  const { data: boards, isLoading, error } = useBoards();

  useEffect(() => {
    if (!isLoading && boards && boards.length > 0) push(boards[0].board_id);
    if (error) toast.error(error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <Layout>
      <Columns />
    </Layout>
  );
}

export default Index;
