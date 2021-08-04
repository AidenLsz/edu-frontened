// import Cookies from 'js-cookie'
import { set,get } from '@/common/utils/auth'

const state = {
  sidebar: {
    opened: get('sidebarStatus') ? !!+get('sidebarStatus') : true,
    withoutAnimation: false
  },
  loginDialog: {
    opened: get('loginDialogStatus') ? !!+get('loginDialogStatus') : true,
  },
  rootPath:get('rootPath')||'/',
  isLuna:get('isLuna')||true,
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      set('sidebarStatus', 1)
    } else {
      set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  OPEN_LOGIN_DIALOG: (state) => {
    set('loginDialogStatus', 1)
    state.loginDialog.opened = true
  },
  CLOSE_LOGIN_DIALOG: (state) => {
    set('loginDialogStatus', 0)
    state.loginDialog.opened = false
  },
  SET_SYS_STATE:(state,data) => {
    set('rootPath',data.rootPath)
    state.rootPath=data.rootPath
    set('isLuna',data.isLuna)
    state.isLuna=data.isLuna
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  openLoginDialog({ commit }){
    commit('OPEN_LOGIN_DIALOG')
  },
  closeLoginDialog({ commit }){
    commit('CLOSE_LOGIN_DIALOG')
  },
  setSysState({ commit },data) {
    commit('SET_SYS_STATE',data)
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
