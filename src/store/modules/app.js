
const state = {
  themeColor: '#242f42'
}

const mutations = {
  // 主题切换
  TOGGLE_COLOR: (state, color) => {
    state.themeColor = color;
    // 动态修改homeicon颜色
    const homeicon = document.getElementById("homeIcon");
    homeicon.style.color = state.themeColor;
    const homespan = document.querySelector("#homeIcon+span");
    homespan.style.color = state.themeColor;
  }
}

const actions = {
  toggleColor({ commit }, color) {
    commit('TOGGLE_COLOR', color)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
