import { useQuery } from '@tanstack/react-query';
import getSession, { IGetSession } from '@/services/react-query/session/getSession.service';

const useGetSession = (props: IGetSession, count?: number) => {
  return useQuery({
    queryKey: ['useGetSession', props.session_id, count],
    queryFn: () => getSession(props),
  });
};

export default useGetSession;
