import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import get from 'lodash.get';
import merge from 'lodash/fp/merge';

const DEFAULT_CONFIG: AxiosRequestConfig = {
  timeout: 2000,
  headers: { 'Content-Type': 'application/json' },
//   withCredentials: true,
  validateStatus: status => {
    return status >= 200 && status < 500;
  }
};

class Axios {
  private api: AxiosInstance;

  constructor(config: AxiosRequestConfig = DEFAULT_CONFIG) {
    let c = merge(DEFAULT_CONFIG, config);

    this.api = axios.create(c);

    this.api.interceptors.response.use(
      function(response) {
        if (response.status >= 400) {
          return null;
        } else {
          return response.data;
        }
      },
      function(error) {
        if (get(error, 'message.code', false) === -101) {
          // 被取消的请求
        } else {
        }

        return Promise.resolve(null);
      }
    );
  }

  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

export default Axios;
