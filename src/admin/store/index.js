import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import data from '@/admin/mock/data'

export default new Vuex.Store({
	state: {
		...data,
	},
	mutations: {
		update: (state, data) => {
			state.images = [
				...state.images.map(image => (
					image.id !== data.id
						? image
						: Object.assign({}, image, data)
				))
			]
		},
	},
})
