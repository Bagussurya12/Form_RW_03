<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card>
        <v-toolbar color="primary">Add User</v-toolbar>
        <v-card-text color="primary">
          <v-breadCrumbs :items="breadCrumbs" class="pa-0"></v-breadCrumbs>
          <v-from ref="form">
            <v-text-field
              name="name"
              label="Nama Lengkap"
              type="text"
              color="primary"
              :rules="rules.fullname"
              v-model="form.fullname"
            />
            <v-text-field
              name="email"
              label="Email"
              type="email"
              color="primary"
              :rules="rules.email"
              v-model="form.email"
            />
            <v-select
              name="Role"
              label="Role"
              :items="roles"
              color="primary"
              v-model="form.role"
            />
            <v-text-field
              name="password"
              label="Kata Sandi"
              type="text"
              color="primary"
              :rules="rules.password"
              v-model="form.password"
            />
            <v-text-field
              name="retype_password"
              label="Kata Sandi"
              type="text"
              color="primary"
              :rules="rules.retype_password"
              v-model="form.retype_password"
            />
          </v-from>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="onSubmit" :disabled="isDisable">
            <v-span v-if="!isDisable">Simpan</v-span>
            <v-progres-circular v-else color="primary" indeterminate />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  //   middleware: ["authenticated"],
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
          text: "Create",
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
          (v) => !this.emailExist || this.$t("IS_EMAIL_EXIST"),
          (v) => /.+@.+/.test(v) || this.$t("EMAIL_INVALID"),
        ],
        password: [
          (v) => !!v || this.$t("PASSWORD_IS_REQUIRED"),
          (v) =>
            v.length >= 7 || this.$t("PASSWORD_MUST_BE_AT_LEAST_7_CHARACTER"),
        ],
        retype_password: [
          (v) => !!v || this.$t("RETYPE_PASSWORD_IS_REQUIRED"),
          v === this.form.password ||
            this.$t("RE_PASSWORD_MUST_BE_SAME_WITH_PASSWORD"),
        ],
        role: [(v = !!v || this.$t("ROLE_IS_REQUIRED"))],
      },
      methods: {
        checkEmailExist() {
          this.emailExist = false;
        },
        onSubmit() {
          if (this.$refs.form.validate()) {
            this.isDisable = true;
            this.$axios
              .$post("/users", this.form)
              .then((response) => {
                this.isDisable = false;

                this.$router.push({
                  name: "users___" + this.i18n.locale,
                  params: {
                    message: "CREATE_SUCCESS",
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
      },
    };
  },
};
</script>
