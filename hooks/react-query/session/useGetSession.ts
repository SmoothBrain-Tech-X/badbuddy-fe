import { useQuery } from '@tanstack/react-query';
import getSession, { IGetSession } from '@/services/react-query/session/getSession.service';

const useGetSession = (props: IGetSession) => {
  return useQuery({
    queryKey: ['useGetSession', props.session_id],
    queryFn: () => getSession(props),
  });
};

export default useGetSession;
