import axios from 'axios';

export default {
	namespaced: true,
	state: {
		teamExercises: [],
		currentTeamExercise: {}
	},
	mutations: {
		setTeamExercises(state, data)
		{
			state.teamExercises = data;
		},
		setCurrentTeamExercise(state, data)
		{
			state.currentTeamExercise = data;
		}
	},
	actions: {
		getSports({commit})
		{
			let store = this.$store;

			axios.get('teamExercises').then(function (response)
			{
				let coaches = response.data;
				commit('setCoaches', coaches);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los ejercicios grupales',
					color: 'error'
				};
			})
		}
	}
};