import axios from "axios";

// const HOST = "https://haruta2.pythonanywhere.com";
const HOST = "https://haruta14.pythonanywhere.com";

export const endpoints = {
  login: "/o/token/",
  current_user: "/users/current/",
  users: "/users/",
  school: "/school/",
  banners: "/banners/",
  categories: "/categories/",
  admissions: (cate) => `/admissions/?cate=${cate}`,
  get_each_cate: (cate) => `/admissions/get_each_cate/?cate=${cate}`,
  comments: (admissionsId) => `/admissions/${admissionsId}/get_comments/`,
  add_comments: (admissionsId) => `/admissions/${admissionsId}/comments/`,
  departments: "/departments/",
  scores: "/scores/",
  streams: "/streams/",
  add_question: (streamId) => `/streams/${streamId}/question/`,
  create_faq: "/faqs/create_faq/",
  send_message: "/messages/send_message/",
};

export const authApi = (accessToken) =>
  axios.create({
    baseURL: HOST,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default axios.create({
  baseURL: HOST,
});
