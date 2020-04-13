const getters = {
  token: state => state.user.token,
  userid: state => state.user.userid,
  username: state => state.user.username,
  userpassword: state => state.user.userpassword,
  imgurl: state => state.user.imgurl,
  roles: state => state.user.roles,
  // 当前用户具有的权限路由列表
  permisstion_routes: state => state.permission.routes,

  // 菜单信息
  menuList: state => state.menu.menuList
}
export default getters
