<template>
  <v-row>
    <v-col md="4" cols="10" offset="1" offset-md="4">
      <v-card rounded="rounded-xl">
        <v-toolbar dark color="#ff8906" text-color="#fffffe" plain>
          Register
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="form.fullname"
              label="Nama Lengkap"
              :rules="rules.fullname"
              required
              color="#ff8906"
              light
            />
            <v-text-field
              label="Email"
              type="email"
              v-model="form.email"
              :rules="rules.email"
              required
              color="#ff8906"
              light
              @keydown="resetEmailExistMessage"
            />
            <v-text-field
              label="Password"
              :rules="rules.password"
              v-model="form.password"
              type="password"
              required
              color="#ff8906"
              light
            />

            <v-text-field
              label="Confirm Password"
              type="password"
              v-model="form.passwordConfirmation"
              :rules="rules.passwordConfirmation"
              required
              color="#ff8906"
              light
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn color="#ff8906" dark @click="onSubmit" :loading="isLoading"
            >Register</v-btn
          >
        </v-card-actions>
      </v-card>
      <div class="d-flex align-baseline" style="color: white">
        Kamu Sudah Punya Akun?
        <v-btn
          text
          color="white"
          :to="localePath('/login')"
          plain
          :ripple="false"
          class="pl-1"
        >
          Login
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: ["unauthenticated"],
  layout: "auth",
  data() {
    return {
      emailExist: false,
      isLoading: false,
      form: {
        fullname: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      },
      rules: {
        fullname: [
          (v) => !!v || this.$t("FIELD_REQUIRED", { field: "NAMA LENGKAP" }),
        ],
        email: [
          (v) => !!v || this.$t("FIELD_REQUIRED", { field: "EMAIL" }),
          (v) =>
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) ||
            this.$t("EMAIL_INVALID"),
          (v) => !this.emailExist || this.$t("EMAIL_EXIST"),
        ],
        password: [
          (v) => !!v || this.$t("FIELD_REQUIRED", { field: "PASSWORD" }),
          (v) =>
            v.length >= 7 ||
            this.$t("FIELD_MIN", { field: "PASSWORD", min: 7 }),
        ],
        passwordConfirmation: [
          (v) =>
            !!v || this.$t("FIELD_REQUIRED", { field: "KONFIRMASI PASSWORD" }),
          (v) =>
            v === this.form.password ||
            this.$t("FIELD_CONFIRM", {
              confirm: "KONFIRMASI PASSWORD",
              field: "PASSWORD",
            }),
        ],
      },
    };
  },
  methods: {
    resetEmailExistMessage() {
      this.emailExist = false;
    },
    async onSubmit() {
      try {
        if (this.$refs.form.validate()) {
          this.isLoading = true;
          const response = await this.$axios.$post("/register", this.form);
          if (response.message == "USER_REGISTER_SUCCESS") {
            this.$store.commit("auth/setFullname", response.fullname);
            this.$store.commit("auth/setAccessToken", response.accessToken);
            this.$store.commit("auth/setRefreshToken", response.refreshToken);
            this.$store.commit("auth/setRole", response.role);
            this.$router.push({ name: "index___" + this.$i18n.locale }); //Redirect To Home Page
          }
          this.isLoading = false;
        }
      } catch (error) {
        if (error.response.data.message == "EMAIL_ALREADY_EXIST") {
          this.emailExist = true;
          this.$refs.form.validate();
        }
        this.isLoading = false;
      }
    },
  },
};
</script>
