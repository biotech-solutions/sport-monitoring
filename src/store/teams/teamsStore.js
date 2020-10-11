import axios from 'axios';

export default {
	namespaced: true,
	state: {
		teams: [],
		currentTeam: {}
	},
	mutations: {
		setTeams(state, data)
		{
			state.teams = data;
		},
		setCurrentTeam(state, data)
		{
			state.currentTeam = data;
		}
	},
	actions: {
		getTeams({commit})
		{
			let store = this.$store;

			axios.get('teams').then(function (response)
			{
				let teams = response.data;
				commit('setTeams', teams);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los equipos',
					color: 'error'
				};
			})
		}
	}
};