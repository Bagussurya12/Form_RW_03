<template>
  <v-app dark>
    <v-main>
      <AlertRight /> <Navigation />
      <TheHeader />

      <Nuxt />
    </v-main>
    <!-- <v-footer color="white" dark class="mt-5 pt-5">
      <div>
        <div class="d-flex justify-center">
          <h4>Data Information System RW 03</h4>
        </div>
        <div>
          Copy Right <v-icon>mdi-copyright</v-icon>
          {{ new Date().getFullYear() }}
        </div>
      </div>
    </v-footer> -->
  </v-app>
</template>

<script>
import AlertRight from "~/components/AlertRight.vue";
import Navigation from "~/components/Navigation.vue";

export default {
  name: "DefaultLayout",
  components: { AlertRight, Navigation },
};
</script>
