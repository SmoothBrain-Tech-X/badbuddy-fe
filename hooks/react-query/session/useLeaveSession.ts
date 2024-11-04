import { useMutation } from '@tanstack/react-query';
import { TJoinSession } from '@/services/react-query/session/joinSession.service';
import leaveSession from '@/services/react-query/session/leaveSession.service';

const useLeaveSession = () => {
  return useMutation({
    mutationFn: leaveSession,
  });
};

export default useLeaveSession;
