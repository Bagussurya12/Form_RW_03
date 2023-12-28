<template>
  <v-form v-if="questions.length > 0" ref="form">
    <v-row v-if="answerError">
      <v-col md="8" offset-md="2" sm="10" offset-sm="1" class="pb-0">
        <v-alert color="red" dark class="mb-0">{{
          $t("ANSWER_ERROR")
        }}</v-alert>
      </v-col>
    </v-row>
    <v-row v-for="(question, i) in questions" :key="i">
      <v-col md="8" offset-md="2" sm="10" offset-sm="1">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="8" class="pb-0">
                <label for="questions" class="label-questions mb-0">{{
                  question.question
                }}</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="8" class="pt-0">
                <AnswerTypeText
                  :question="question"
                  v-if="question.type == 'Text'"
                />
                <AnswerTypeEmail
                  :question="question"
                  v-else-if="question.type == 'Email'"
                />
                <AnswerTypeDropdown
                  :question="question"
                  v-else-if="question.type == 'Dropdown'"
                />
                <AnswerTypeRadio
                  :question="question"
                  v-else-if="question.type == 'Radio'"
                />
                <AnswerTypeCheckbox
                  :question="question"
                  v-else-if="question.type == 'Checkbox'"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="8" offset-md="2" sm="10" offset-sm="1" class="mb-3 text-right">
        <v-btn color="primary" @click="onSubmit">
          {{ $t("SUBMIT_ANSWERS") }}</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["formId"],
  data() {
    return {
      answerError: false,
    };
  },
  computed: {
    ...mapState("questions", ["questions"]),
  },
  methods: {
    async onSubmit() {
      try {
        if (this.$refs.form.validate()) {
          await this.$store.dispatch("answers/store", this.formId);
          this.$router.push("/answers/completed");
        } else {
          this.answerError = true;
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
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
};
</script>

<style>
.label-questions {
  font-size: 1rem;
  color: black;
}
</style>
