import apiCall from '../../utils/api'

const state = {
	workerSubCategories: {}
};

const getters = {
	allWorkerSubCategories: (state) => state.workerSubCategories
};

const actions = {
	async fetchWorkerSubCategories({commit}) {
		const response = await apiCall({url: '/api/workerSubCategory', method: 'GET' });
		commit('setWorkerSubCategories', response)
	},
};

const mutations = {
	setWorkerSubCategories: (state, response) => (state.workerSubCategories = response)
};

export default {
	state,
	getters,
	actions,
	mutations
}