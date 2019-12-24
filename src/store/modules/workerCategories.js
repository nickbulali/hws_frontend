import apiCall from '../../utils/api'

const state = {
	workerCategories: {}
};

const getters = {
	allWorkerCategories: (state) => state.workerCategories
};

const actions = {
	async fetchWorkerCategories({commit}) {
		const response = await apiCall({url: '/api/workerCategory', method: 'GET' });
		commit('setWorkerCategories', response)
	},
};

const mutations = {
	setWorkerCategories: (state, response) => (state.workerCategories = response)
};

export default {
	state,
	getters,
	actions,
	mutations
}