import _ from 'lodash';
import { axiosAPIWithoutAuth } from '@/utils/axios';

export type TJoinSession = {
  session_id: string;
};

const joinSession = async (props: TJoinSession) => {
  try {
    const res = await axiosAPIWithoutAuth.post<object>(`/sessions/${props.session_id}/join`, {
      message: 'Looking forward to playing!',
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default joinSession;
