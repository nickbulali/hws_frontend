import { Ability } from '@casl/ability'

const state = {
	roles: {},
};

const getters = {
    ability: (state) => state.roles
	// ability() {
    //     return new Ability()
    //   }
};

const actions = {
	async fetchRoles({commit}) {
		const response = await apiCall({url: '/api/role', method: 'GET' });
		commit('setRoles', response)
	},
};

const mutations = {
	setRules: (state, response) => (state.roles = response)
};

export default {
	state,
	getters,
	actions,
	mutations
}