import apiCall from '../../utils/api'

const state = {
	roles: {}
};

const getters = {
	allRoles: (state) => state.roles
};

const actions = {
	async fetchRoles({commit}) {
		const response = await apiCall({url: '/api/role', method: 'GET' });
		commit('setRoles', response)
	},
};

const mutations = {
	setRoles: (state, response) => (state.roles = response)
};

export default {
	state,
	getters,
	actions,
	mutations
}