import apiCall from '../../utils/api'

const state = {
	notifications: [],
};

const getters = {
	notifications: (state) => state.notifications,
}

const actions = {
	async fetchnotifications({commit, state}) {
		const response = await apiCall({url: `/api/notifications`, method: 'GET' });
		commit('setnotifications', response)
	},
};

const mutations = {
	setnotifications : (state, notifications) => state.notifications = notifications,
};

export default {
	state,
	getters,
	actions,
	mutations
}
