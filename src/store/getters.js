const getters = {
  sidebar: state => state.app.sidebar,
  loginDialog: state => state.app.loginDialog,
  device: state => state.app.device,
  isLuna:state => state.app.isLuna,
  systemType:state => state.app.systemType,
  // isLuna:state => {
  //   console.log('app',state.app.isLuna);
  //   return state.app.isLuna
  // },
  rootPath:state => state.app.rootPath,
  // rootPath:state => {
  //   console.log('app',state.app.rootPath);
  //   return
  // },
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
}
export default getters
