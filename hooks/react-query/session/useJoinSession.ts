import { useMutation } from '@tanstack/react-query';
import getSession from '@/services/react-query/session/getSession.service';
import joinSession, { TJoinSession } from '@/services/react-query/session/joinSession.service';

const useJoinSession = () => {
  return useMutation({
    mutationFn: joinSession,
  });
};

export default useJoinSession;
