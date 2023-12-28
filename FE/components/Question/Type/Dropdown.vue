<template>
  <div>
    <div
      class="d-flex align-center"
      v-for="(option, key) in options"
      :key="key"
    >
      <span class="mr-3" disabled>
        <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
      </span>
      <v-text-field
        placeholder="Options"
        :id="`inputActive${option.id}`"
        :value="option.value"
        @input="typing($event, option.id)"
      />
      <v-btn icon class="ml-auto" @click="remove(option.id)"
        ><v-icon>mdi-trash</v-icon></v-btn
      >
    </div>
    <div class="d-flex align-center">
      <span class="mr-3" disabled>
        <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
      </span>
      <v-text-field placeholder="Add Option" @click="add" @focus="add" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["formId", "question"],
  data() {
    return {
      timer: null,
    };
  },
  methods: {
    focusInput(optionId) {
      if (document.getElementById(`inputActive${optionId}`)) {
        document.getElementById(`inputActive${optionId}`).focus();
      }
    },
    async add() {
      try {
        let payload = {
          formId: this.formId,
          questionId: this.question.id,
          form: {
            options: "New Option",
          },
        };
        const response = await this.$store.dispatch(
          "questions/addOptions",
          payload
        );
        console.log(response);
        this.focusInput(response.option.id);
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
    async typing(value, optionId) {
      try {
        let payload = {
          formId: this.formId,
          questionId: this.question.id,
          optionId: optionId,
          form: {
            option: value,
          },
        };

        await this.$store.dispatch("questions/updateOptions", payload);
      } catch (err) {
        this.$store.commit("alerts/show", {
          type: "error",
          message: err.response
            ? this.$t(err.response.data.message)
            : this.$t("SERVER_ERROR"),
        });
      }
    },
    async remove(optionId) {
      try {
        let payload = {
          formId: this.formId,
          questionId: this.question.id,
          optionId: optionId,
        };

        await this.$store.dispatch("questions/removeOptions", payload);
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
  computed: {
    options() {
      return this.question.options;
    },
  },
};
</script>
