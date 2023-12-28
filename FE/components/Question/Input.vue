<template>
  <v-text-field
    filled
    placeholder="Question"
    @input="typing($event)"
    hide-details
    class="creator-input"
    v-model="localQuestion"
  >
  </v-text-field>
</template>

<script>
//import { mapState } from "vuex";
export default {
  props: ["question", "formId"],
  data() {
    return {
      timer: null,
      localQuestion: this.question.question,
    };
  },
  //   computed: {
  //     ...mapState("forms", ["id", "title"]),
  //   },
  methods: {
    async typing(value) {
      try {
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          let payload = {
            formId: this.formId,
            questionId: this.question.id,
            form: {
              question: this.localQuestion,
            },
          };
          const formTitle = await this.$store.dispatch(
            "questions/update",
            payload
          );
          if (!formTitle) {
            throw { message: "ERROR" };
          }
        }, 2000);
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
