import api from "../axiosInstance";
import ENDPOINTS from "../endpoints";

// Branch API
export const addBranchAPI = async (data: any) => {
  return await api.post(ENDPOINTS.BRANCH, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getBranchListAPI = async (data: {
  page: Number | null;
  limit: Number | null;
  search: String | null;
  sortBy: string | null;
  order: string | null;
}) => {
  return await api.get(ENDPOINTS.BRANCH, {
    params: {
      page: data.page,
      limit: data.limit,
      search: data.search,
      sortBy: data.sortBy,
      order: data.order,
    },
  });
};
export const getAllBranchAPI = async () => {
  return await api.get(`${ENDPOINTS.BRANCH}/all`);
};
