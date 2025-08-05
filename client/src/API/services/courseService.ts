import ENDPOINTS from "../endpoints";
import api from "../axiosInstance";

//Course Category API
export const addCourseCategoryAPI = (data: { name: string }) => {
  return api.post(ENDPOINTS.COURSE_CATEGORY, data);
};
export const updateCourseCategoryAPI = ({
  name,
  id,
}: {
  name: string;
  id: string;
}) => {
  return api.put(`${ENDPOINTS.COURSE_CATEGORY}/${id}`, { name });
};
export const updateCourseCategoryStatusAPI = ({ id }: { id: string }) => {
  return api.put(`${ENDPOINTS.COURSE_CATEGORY}/${id}/status`);
};
export const getCourseCategoryAPI = (data: {
  page: Number | null;
  limit: Number | null;
  search: String | null;
  sortBy: string | null;
  order: string | null;
}) => {
  return api.get(ENDPOINTS.COURSE_CATEGORY, {
    params: {
      page: data.page,
      limit: data.limit,
      search: data.search,
      sortBy: data.sortBy,
      order: data.order,
    },
  });
};
export const getAllCourseCategoryAPI = () => {
  return api.get(`${ENDPOINTS.COURSE_CATEGORY}/all`);
};
//Course API
export const addCourseAPI = (data: any) => {
  return api.post(ENDPOINTS.COURSE, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getCourseListAPI = (data: {
  page: Number | null;
  limit: Number | null;
  search: String | null;
  sortBy: string | null;
  order: string | null;
}) => {
  return api.get(ENDPOINTS.COURSE, {
    params: {
      page: data.page,
      limit: data.limit,
      search: data.search,
      sortBy: data.sortBy,
      order: data.order,
    },
  });
};
export const getAllCourseAPI = () => {
  return api.get(`${ENDPOINTS.COURSE}/all`);
};
export const updateCourseStatusAPI = ({ id }: { id: string }) => {
  return api.put(`${ENDPOINTS.COURSE}/${id}/status`);
};
export const getCoursePaperAPI = () => {
  return api.get(ENDPOINTS.COURSE_PAPER);
};
