export const state = () => ({
  alerts: [
    {
      message: "Test Error 1",
      type: "error",
      show: false,
    },
    {
      message: "Test Error 2",
      type: "success",
      show: false,
    },
    {
      message: "Test Error 3",
      type: "warning",
      show: false,
    },
  ],
});
export const mutations = {
  show(state, alert) {
    alert.show = true;
    state.alerts.push(alert);
  },
  close(state, index) {
    state.alerts[index].show = false;
  },
  reset(state) {
    state.alerts = [];
  },
};
