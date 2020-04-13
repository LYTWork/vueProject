<template>
  <div class="sidebar">
    <el-menu
      :default-active="onRoutes"
      :collapse="collapse"
      class="sidebar-el-menu"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <!-- 循环对象数组 -->
      <template v-for="item in menuList">
        <!-- 有二级菜单，循环对象的二级菜单 -->
        <template v-if="item.lowerMenu">
          <el-submenu :index="item.title" :key="item.id">  <!-- 一级菜单的index为自身id -->
            <template slot="title">
              <i :class="item.icon"/>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="child in item.lowerMenu"> <!-- 二级菜单的index为自身index -->
              <el-submenu
                v-if="child.lowerMenu"
                :index="child.url"
                :key="child.url"
              >
                <template slot="title">{{ child.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in child.lowerMenu"
                  :key="i"
                  :index="threeItem.url"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="child.url"
                :key="child.url"
              >{{ child.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.url" :key="item.url">
            <i :class="item.icon"/>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '@/utils/bus'
import { mapGetters, mapActions } from "vuex"
export default {
  name: 'Sidebar',
  data () {
    return {
      collapse: false,
      mockdata: [
        { "id": 1,
          "parentId": null,
          "title": "系统首页",
          "type": "二级菜单",
          "url": "/user/welcom",
          "icon": "el-icon-user"
        },
        { "id": 2,
          "parentId": null,
          "title": "权限设置",
          "type": "一级菜单",
          "icon": "el-icon-setting",
          "lowerMenu": [{ "id": 21,
            "parentId": 2,
            "title": "用户管理",
            "type": "二级菜单",
            "url": "/system/user"
          },
          { "id": 22,
            "parentId": 2,
            "title": "角色管理",
            "type": "二级菜单",
            "url": "/system/role"
          },
          { "id": 23,
            "parentId": 2,
            "title": "菜单管理",
            "type": "二级菜单",
            "url": "/system/menu"
          }]
        },
        { "id": 3,
          "parentId": null,
          "title": "基础资料",
          "type": "一级菜单",
          "icon": "el-icon-orange",
          "lowerMenu": [{ "id": 31,
            "parentId": 3,
            "title": "员工信息",
            "type": "二级菜单",
            "url": "/admin/staff"
          },
          { "id": 32,
            "parentId": 3,
            "title": "部门管理",
            "type": "二级菜单",
            "url": "/admin/dept"
          },
          { "id": 33,
            "parentId": 3,
            "title": "假种管理",
            "type": "二级菜单",
            "url": "/admin/holiday"
          },
          { "id": 34,
            "parentId": 3,
            "title": "职位管理",
            "type": "二级菜单",
            "url": "/admin/position"
          },
          { "id": 35,
            "parentId": 3,
            "title": "班别管理",
            "url": "/admin/class"
          }]
        },
        { "id": 4,
          "parentId": null,
          "title": "个人事务",
          "type": "一级菜单",
          "icon": "el-icon-watermelon",
          "lowerMenu": [{ "id": 41,
            "parentId": 4,
            "title": "签到",
            "type": "二级菜单",
            "url": "/user/sign"
          },
          { "id": 42,
            "parentId": 4,
            "title": "补签",
            "type": "二级菜单",
            "url": "/user/signagin"
          }, { "id": 43,
            "parentId": 4,
            "title": "请假",
            "type": "二级菜单",
            "url": "/user/ntahl"
          },
          { "id": 44,
            "parentId": 4,
            "title": "排班",
            "type": "二级菜单",
            "url": "/user/worksche"
          }]

        },
        { "id": 5,
          "parentId": null,
          "title": "考勤和薪资",
          "type": "一级菜单",
          "icon": "el-icon-watermelon",
          "lowerMenu": [
            { "id": 51,
              "parentId": 5,
              "title": "考勤记录",
              "type": "二级菜单",
              "url": "/user/sign"
            },
            { "id": 52,
              "parentId": 5,
              "title": "工资记录",
              "type": "二级菜单",
              "url": "/user/pay"
            }]

        },
        { "id": 6,
          "parentId": null,
          "title": "修改密码",
          "type": "二级菜单",
          "url": "/user/resetpass",
          "icon": "el-icon-edit"
        }]
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    },
    ...mapGetters(["menuList", "userid"])
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
  },
  mounted() {
    this.savetoStore();
  },
  methods: {
    // 查询菜单信息
    savetoStore() {
    //   getSideBarMenu({ id: this.userid }).then(res => {
    //     console.log('侧边栏菜单', res);
    //     // BUG:当切换用户登录时侧边栏菜单缓存未清除
    //     //! 将第一个顶级菜单作为默认的，同时查询对应的子菜单
    //     const menuList = res.data[1];

    //     this.setMenu({ menuList });
    //   })
      const menuList = this.mockdata
      this.setMenu({ menuList });
    },
    ...mapActions("menu/", ["setMenu"])
  }
}
</script>

<style lang='scss' scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 210px;
}
.sidebar > ul {
    height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 210px;
    min-height: 400px;
  }
</style>
