import _ from 'lodash';
import { axiosAPIWithoutAuth } from '@/utils/axios';

export type TUpdateUserSession = {
  session_id: string;
  user_id: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

const updateUserSession = async (props: TUpdateUserSession) => {
  try {
    const payload = _.omit(props, ['session_id']);
    const res = await axiosAPIWithoutAuth.put<object>(
      `/sessions/${props.session_id}/status`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateUserSession;
