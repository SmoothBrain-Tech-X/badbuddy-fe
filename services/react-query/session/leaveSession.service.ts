import _ from 'lodash';
import { axiosAPIWithoutAuth } from '@/utils/axios';

export type TLeaveSession = {
  session_id: string;
};

const leaveSession = async (props: TLeaveSession) => {
  try {
    const res = await axiosAPIWithoutAuth.post<object>(`/sessions/${props.session_id}/leave`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default leaveSession;
