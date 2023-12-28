export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    if (store.state.auth.accessToken) {
      config.headers[
        "Authorization"
      ] = `Bearer ${store.state.auth.accessToken}`;
    }
    if (config.headers.autoSave) {
      console.log("MULAI PROSES PENYIMPANAN OTOMATIS");
      store.commit("saves/start");
    }
  });

  $axios.onResponse((response) => {
    if (response.config.headers.autoSave) {
      setTimeout(() => {
        console.log("SELESAI PENYIMPANAN OTOMATIS");
        store.commit("saves/success");
      }, 1000);
    }
  });

  $axios.onResponseError(async (error) => {
    try {
      if (error.response.config.headers.autoSave) {
        store.commit("saves/failed");
      }
      if (
        error.response.data.message == "REFRESH_TOKEN_EXPIRED" ||
        error.response.data.message == "INVALID_REFRESH_TOKEN"
      ) {
        throw new Error("LOGOUT");
      }
      if (
        error.response.status === 401 &&
        error.response.data.message === "ACCESS_TOKEN_EXPIRED"
      ) {
        // store.dispatch("auth/refreshToken");
        let refreshToken = store.state.auth.refreshToken;

        const response = await $axios.$post("/refreshToken", {
          refreshToken: refreshToken,
        });
        if (!response) {
          throw new Error("LOGOUT");
        }

        store.commit("auth/setAccessToken", response.accessToken);
        store.commit("auth/setRefreshToken", response.refreshToken);

        // Request Ulang
        let originalRequest = error.config;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.accessToken}`;

        return $axios(originalRequest);
      }
      return Promise.reject(error);
    } catch (error) {
      if (error.message === "LOGOUT") {
        return redirect("/logout");
      }
      return Promise.reject(error);
    }
  });
}
