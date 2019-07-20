import axios from "axios";
import store from "@/store";

const fetch = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
  timeout: 20 * 1000,
  xsrfCookieName: "csrfToken",
  xsrfHeaderName: "x-csrf-token"
});

fetch.interceptors.response.use(successHindler, errorHindler);

export default fetch;

function successHindler(res) {
  const status = res.status;
  if (status >= 200 && status < 300) {
    const { code, msg, data } = res.data;
    if (code !== 0) {
      console.log(msg);
    }

    return data;
  }
  if (status == 401) {
    store.dispatch("sign/signReset");
    return res.data;
  }
}

function errorHindler(err) {
  console.log(err);
  return Promise.reject(err);
}
