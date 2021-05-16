import { set,get,remove } from '@/common/utils/auth'
// import { resetRouter } from '@/router'
import {MessageBox} from 'element-ui'

const state = {
  token: get('token'),
  name: get('name'),
  // isAdmin: get('isAdmin'),
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    set('token', token)
  },
  SET_NAME: (state, name) => {
    state.name = name
    set('name', name)
  },
  RESET_STATE:()=>{
    remove('token')
    remove('name')
  }
  // SET_IS_ADMIN: (state, isAdmin) => {
  //   state.isAdmin = isAdmin
  //   set('isAdmin', isAdmin)
  // }
}

const actions = {
  // user login
  async setUserData({commit},data){
    // console.log(data);
    commit('SET_TOKEN', data.token)
    commit('SET_NAME', data.name)
    // commit('SET_IS_ADMIN', data.isAdmin)
  },
  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response
  //
  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }
  //
  //       const { name, avatar } = data
  //
  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  async logout({ commit }) {
    // removeToken() // must remove  token  first
    // console.log('logout');
    // resetRouter()
    await MessageBox.confirm("确认退出吗？", "提示", {
      // type:'warning'
    })
    commit('RESET_STATE')

    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('RESET_STATE')
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
