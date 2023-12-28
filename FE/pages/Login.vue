<template>
  <v-row>
    <v-col md="4" cols="10" offset="1" offset-md="4">
      <v-card rounded="rounded-xl">
        <v-toolbar dark color="primary" text-color="#fffffe" plain>
          Login
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Email"
              type="email"
              required
              color="#ff8906"
              light
              :rules="rules.email"
              v-model="form.email"
            />
            <v-text-field
              label="Password"
              type="password"
              required
              color="#ff8906"
              light
              :rules="rules.password"
              v-model="form.password"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn color="primary" dark @click="onSubmit" :loading="isDisable"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
      <div class="d-flex align-baseline" style="color: black">
        Kamu Belum Punya Akun?
        <v-btn
          text
          color="#ff8906"
          :to="localePath('/register')"
          plain
          :ripple="false"
          class="pl-1"
        >
          Register
        </v-btn>
        <br />
      </div>
      <v-alert color="red" dark v-if="isError" class="text-center">
        {{ $t(message) }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  middleware: ["unauthenticated"],
  layout: "auth",

  data() {
    return {
      isLoading: false,
      isDisable: false,
      isError: false,
      message: "",
      form: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          (v) => !!v || this.$t("FIELD_REQUIRED", { field: "EMAIL" }),
          (v) =>
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) ||
            this.$t("EMAIL_INVALID"),
        ],
        password: [
          (v) => !!v || this.$t("FIELD_REQUIRED", { field: "PASSWORD" }),
          (v) =>
            v.length >= 7 ||
            this.$t("FIELD_MIN", { field: "PASSWORD", min: 7 }),
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      try {
        this.isLoading = true;

        const user = await this.$store.dispatch("auth/login", this.form);

        this.isLoading = false;

        this.$router.push({ name: "index___" + this.$i18n.locale }); //Redirect To Home Page
      } catch (error) {
        this.isError = true;
        this.isDisable = false;

        this.message = error.response
          ? error.response.data.message
          : "SERVER_ERROR";
        this.isLoading = false;
        console.log(error);
      }
    },
  },
  mounted() {
    if (this.$route.params.message == "AUTH_REQUIRED") {
      this.message = this.$route.params.message;
      this.isError = true;
    }
  },
};
</script>
