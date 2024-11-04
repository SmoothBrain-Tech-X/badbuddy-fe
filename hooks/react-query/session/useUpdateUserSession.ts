import { useMutation } from '@tanstack/react-query';
import updateUserSession from '@/services/react-query/session/updateUserSession.service';

const useUpdateUserSession = () => {
  return useMutation({
    mutationFn: updateUserSession,
  });
};

export default useUpdateUserSession;
