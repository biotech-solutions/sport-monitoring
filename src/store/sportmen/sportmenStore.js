import axios from 'axios';

export default {
	namespaced: true,
	state: {
		sportmen: [],
		sportmenWithoutUser: [],
		currentSportman: {
			id: 0,
			name: '',
			suname: '',
			birthdate: '',
			countryOfOrigin: '',
			identificationType: '',
			identification: '',
			identificationFile: '',
			authorizationFile: '',
			maritalStatus: '',
			email: '',
			phone: '',
			technicalInformation: {
				id: 0,
				shirtSize: '',
				shoeSize: 0,
			},
			healthInformation: {
				id: 0,
				bloodType: '',
				alergies: '',
				diseases: '',
				injuries: '',
				lastHealthCheck: '',
				lastDeworming: '',
				lastSurgery: ''
			},
			userId: 0
		}
	},
	mutations: {
		setSportmen(state, data)
		{
			state.sportmen = data;
		},
		setCurrentSportman(state, data)
		{
			state.currentSportman = data;
		}
	},
	actions: {
		getSportmen({ commit })
		{
			let store = this.$store;

			axios.get('sportmen').then(function (response)
			{
				let sportmen = response.data;
				commit('setSportmen', sportmen);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los deportistas',
					color: 'error'
				};
			});
		}
	}
};