import apiCall from '../../utils/api'

const state = {
	stats: [],
};

const getters = {
	stats: (state) => state.stats,
}

const actions = {
	async fetchstats({commit, state}) {
		const response = await apiCall({url: `/api/user?type=stats`, method: 'GET' });
		commit('setstats', response)
	},
};

const mutations = {
	setstats : (state, stats) => state.stats = stats,
};

export default {
	state,
	getters,
	actions,
	mutations
}
