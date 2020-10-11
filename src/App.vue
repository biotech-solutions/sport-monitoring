<template>
    <v-app>
        <!--    <v-app-bar-->
        <!--      app-->
        <!--      color="primary"-->
        <!--      dark-->
        <!--    >-->
        <!--      <div class="d-flex align-center">-->
        <!--        <v-img-->
        <!--          alt="Vuetify Logo"-->
        <!--          class="shrink mr-2"-->
        <!--          contain-->
        <!--          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"-->
        <!--          transition="scale-transition"-->
        <!--          width="40"-->
        <!--        />-->

        <!--        <v-img-->
        <!--          alt="Vuetify Name"-->
        <!--          class="shrink mt-1 hidden-sm-and-down"-->
        <!--          contain-->
        <!--          min-width="100"-->
        <!--          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"-->
        <!--          width="100"-->
        <!--        />-->
        <!--      </div>-->

        <!--      <v-spacer></v-spacer>-->

        <!--      <v-btn-->
        <!--        href="https://github.com/vuetifyjs/vuetify/releases/latest"-->
        <!--        target="_blank"-->
        <!--        text-->
        <!--      >-->
        <!--        <span class="mr-2">Latest Release</span>-->
        <!--        <v-icon>mdi-open-in-new</v-icon>-->
        <!--      </v-btn>-->
        <!--    </v-app-bar>-->

        <!--    <v-main>-->
        <!--      <HelloWorld/>-->
        <!--    </v-main>-->
        <!--      <Login></Login>-->
        <router-view></router-view>
        <v-snackbar v-model="$store.state.appSnackBar.visible" :color="$store.state.appSnackBar.color">
            {{ $store.state.appSnackBar.text }}
        </v-snackbar>
    </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Login from "@/views/Login";
import firebase from 'firebase/app';
import "firebase/storage";

export default {
    name: 'App',
    components: {
        Login,
        HelloWorld,
    },

    data: () => ({}),
    mounted()
    {
        const firebaseConfig = {
            apiKey: "AIzaSyBxusHojucYxPjyUe-EVOHgFda_oaiKlvk",
            authDomain: "sport-monitoring.firebaseapp.com",
            databaseURL: "https://sport-monitoring.firebaseio.com",
            projectId: "sport-monitoring",
            storageBucket: "sport-monitoring.appspot.com",
            messagingSenderId: "1046725708693",
            appId: "1:1046725708693:web:504ac31f4cfc1c09c5049c"
        };

        firebase.initializeApp(firebaseConfig);
    }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Material+Icons");

body, html
{
    height: 100%;
    overflow-y: auto;
}

/*Color selector on board component*/
#color-select ul
{
    padding: 0;
}
</style>
