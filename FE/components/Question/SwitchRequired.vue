<template>
  <v-switch v-model="required" hide-details />
</template>

<script>
export default {
  props: ["formId", "question"],
  data() {
    return {
      required: this.question.required,
    };
  },

  methods: {
    async switch() {
      try {
        let payload = {
          formId: this.formId,
          questionId: this.question.id,
          form: {
            required: this.required,
          },
        };
        await this.$store.dispatch("questions/update", payload);
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
  watch: {
    required() {
      this.switch();
    },
  },
};
</script>
