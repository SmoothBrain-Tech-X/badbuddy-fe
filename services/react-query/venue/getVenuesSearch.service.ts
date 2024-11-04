import _ from 'lodash';
import qs from 'qs';
import { QSConfig } from '@/configs/QSConfig/QSConfig';
import { axiosAPIWithoutAuth } from '@/utils/axios';

interface RootObject {
  venues: Venue[];
  total: number;
}

interface Venue {
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

export type IGetVenuesSearch = {
  q?: string;
  limit?: number;
  offset?: number;
};

const getVenuesSearch = async (props: IGetVenuesSearch) => {
  try {
    const query = qs.stringify(
      {
        q: props.q,
        limit: props.limit,
        offset: props.offset,
      },
      QSConfig
    );

    const res = await axiosAPIWithoutAuth.get<RootObject>(`/venues/search${query}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getVenuesSearch;
