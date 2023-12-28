import createPersistedState from "vuex-persistedstate";
import * as Cookies from "js-cookie";
import cookie from "cookie";

// access_token: null,
// refresh_token: null,
// fullname: null,
// role: null,

export default ({ store, req }) => {
  createPersistedState({
    paths: [
      "auth.fullname",
      "auth.accessToken",
      "auth.refreshToken",
      "auth.role",
    ],
    storage: {
      getItem: (key) => {
        // See https://nuxtjs.org/guide/plugins/#using-process-flags
        if (process.server) {
          const parsedCookies = cookie.parse(req.headers.cookie);
          return parsedCookies[key];
        } else {
          return Cookies.get(key);
        }
      },
      // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
      setItem: (key, value) =>
        Cookies.set(key, value, { expires: 365, secure: false }),
      removeItem: (key) => Cookies.remove(key),
    },
  })(store);
};
