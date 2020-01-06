import apiCall from '../../utils/api'

const state = {
    individualUpcoming: [],
    individualHistorical: [],
    workerUpcoming: [],
    workerHistorical: [],
    individualUpcomingPagination: {
		search: ' ',
		current_page: 1,
		per_page: 0,
	    total: 0,
	    visible: 10
    },
    individualHistoricalPagination: {
		search: ' ',
		current_page: 1,
		per_page: 0,
	    total: 0,
	    visible: 10
    },
    workerUpcomingPagination: {
		search: ' ',
		current_page: 1,
		per_page: 0,
	    total: 0,
	    visible: 10
    },
    workerHistoricalPagination: {
		search: ' ',
		current_page: 1,
		per_page: 0,
	    total: 0,
	    visible: 10
    },
};

const getters = {
    allIndividualUpcoming: (state) => state.individualUpcoming,
    allIndividualHistorical: (state) => state.individualHistorical,
    allWorkerUpcoming: (state) => state.workerUpcoming,
	allWorkerHistorical: (state) => state.workerHistorical,
	individualUpcomingPagination: (state) => state.individualUpcomingPagination,
	individualHistoricalPagination: (state) => state.individualHistoricalPagination,
	workerUpcomingPagination: (state) => state.workerUpcomingPagination,
	workerHistoricalPagination: (state) => state.workerHistoricalPagination,
};

const actions = {
	async fetchIndividualUpcoming({commit}, page) {
		const response = await apiCall({url: `/api/userRequest?page=${page}&type=individualUpcoming`, method: 'GET' });
		commit('setIndividualUpcoming', response)
    },
    async fetchIndividualHistorical({commit}, page) {
		const response = await apiCall({url: `/api/userRequest?page=${page}&type=individualHistorical`, method: 'GET' });
		commit('setIndividualHistorical', response)
    },
    async fetchWorkerUpcoming({commit}, page) {
		const response = await apiCall({url: `/api/userRequest?page=${page}&type=workerUpcoming`, method: 'GET' });
		commit('setWorkerUpcoming', response)
    },
    async fetchWorkerHistorical({commit}, page) {
		const response = await apiCall({url: `/api/userRequest?page=${page}&type=workerHistorical`, method: 'GET' });
		commit('setWorkerHistorical', response)
	},
};

const mutations = {
	setIndividualUpcoming: (state, userRequest) => {
		state.individualUpcoming = userRequest.data
		state.individualUpcomingPagination.current_page = userRequest.current_page
		state.individualUpcomingPagination.total = userRequest.total
		state.individualUpcomingPagination.per_page = userRequest.per_page
    },
    setIndividualHistorical: (state, userRequest) => {
		state.individualHistorical = userRequest.data
		state.individualHistoricalPagination.current_page = userRequest.current_page
		state.individualHistoricalPagination.total = userRequest.total
		state.individualHistoricalPagination.per_page = userRequest.per_page
    },
    setWorkerUpcoming: (state, userRequest) => {
		state.workerUpcoming = userRequest.data
		state.workerUpcomingPagination.current_page = userRequest.current_page
		state.workerUpcomingPagination.total = userRequest.total
		state.workerUpcomingPagination.per_page = userRequest.per_page
    },
    setWorkerHistorical: (state, userRequest) => {
		state.workerHistorical = userRequest.data
		state.workerHistoricalPagination.current_page = userRequest.current_page
		state.workerHistoricalPagination.total = userRequest.total
		state.workerHistoricalPagination.per_page = userRequest.per_page
	},
};

export default {
	state,
	getters,
	actions,
	mutations
}