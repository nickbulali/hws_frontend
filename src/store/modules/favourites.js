import apiCall from '../../utils/api'

const state = {
	favourites: [],
	favouritePagination: {
		search: ' ',
		current_page: 1,
		per_page: 0,
	    total: 0,
	    visible: 10
    },
};

const getters = {
	favourites: (state) => state.favourites,
	favouritePagination: (state) => state.favouritePagination,
}

const actions = {
	async fetchfavourites({commit, state}) {
		const response = await apiCall({url: `/api/userFavourite`, method: 'GET' });
		commit('setfavourites', response)
	},
};

const mutations = {
	setfavourites: (state, response) => {
		state.favourites = response.data
		state.favouritePagination.current_page = response.current_page
		state.favouritePagination.total = response.total
		state.favouritePagination.per_page = response.per_page
    },
};

export default {
	state,
	getters,
	actions,
	mutations
}
