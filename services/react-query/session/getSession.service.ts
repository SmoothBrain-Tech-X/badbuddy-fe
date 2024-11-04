import _ from 'lodash';
import { axiosAPIWithoutAuth } from '@/utils/axios';

interface RootObject {
  message: string;
  data: Data;
}

interface Data {
  id: string;
  title: string;
  description: string;
  venue_name: string;
  venue_location: string;
  host_name: string;
  host_level: string;
  session_date: string;
  start_time: string;
  end_time: string;
  player_level: string;
  max_participants: number;
  cost_per_person: number;
  status: string;
  allow_cancellation: boolean;
  cancellation_deadline_hours: number;
  is_public: boolean;
  confirmed_players: number;
  pending_players: number;
  participants: Participant[];
  created_at: string;
  updated_at: string;
}

interface Participant {
  id: string;
  user_id: string;
  user_name: string;
  status: string;
  joined_at: string;
}

export type IGetSession = {
  session_id: string;
};

const getSession = async (props: IGetSession) => {
  try {
    const res = await axiosAPIWithoutAuth.get<RootObject>(`/sessions/${props.session_id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getSession;
