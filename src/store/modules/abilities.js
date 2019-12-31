import { Ability } from '@casl/ability'

const state = {
	rules: []
};

const getters = {
	ability() {
        return new Ability()
      }
};

const actions = {
	
};

const mutations = {
	setRules: (state, response) => (state.rules = response)
};

export default {
	state,
	getters,
	actions,
	mutations
}