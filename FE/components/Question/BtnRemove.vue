<template>
  <v-btn icon plain :ripple="false" @click="remove" :loading="isDisable">
    <v-icon>mdi-trash-can</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: ["formId", "questionId"],
  data() {
    return {
      isDisable: false,
    };
  },

  methods: {
    async remove() {
      try {
        this.isDisable = true;
        let payload = {
          formId: this.formId,
          questionId: this.questionId,
        };
        await this.$store.dispatch("questions/remove", payload);
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
