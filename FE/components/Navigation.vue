<template>
  <v-navigation-drawer
    disabled-resize-watcher
    v-model="sideDrawer"
    color="black"
    dark
    app
  >
    <v-list class="no-print no-view">
      <v-list-item
        v-for="(sideMenu, i) in sideMenu"
        :key="i"
        :to="sideMenu.to"
        router
        exact
      >
        <v-list-item-icon>
          <v-icon>{{ sideMenu.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ sideMenu.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Navigation",
  data() {
    return {
      sideDrawer: false,
      sideMenu: [],
      originalSideMenu: [
        {
          icon: "mdi-account-group",
          title: "User Management",
          to: "/users",
          middleware: ["Admin"],
        },
      ],
    };
  },
  computed: {
    ...mapGetters("auth", {
      authenticated: "authenticated",
      user: "user",
    }),
  },
  methods: {
    isWelcomeScreen() {
      if (!localStorage.welcomeScreen) {
        if (
          this.$router.currentRoute.path != "/register" &&
          this.$router.currentRoute.path != "/login"
        ) {
          this.$router.push("/login");
        }
      }
    },
    filterSideMenu() {
      this.sideMenu = this.originalSideMenu.filter((item) => {
        if (item.middleware.includes(this.user.role)) {
          return true;
        }
        if (this.authenticated) {
          return item.middleware.includes("authenticated");
        } else {
          return item.middleware.includes("unauthenticated");
        }
      });
    },
  },
  watch: {
    $route() {
      this.isWelcomeScreen();
    },
    authenticated() {
      this.filterSideMenu();
    },
  },
  mounted() {
    // localStorage.setItem('welcomeScreen', true)
    this.isWelcomeScreen();
    console.log(this.user);
    this.filterSideMenu();
  },
};
</script>
