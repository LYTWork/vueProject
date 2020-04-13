const state = {
  menuList: ''
}

const mutations = {
  MENU_MUTATION: (state, menudata) => {
    state.menuList = menudata.menuList
  }
}

const actions = {
  setMenu({ commit }, menudata) {
    commit("MENU_MUTATION", menudata)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
