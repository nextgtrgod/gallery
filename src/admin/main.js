import Vue from 'vue'
import App from '@/admin/App.vue'

Vue.config.productionTip = false

new Vue({
	render: function (h) { return h(App) }
}).$mount('#app')
