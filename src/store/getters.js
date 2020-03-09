const getters = {
  themeColor: state => state.app.themeColor,
  token: state => state.user.token,
  userid: state => state.user.userid,
  username: state => state.user.username,
  usertype: state => state.user.usertype,
  imageUrl: state => state.user.imageUrl,
  roles: state => state.user.roles,
  // 当前用户具有的权限路由列表
  permisstion_routes: state => state.permission.routes,

  // 菜单信息
  menuType: state => state.menu.menuType,
  typeList: state => state.menu.typeList,
  menuList: state => state.menu.menuList
}
export default getters
