<template>
  <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
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
    name: 'NavMenu',
    data () {
      return {
        collapse: false,
            items: [
                {
                    icon: 'el-icon-user',
                    index: '/welcom',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-user',
                    index: 'tabs',
                    title: 'tab选项卡'
                },
                {
                    icon: 'el-icon-user',
                    index: '3',
                    title: '系统管理',
                    subs: [
                        {
                            index: '/admin/staff',
                            title: '员工信息'
                        },
                        {
                            index: '/admin/holiday',
                            title: '假种管理',
                        },
                        {
                            index: '/admin/dept',
                            title: '部门管理'
                        }
                    ]
                },
                {
                    index: 'charts',
                    title: 'schart图表'
                },
                {
                    icon: 'el-icon-user',
                    index: 'i18n',
                    title: '国际化功能'
                },
                {
                    icon: 'el-icon-user',
                    index: '7',
                    title: '错误处理',
                    subs: [
                        {
                            index: '/403',
                            title: '权限测试'
                        },
                        {
                            index: '/404',
                            title: '404页面'
                        }
                    ]
                },
                {
                    icon: 'el-icon-edit',
                    index: '/user/resetpass',
                    title: '修改密码'
                }
            ]
      }
    },
    computed: {
      onRoutes() {
            return this.$route.path.replace('/', '');
        },
      ...mapGetters([ "themeColor", "typeList", "menuList", "userid"])
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    },
    methods: {
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
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
    min-height: 400px;
  }
</style>
