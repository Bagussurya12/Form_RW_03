<template>
  <div>
    <v-container fluid class="pa-0">
      <Toolbar class="mb-5" />
    </v-container>
    <v-container>
      <v-row>
        <v-col md="8" offset-md="2" sm="10" offset-sm="1">
          <v-card class="card-border-top">
            <v-card-text>
              <QuestionTitle class="text-h6 creator-input" />
              <QuestionDescription class="creator-input" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <QuestionCard :formId="formId" />
      <v-row>
        <v-col md="8" offset-md="2" sm="10" offset-sm="1" class="d-flex mb-3">
          <v-spacer></v-spacer>
          <QuestionBtnAdd :formId="formId" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  middleware: ["authenticated"],
  async asyncData({ params, redirect }) {
    try {
      if (!params.id) {
        throw {
          code: 404,
          message: "FORM_ID_NOT_FOUND",
        };
      }
      return {
        formId: params.id,
      };
    } catch (error) {
      redirect("/404");
      return false;
    }
  },
  methods: {
    async getForms() {
      try {
        const response = await this.$store.dispatch("forms/show", this.formId);
        if (!response) {
          throw { message: "FORM_NOT_FOUND" };
        }
        if (response.form.questions.length > 0) {
          this.$store.commit("questions/set", response.form.questions);
        }
        return response;
      } catch (error) {
        if (error.response) {
          this.$nuxt.error({
            statusCode: error.response.status,
            customMessage: error.response.data.message,
          });
        } else {
          console.log(error);
          this.$store.commit("alerts/show", {
            type: "error",
            message: this.$t("SERVER_ERROR"),
          });
        }
      }
    },
  },

  mounted() {
    this.getForms();
  },
};
</script>
