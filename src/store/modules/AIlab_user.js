import { set,get,remove } from '@/common/utils/auth'
import {MessageBox} from 'element-ui'

const state = {
  AItoken: get('AItoken'),
  AIname: get('AIname'),
  // isExamVersion:get('isExamVersion'),
  // isAdmin: get('isAdmin'),
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.AItoken = token
    set('AItoken', token)
  },
  SET_NAME: (state, name) => {
    state.AIname = name
    set('AIname', name)
  },
  // SET_IS_EXAM_VERSION:(state,data) => {
  //   state.isExamVersion=data
  //   set('isExamVersion',data)
  // },

  RESET_STATE:()=>{
    remove('AItoken')
    remove('AIname')
    // remove('rootPath')
    // remove('isExamVersion')
  }
  // SET_IS_ADMIN: (state, isAdmin) => {
  //   state.isAdmin = isAdmin
  //   set('isAdmin', isAdmin)
  // }
}

const actions = {
  // user login
  async setUserData({commit},data){
    commit('SET_TOKEN', data.token)
    commit('SET_NAME', data.name)
  },

  // user logout
  async logout({ commit }) {
    await MessageBox.confirm("确认退出吗？", "提示", {
      // type:'warning'
    })
    // commit('SET_ROOTPATH', '/')
    commit('RESET_STATE')
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
