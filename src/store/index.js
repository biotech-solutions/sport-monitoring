import Vue from 'vue';
import Vuex from 'vuex';
import usersStore from "@/store/users/usersStore";
import sportmenStore from "@/store/sportmen/sportmenStore";
import teamsStore from "@/store/teams/teamsStore";
import sportsStore from "@/store/sports/sportsStore";
import coachesStore from "@/store/coaches/coachesStore";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		appSnackBar: {
			visible: false,
			text: '',
			color:'info'
		}
	},
	mutations: {},
	actions: {},
	modules: {
		usersStore,
		sportmenStore,
		teamsStore,
		sportsStore,
		coachesStore
	}
});
