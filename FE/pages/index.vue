<template>
  <v-container class="mt-3">
    <v-row>
      <v-col cols="12" class="text-right">
        <BtnCreateForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BtnCreateForm from "~/components/BtnCreateForm.vue";

export default {
  middleware: ["authenticated"],
  name: "Home",
  head() {
    return {
      title: "Beranda",
    };
  },
  methods: {
    async fetchForm() {
      try {
        const response = await this.$axios.$get("/forms");
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.fetchForm();
  },
};
</script>
