import { useQuery } from '@tanstack/react-query';
import getVenuesSearch, {
  IGetVenuesSearch,
} from '@/services/react-query/venue/getVenuesSearch.service';

const useGetVenuesSearch = (props: IGetVenuesSearch) => {
  return useQuery({
    queryKey: ['useGetVenuesSearch', props.q, props.limit, props.offset],
    queryFn: () => getVenuesSearch(props),
  });
};

export default useGetVenuesSearch;
