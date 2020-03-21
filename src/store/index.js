import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import store from './modules/store'
import getters from './getters'
import actions from './action'
// vue引用vuex组件 ，需要使用use
Vue.use(Vuex)
// import引用后，需要将其放入组件中
export default new Vuex.Store({
  modules: {
    book,
    store
  },
  getters,
  actions
})
