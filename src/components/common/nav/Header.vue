<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"/>
      <i v-else class="el-icon-s-unfold"/>
    </div>
    <div class="logo">Orange后台管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip :content="fullscreen?`取消全屏`:`全屏`" effect="dark" placement="bottom">
            <i class="el-icon-rank"/>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip
            :content="message?`有${message}条未读消息`:`消息中心`"
            effect="dark"
            placement="bottom"
          >
            <router-link to="/user/message">
              <i class="el-icon-bell"/>
            </router-link>
          </el-tooltip>
          <span v-if="message" class="btn-bell-badge"/>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img v-if="token" src="@/assets/img/candy.jpg" >
          <img v-else src="@/assets/img/noimg.jpg" >
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changes">{{ $t('header.change') }}</el-dropdown-item>
            <el-dropdown-item v-if="token" divided command="loginout">{{ $t('header.logout') }}</el-dropdown-item>
            <el-dropdown-item v-else divided command="login">{{ $t('header.login') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from '@/utils/bus';
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: 'linxin',
      message: 2
    };
  },
  computed: {
    ...mapGetters(["token", "username", "userpassword", "imgurl", "userid"]),
    cheackusername() {
      // eslint-disable-next-line no-undef
      console.log(username)
      // eslint-disable-next-line no-undef
      return username || this.name;
    }
  },
  mounted() {
    if (document.body.clientWidth < 1366) {
      this.collapseChage();
    }
  },
  methods: {
    ...mapActions("user/", ["setUserdata", "resetToken"]),
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === 'loginout') {
        localStorage.removeItem('ms_username');
        this.$router.push('/login');
        // userlogout() {
        //   // 退出登录接口
        //   logout({ uid: this.userid }).then(res => {
        //     if (res.code === 200) {
        //       this.$message({
        //         message: '已退出登录',
        //         type: 'warning'
        //       })
        //       this.setUserdata("");
        //       // 退出登录时将sessionStorage里的token和store里面的角色都清零
        //       removeToken();
        //       this.resetToken();
        //       sessionStorage.removeItem("store");
        //       this.$router.replace("/login");
        //     }
        //   })
        // },
      } else if (command === 'changes') {
        // 选择语言切换
        this.$i18n.locale = this.$i18n.locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh';
        localStorage.setItem('locale', this.$i18n.locale);
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      const element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  }
};
</script>
<style lang='scss' scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 230px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
