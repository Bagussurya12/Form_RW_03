<template light>
  <v-toolbar color="white" light class="px-1 px-md-2">
    <v-btn plain text :ripple="false" class="pl-0 v-btn--active" to="/">
      <p class="text-h5 mb-0"><Strong>Form</Strong> RW 03</p>
    </v-btn>
    <p class="ml-3 mb-0 muted" v-if="process">{{ $t(message) }}</p>
    <v-spacer></v-spacer>
    <HeaderSend class="mr-5" />
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn to="/" v-on="on" text color="primary" icon
          ><v-icon>mdi-account</v-icon></v-btn
        >
      </template>
      <v-list>
        <v-list-item to="/logout">Logout</v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("saves", ["process", "message"]),
  },
};
</script>
