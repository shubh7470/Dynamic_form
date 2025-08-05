import api from "../axiosInstance";
import ENDPOINTS from "../endpoints";

//student API



//student API
// export const addStudentAPI = async (data: any) => {
//   console.log("Sending data to API:", data);
//   console.log("Is FormData?", data instanceof FormData);

//   try {
//     const response = await api.post(ENDPOINTS.STUDENT, data);
//     console.log("✅ API response:", response);
//     return response;
//   } catch (err: any) {
//     console.error("🔥 ERROR in Axios call:", err?.message);
//     console.error("Full Axios error:", err);
//     throw err;
//   }
// };
export const addStudentAPI = async (data: any) => {
  let payload = data;

  // Check if file is included -> convert to FormData
  if (data?.type === "student" && data?.fieldsData?.some((f: any) => f.type === "file")) {
    const formData = new FormData();
    formData.append("formType", data.formType); // example: 'student'

    // Append all fields from fieldsData
    data.fieldsData.forEach((field: any) => {
      if (field.type === "file" && field.value instanceof File) {
        formData.append(field.name, field.value); // field.name = "studentPhoto"
      } else {
        formData.append(field.name, field.value);
      }
    });

    payload = formData;
  }

  console.log("Sending data to API:", payload);
  console.log("Is FormData?", payload instanceof FormData);

  try {
    const response = await api.post(ENDPOINTS.STUDENT, payload, {
      headers: payload instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
    console.log("✅ API response:", response);
    return response;
  } catch (err: any) {
    console.error("🔥 ERROR in Axios call:", err?.message);
    console.error("Full Axios error:", err);
    throw err;
  }
};


export const getStudentsListAPI = async (data: {
  page: Number | null;
  limit: Number | null;
  search: String | null;
  sortBy: string | null;
  order: string | null;
  status: string;
}) => {
  // console.log(data.status);

  return await api.get(ENDPOINTS.STUDENT, {
    params: {
      page: data.page,
      limit: data.limit,
      search: data.search,
      sortBy: data.sortBy,
      order: data.order,
      status: data.status,
    },
  });
};
