<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card>
        <v-toolbar color="primary"> Edit User</v-toolbar>
        <v-card-text color="black">
          <v-breadCrumbs :items="breadCrumbs" class="pa-0"></v-breadCrumbs>

          <v-form refs="form">
            <v-text-field
              name="Name"
              label="Nama Lengkap"
              type="text"
              color="primary"
              :rules="rules.fullname"
              v-model="form.fullname"
            />
            <v-text-field
              name="Email"
              label="Email"
              type="email"
              color="primary"
              :rules="rules.email"
              v-model="form.email"
            />
            <v-text-field
              name="Password"
              label="Kata Sandi"
              type="password"
              color="primary"
              :rules="rules.password"
              v-model="form.password"
            />
            <v-text-field
              name="Re Type Password"
              label="Konfirmasi Kata Sandi"
              type="password"
              color="primary"
              :rules="rules.retype_password"
              v-model="form.retype_password"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="onSubmit" :disabled="isDisable">
            <span v-if="!isDisable">Simpan</span>
            <v-progress-circular
              v-else
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  // middleware: ['authenticated']
  asyncData({ params }) {
    return {
      id: params.id,
    };
  },
  data() {
    return {
      isDisable: false,
      roles: ["Admin", "RW", "RT", "Warga"],
      emailExist: false,
      breadCrumbs: [
        {
          text: "Users",
          disabled: false,
          to: "/users",
          exact: true,
        },
        {
          text: "Edit User",
          disabled: true,
        },
      ],
      form: {
        fullname: "",
        email: "",
        password: "",
        retype_password: "",
        role: "",
      },
      rules: {
        fullname: [(v) => !!v || this.$t("FULLNAME_IS_REQUIRED")],
        email: [
          (v) => !!v || this.$t("EMAIL_IS_REQUIRED"),
          (v) => /.+@.+/.test(v) || this.$t("EMAIL_INVALID"),
          (v) => !this.emailExist || this.$t("EMAIL_EXIST"),
        ],
        password: [
          (v) => v.length == 0 || !!v || this.$t("PASSWORD_REQUIRED"),
          (v) =>
            v.length == 0 ||
            v.length >= 7 ||
            this.$t("PASSWORD_MUST_BE_ AT_LEAST_7_CHARACTER"),
        ],
        retype_password: [
          (v) =>
            v === this.form.password ||
            this.$t("RE_PASSWORD_MUST_BE_SAME_WITH_PASSWORD"),
        ],
        role: [(v) => v === this.form.role || this.$t("ROLE_IS_REQUIRED")],
      },
    };
  },
  methods: {
    fetchDataUserById() {
      this.$axios
        .$get(`/users/${this.id}`)
        .then((response) => {
          this.form.fullname = response.User.fullname;
          this.form.email = response.User.email;
          this.form.role = response.User.role;
        })
        .catch((error) => {
          this.$router.push({
            name: "users___" + this.i18n.locale,
            params: {
              message: "ID_NOT_FOUND",
            },
          });
        });
    },
    checkEmailExist() {
      this.emailExist = false;
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.isDisable = true;
        this.$axios
          .$put(`/users/${this.id}`, this.form)
          .then((response) => {
            this.isDisable = false;

            this.$router.push({
              name: "users___" + this.i18n.locale,
              params: {
                message: "UPDATE_SUCCESS",
                fullname: this.form.fullname,
              },
            });
          })
          .catch((error) => {
            if (error.response.data.message == "EMAIL_EXIST") {
              this.emailExist = true;
              this.$refs.form.validate();
            }
            this.isDisable = false;
          });
      }
    },
    mounted() {
      this.fetchDataUserById();
    },
  },
};
</script>
