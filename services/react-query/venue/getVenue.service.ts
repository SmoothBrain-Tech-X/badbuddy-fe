import _ from "lodash";
import { axiosAPIWithoutAuth } from "utils/axios";

interface RootObject {
  id: string;
  name: string;
  description: string;
  address: string;
  location: string;
  phone: string;
  email: string;
  open_range: Openrange[];
  image_urls: string;
  status: string;
  rating: number;
  total_reviews: number;
  courts: Court[];
  facilities: Facility[];
  rules: Rule[];
  latitude: number;
  longitude: number;
}

interface Rule {
  rule: string;
}

interface Facility {
  id: string;
  name: string;
}

interface Court {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  status: string;
}

interface Openrange {
  day: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

export type IGetVenue = {
  venue_id: string;
};

const getVenue = async (props: IGetVenue) => {
  try {
    const res = await axiosAPIWithoutAuth.get<RootObject>(
      `/venues/${props.venue_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getVenue;
