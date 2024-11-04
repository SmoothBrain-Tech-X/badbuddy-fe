import _ from "lodash";
import { axiosAPIWithoutAuth } from "utils/axios";

interface Openrange {
  day: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

export type TCreateVenue = {
  name: string;
  description: string;
  address: string;
  location: string;
  phone: string;
  email: string;
  open_range: Openrange[];
  image_urls: string;
  status: string;
  facilities: Facilitie[];
  rules: Rule[];
  latitude: number;
  longitude: number;
};

export type Facilitie = {
  id: string;
};

interface Rule {
  rule: string;
}

const createVenue = async (props: TCreateVenue) => {
  try {
    const res = await axiosAPIWithoutAuth.post<object>(`/venues`, props);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default createVenue;
