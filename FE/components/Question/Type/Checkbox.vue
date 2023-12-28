<template>
  <div>
    <div
      v-for="(option, key) in options"
      :key="key"
      class="d-flex align-center"
    >
      <v-checkbox :disabled="true" class="mb-1" />
      <v-text-field
        placeholder="Options"
        :id="`inputActive${option.id}`"
        :value="option.value"
        @input="typing($event, option.id)"
      />
      <v-btn icon class="ml-auto" @click="remove(option.id)">
        <v-icon>mdi-trash</v-icon>
      </v-btn>
    </div>
    <div class="d-flex">
      <v-checkbox disabled class="mb-1" />
      <v-text-field
        placeholder="Add option"
        style="max-width: 70%"
        @click="add"
        @focus="focusInput"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["formId", "question"],
  data() {
    return {
      timer: null,
      addOption: null,
    };
  },
  methods: {
    focusInput(optionId) {
      let inputActiveId = this.options.length - 1 + optionId;
      if (document.getElementById(`inputActive${inputActiveId}`)) {
        let target = document.getElementById(`inputActive${inputActiveId}`);
        target.focus();
        target.select();
      }
    },
    async add() {
      let payload = {
        formId: this.formId,
        questionId: this.question.id,
        form: {
          options: `New Option`,
        },
      };

      let options = await this.$store.dispatch("questions/addOptions", payload);

      //reset field new option
      this.addOption = null;

      //focus to new input
      this.focusInput(options.option.id);
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
    async remove(id) {
      try {
        let payload = {
          formId: this.formId,
          questionId: this.question.id,
          optionId: id,
        };

        //update question options
        await this.$store.dispatch("questions/removeOptions", payload);

        //clear input
        // this.option.value = ''
      } catch (err) {
        this.$store.commit("alerts/show", {
          type: "error",
          message: err.response
            ? this.$t(err.response.data.message)
            : this.$t("SERVER_ERROR"),
        });
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
