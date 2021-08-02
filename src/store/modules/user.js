import { set,get,remove } from '@/common/utils/auth'
import {MessageBox} from 'element-ui'

const state = {
  token: get('token'),
  name: get('name'),
  // isExamVersion:get('isExamVersion'),
  rootPath:get('rootPath'),
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
  // SET_IS_EXAM_VERSION:(state,data) => {
  //   state.isExamVersion=data
  //   set('isExamVersion',data)
  // },
  SET_ROOTPATH:(state,data) => {
    state.rootPath=data
    set('rootPath',data)
  },
  RESET_STATE:()=>{
    remove('token')
    remove('name')
    remove('rootPath')
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
    commit('SET_ROOTPATH','/')
  },

  async setRootPath({ commit },data) {
    commit('SET_ROOTPATH',data)
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
