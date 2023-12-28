<template>
  <v-toolbar flat height="40px">
    <v-spacer></v-spacer>
    <v-btn plain :ripple="false" :to="`/questions/${id}`"> Questions </v-btn>
    <v-btn plain :ripple="false" :to="`/responses/${id}`"> Response's </v-btn>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("forms", ["id"]),
  },
};
</script>
