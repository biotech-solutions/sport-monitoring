import axios from 'axios';

export default {
	namespaced: true,
	state: {
		sports: [],
		currentSport: {}
	},
	mutations: {
		setSports(state, data)
		{
			state.sports = data;
		},
		setCurrentSport(state, data)
		{
			state.currentSport = data;
		}
	},
	actions: {
		getSports({commit})
		{
			let store = this.$store;

			axios.get('sports').then(function (response)
			{
				let sports = response.data._embedded.sports;
				commit('setSports', sports);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los deportes',
					color: 'error'
				};
			})
		}
	}
};