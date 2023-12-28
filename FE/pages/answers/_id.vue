<template>
  <v-container class="mt-4 p-0">
    <v-row>
      <v-col md="8" offset-md="2" sm="10" offset-sm="1">
        <v-card>
          <v-card-text>
            <h1 class="mb-3 mt-2">{{ title }}</h1>
            <p class="mb-1" color="black">{{ description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Answer Card -->
    <AnswerCard :formId="formId" />
  </v-container>
</template>

<script>
export default {
  middleware: ["authenticated"],
  async asyncData({ params, redirect }) {
    try {
      if (!params.id) {
        throw { message: "FORM_ID_EMPTY" };
      }
      return { formId: params.id };
    } catch (error) {
      redirect("/404");
      return false;
    }
  },
  data() {
    return {
      title: null,
      description: null,
    };
  },
  methods: {
    async fetch() {
      try {
        const response = await this.$store.dispatch(
          "forms/showToUser",
          this.formId
        );
        console.log(response);
        this.title = response.form.title;
        this.description = response.form.description;
        if (response.form.questions.length > 0) {
          this.$store.commit("questions/set", response.form.questions);
        }
      } catch (error) {
        if (error.response) {
          this.$nuxt.error({
            statusCode: error.response.status,
            customMessage: error.response.data.message,
          });
        } else {
          this.$store.commit("alerts/show", {
            type: "error",
            message: this.$t("SERVER_ERROR"),
          });
        }
      }
    },
  },
  head() {
    return {
      title: this.title,
    };
  },
  mounted() {
    this.fetch();
  },
};
</script>
