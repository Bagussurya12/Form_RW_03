<template>
  <v-select
    class="mt-4"
    :rules="answerRule"
    v-model="answer"
    label="options"
    :items="items"
    item-text="value"
    item-value="value"
    @change="update"
  >
  </v-select>
</template>

<script>
export default {
  props: ["question"],
  data() {
    return {
      answer: null,
      items: this.question.options,
      answerRule: [],
    };
  },
  methods: {
    async update() {
      try {
        let payload = {
          questionId: this.question.id,
          value: this.answer,
        };

        await this.$store.commit("answers/update", payload);
      } catch (error) {
        this.$store.commit("alerts/show", {
          type: "error",
          message: error.response
            ? this.$t(error.response.data.message)
            : this.$t("SERVER_ERROR"),
        });
      }
    },
  },
  beforeMount() {
    if (this.question.required) {
      this.answerRule.push((value) => !!value || this.$t("QUESTION_REQUIRED"));
    }
  },
};
</script>
