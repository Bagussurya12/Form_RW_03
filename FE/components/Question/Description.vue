<template>
  <v-text-field
    hide-details
    placeholder="Desciption"
    :value="description"
    @input="typing($event)"
  >
  </v-text-field>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      timer: null,
    };
  },
  computed: {
    ...mapState("forms", ["id", "description"]),
  },
  methods: {
    async typing(value) {
      try {
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          let payload = {
            formId: this.id,
            description: value,
          };
          const formTitle = await this.$store.dispatch("forms/update", payload);
          if (!formTitle) {
            throw { message: "ERROR" };
          }
        }, 2000);
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
};
</script>
