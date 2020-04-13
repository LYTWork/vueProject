import { setToken, getToken, removeToken } from '../../utils/token'
const state = {
  token: getToken(),
  userid: '',
  username: '',
  userpassword: '',
  imgurl: '',
  roles: [],
  data: {}
}

const mutations = {
  USER_MUTATION: (state, userdata) => {
    setToken(userdata.token)
    state.token = userdata.token;
    state.data = userdata;
    state.userid = userdata.userid;
    state.username = userdata.uname;
    state.userpassword = userdata.upass;
    state.imgurl = userdata.imgurl;
    state.roles = userdata.roles;
  }
}

const actions = {
  setUserdata({ commit }, userdata) {
    commit('USER_MUTATION', userdata);
  },

  getInfo({ commit, state }) {
    const data = state.data;
    state.userid = data.userid;
    state.username = data.uname;
    state.userpassword = data.upass;
    state.imgurl = data.imgurl;
    state.roles = data.roles;
  },
  // remove Token
  resetToken({ commit, state }) {
    return new Promise(resolve => {
      commit('USER_MUTATION', '')
      state.roles = []
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
