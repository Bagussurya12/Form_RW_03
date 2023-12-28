<template>
  <v-btn color="primary" :loading="isDisable" @click="addQuestion">
    {{ $t("ADD_QUESTIONS") }} <v-icon>mdi-plus</v-icon></v-btn
  >
</template>

<script>
export default {
  props: ["formId"],
  data() {
    return {
      isDisable: false,
    };
  },

  methods: {
    async addQuestion() {
      try {
        this.isDisable = true;

        await this.$store.dispatch("questions/store", this.formId);

        this.isDisable = false;
      } catch (error) {
        this.$store.commit("alerts/show", {
          type: "error",
          message: error.response
            ? this.$t(error.response.data.message)
            : this.$t("SERVER_ERROR"),
        });
        this.isLoading = false;
      }
    },
  },
};
</script>
