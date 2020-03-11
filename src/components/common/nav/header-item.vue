<template>
  <div class="header-item">
    <div ref="role" title="用户" :class="istoggle.toggle[0]==true?'clickStyle':''" @click="toggle(0)">
      <i class="el-icon-user-solid" />
      <!-- 点击弹出框 -->
      <div :class="istoggle.toggle[0]==true?'clickShow':''">
        <div>
          <el-avatar :src="imageUrl" alt="加载中..." :size="55" :style="{'color':`${themeColor}`}" />"
          <!-- <img :src="imageUrl" min-width="60" height="60"> -->
          <!-- <img src="../../../../public/test1.png" min-width="60" height="60"> -->
          <ul>
            <li>类型：{{ usertype }}</li>
            <li>用户名：{{ username }}</li>
            <!-- <li>用户资料：{{ imageUrl }}</li> -->
            <li style="color:#4f94a5;"><router-link to="/user/resetpass">修改密码</router-link></li>

          </ul>
        </div>
        <div :class="istoggle.toggle[0]==true?'clickShow':''" :style="{'background':`${themeColor}`}" @click.stop="userlogout">
          <p style="margin-left:6.5rem">退出登录</p>
        </div>
      </div>
    </div>
    <div ref="language" title="语言" :class="istoggle.toggle[2]==true?'clickLanguage':''" @click="toggle(2)">
      <i class="el-icon-picture-outline-round" />
      <div :class="istoggle.toggle[2]==true?'clickShow':''">
        <el-radio v-model="radio1" label="zh" size="small" fill="#ffffff" :style="{'background':`${themeColor}`}" @change="changes('zh')">中文</el-radio>
        <el-radio v-model="radio1" label="en" size="small" fill="#ffffff" :style="{'background':`${themeColor}`}" @change="changes('en')">English</el-radio>
        <el-radio v-model="radio1" label="ko" size="small" fill="#ffffff" :style="{'background':`${themeColor}`}" @change="changes('ko')">한글</el-radio>
      </div>
    </div>
    <!-- <div ref="message" title="消息">
      <SvgIcon icon-class="laba" />
      <span class="count" :class="count !=0 ? 'count':''" @click.stop="$refs.updateDialog.open(focusedRecord,addForm)">{{ count }}</span>
    </div> -->
    <!-- <add-dialog ref="updateDialog" :title="$t('exccard.dialog.title')" @OnConfirm="(item)=>addOne(item,'post')" /> -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { removeToken } from '@/utils/token';
import { logout } from '@/api/login'
export default {
  data() {
    return {
      // imageUrl: './test2.png',
      istoggle: { open: false, toggle: [false, false, false] },
      radio1: '1',
      radio2: '1',
      count: 0,
      focusedRecord: {},
      state: false,
      addForm: {}
    }
  },
  computed: {
    isLogin() {
      if (this.$isEmpty(this.token)) {
        return false;
      }
      return true;
    },
    ...mapGetters(["token", "themeColor", "username", "usertype", "imageUrl", "userid"])
  },
  mounted() {
    var _this = this;
    document.addEventListener('click', function(e) {
      if ((!_this.$refs.role.contains(e.target)) && (!_this.$refs.theme.contains(e.target)) && (!_this.$refs.language.contains(e.target))) {
        _this.istoggle.open = false
        _this.istoggle.toggle = [false, false, false]
      }
    });
    this.getLocalStorageData();
  },
  methods: {
    // 选择语言切换
    changes(e) {
      switch (e) {
        case 'en':
          this.$i18n.locale = 'en';
          localStorage.setItem('locale', 'en');
          break;
        case 'ko':
          this.$i18n.locale = 'ko';
          localStorage.setItem('locale', 'ko');
          break;
        default:
          this.$i18n.locale = 'zh';
          localStorage.setItem('locale', 'zh');
      }
    },
    // 自定义页头
    toggle(value) {
      if (this.istoggle.open === false) {
        this.istoggle.open = true
        this.istoggle.toggle = [false, false, false]
        this.istoggle.toggle[value] = true
      } else {
        this.istoggle.open = false
        this.istoggle.toggle = [false, false, false]
      }
    },
    userlogout() {
      // 退出登录接口
      logout({ uid: this.userid }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '已退出登录',
            type: 'warning'
          })
          this.setUserdata("");
          // 退出登录时将sessionStorage里的token和store里面的角色都清零
          removeToken();
          this.resetToken();
          sessionStorage.removeItem("store");
          this.$router.replace("/login");
        }
      })
    },
    getLocalStorageData() {
      // console.log('enter getFormData');
      // this.count = JSON.parse(localStorage.getItem("submitCount"));
      // this.focusedRecord = JSON.parse(localStorage.getItem("formData"));
      // this.state = JSON.parse(localStorage.getItem("isDisabled"));
      // console.log(JSON.parse(localStorage.getItem("isDisabled")));//false
      // console.log(JSON.parse(localStorage.getItem("formData")));//
      // console.log(JSON.parse(localStorage.getItem("submitCount")));//1
    },
    addOne(data, method) {
      // console.log(data, method);
      // this.recordList.push(data)
      // 发送添加请求
    },
    ...mapActions("user/", ["setUserdata", "resetToken"])
  }
}
</script>