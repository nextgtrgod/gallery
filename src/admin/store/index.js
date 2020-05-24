import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import data from '@/admin/mock/data'

export default new Vuex.Store({
	state: {
		...data,
	},
	mutations: {

	},
})
