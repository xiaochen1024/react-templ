import axios from "axios";
import queryString from "query-string";
import _ from "lodash";
import server from "scripts/configs/server";
import { message } from "antd";

import { TOKEN_KEY } from "scripts/constants/StorageKeys";
import storage from "scripts/utils/storage";

const defaultParams = {};
const defaultConfig = {
  data: defaultParams,
  headers: {
    common: {
      Accept: "application/json"
    },
    post: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
};
// axios.defaults.withCredentials = true;

const httpclient = axios.create({ baseURL: server.gateway, ...defaultConfig });

httpclient.interceptors.request.use(
  config => {
    const token = storage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `react-templ ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  error => Promise.reject(error)
);

httpclient.interceptors.response.use(
  response => {
    if (response.data.ret < 0) {
      message.error(response.data.errorMsg);
      if (response.data.ret === -4) {
        window.location.replace(`${server.h5root}/login`);
      }
      return Promise.reject(response);
    }
    return response.data.data;
  },
  error => {
    const { config, response } = error;
    const { status } = response;

    if (status === 403 || status === 401) {
      window.location.replace(`${server.h5root}/login`);
      return Promise.reject(response);
    }

    if (config.showError) {
      message.error(response.data.errorMsg, 3);
    }
    return Promise.reject(response);
  }
);

export default {
  post(url, params, config) {
    config = _.merge(
      {
        showError: true
      },
      config
    );

    const contentType =
      (config.headers && config.headers["Content-Type"]) ||
      "application/x-www-form-urlencoded";
    switch (contentType) {
      case "application/x-www-form-urlencoded":
        params = queryString.stringify(params);
        break;
      case "application/json":
        params = JSON.stringify(params);
        break;
      default:
        break;
    }

    return httpclient.post(url, params, config);
  },
  get(url, params, config) {
    config = _.merge(
      {
        showError: true
      },
      config
    );
    return httpclient.get(
      url,
      {
        params
      },
      config
    );
  },
  put(url, params, config) {
    config = _.merge(
      {
        showError: true
      },
      config
    );
    return httpclient.put(url, queryString.stringify(params), config);
  }
};
