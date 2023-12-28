<template>
  <v-select
    :items="items"
    v-model="type"
    hide-details
    class="creator-input"
    filled
  >
    <template v-slot:selection="{ item }">
      <v-icon class="mr-3">{{ item.icon }}</v-icon>
      {{ item.value }}
    </template>
    <template v-slot:item="{ item }">
      <v-icon class="mr-3">{{ item.icon }}</v-icon>
      {{ item.value }}
    </template>
  </v-select>
</template>

<script>
//import { mapState } from "vuex";
export default {
  props: ["formId", "question"],
  data() {
    return {
      type: this.question.type,
      items: [
        { value: "Text", icon: "mdi-text-short" },
        { value: "Email", icon: "mdi-email" },
        { value: "Dropdown", icon: "mdi-arrow-down-drop-circle-outline" },
        { value: "Checkbox", icon: "mdi-check-circle-outline" },
        { value: "Radio", icon: "mdi-adjust" },
      ],
    };
  },
  //   computed: {
  //     ...mapState("forms", ["id", "title"]),
  //   },
  methods: {
    async submit() {
      try {
        let payload = {
          formId: this.formId,
          questionId: this.question.id,
          form: {
            type: this.type,
          },
        };
        await this.$store.dispatch("questions/update", payload);
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
    type() {
      this.submit();
    },
  },
};
</script>
