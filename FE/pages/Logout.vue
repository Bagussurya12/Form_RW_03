<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card color="#004643" text-color="#ff8906" dark>
        <v-card-text class="d-flex align-center">
          <h2 class="mb-0">Logout</h2>
          <v-progress-circular indeterminate color="#ff8906" class="ml-3">
          </v-progress-circular>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// import * as Cookies from "js-cookie";
export default {
  layout: "auth",
  middleware: ["authenticated"],
  mounted() {
    setTimeout(() => {
      this.$store.commit("auth/logout");
      this.$router.push({ name: "Login___" + this.$i18n.locale });
    }, 3000);
    // Cookies.remove("vuex");
    // window.location.href = "/Login";
  },
};
</script>
