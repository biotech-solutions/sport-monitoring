import axios from 'axios';

export default {
	namespaced: true,
	state: {
		users: [],
		availableUsers: [],
		currentUser: {
			id: 0,
			username: '',
			password: '',
			profile: 0,
			enabled: false
		},
	},
	getters: {
		fixedUsers(state)
		{
			let fixedUsers = state.users;
			fixedUsers.forEach(replaceEnabled);
			return fixedUsers;
		},
		getById(state, id)
		{
			let users = state.users;
			return users.find(user => user.id === id);
		}
	},
	mutations: {
		setUsers(state, data)
		{
			state.users = data;
		},
		setAvailableUsers(state, data)
		{
			state.availableUsers = data;
		},
		setCurrentUser(state, data)
		{
			state.currentUser = data;
		}
	},
	actions: {
		getUsers({ commit })
		{
			let store = this.$store;

			axios.get('users').then(function (response)
			{
				let users = response.data._embedded.users;
				commit('setUsers', users);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los usuarios',
					color: 'error'
				};
			});
		},
		getAvailableUsers({ commit })
		{
			let store = this.$store;

			commit('setAvailableUsers', []);
			axios.get('users/search/findBySportmanIsNullAndCoachIsNull').then(function (response)
			{
				let users = response.data._embedded.users;
				commit('setAvailableUsers', users);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los usuarios',
					color: 'error'
				};
			});
		},
		getAvailableUsersAndCurrentSportman({ commit }, userId)
		{
			let store = this.$store;

			let requestParams = {
				params: {
					sportman_userId: userId
				}
			};
			commit('setAvailableUsers', []);
			axios.get('users/search/findBySportmanIsNullAndCoachIsNullOrSportmanUserId',requestParams).then(function (response)
			{
				let users = response.data._embedded.users;
				commit('setAvailableUsers', users);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los usuarios',
					color: 'error'
				};
			});
		},
		getAvailableUserAndCurrentCoach({commit}, userId)
		{
			let store = this.$store;

			let requestParams = {
				params: {
					coach_userId: userId
				}
			};
			commit('setAvailableUsers', []);
			axios.get('users/search/findBySportmanIsNullAndCoachIsNullOrCoachUserId',requestParams).then(function (response)
			{
				let users = response.data._embedded.users;
				commit('setAvailableUsers', users);
			}).catch(function ()
			{
				store.state.appSnackBar = {
					visible: true,
					text: 'Error al consultar los usuarios',
					color: 'error'
				};
			});
		}

	}
};

function replaceEnabled(user)
{
	if (user.enabled === 1)
	{
		user.enabled = "Si";
	}
	else
	{
		user.enabled = "No";
	}
}