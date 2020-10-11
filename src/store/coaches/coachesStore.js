import axios from 'axios';

export default {
	namespaced: true,
	state: {
		coaches: [],
		currentCoach: {}
	},
	mutations: {
		setCoaches(state, data)
		{
			state.coaches = data;
		},
		setCurrentCoach(state, data)
		{
			state.currentCoach = data;
		}
	},
	actions: {
		getCoaches({commit})
		{
			let store = this.$store;

			axios.get('coaches').then(function (response)
			{
				let coaches = response.data;
				commit('setCoaches', coaches);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los entrenadores',
					color: 'error'
				};
			})
		}
	}
};