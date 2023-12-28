<template>
  <v-text-field
    name="answer"
    placeholder="Jawaban Kamu"
    v-model="answer"
    @keyup="typing"
    :rules="answerRule"
  >
  </v-text-field>
</template>

<script>
export default {
  props: ["question"],
  data() {
    return {
      answer: "",
      answerRule: [],
    };
  },
  methods: {
    async typing() {
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
