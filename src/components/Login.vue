<template>
  <body id="poster">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      class="login-container"
      label-position="left"
      label-width="75px"
    >
      <h3 class="login_title">系统登录</h3>
      <el-form-item :label="$t('login.username')" prop="userName">
        <el-input v-model="loginForm.userName" type="text" clearable auto-complete="off" placeholder="账号"/>
      </el-form-item>
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input v-model="loginForm.password " type="password" clearable auto-complete="off" placeholder="密码"/>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #505458;border: none" @click="userlogin">{{ $t('login.login') }}</el-button>
      </el-form-item>
    </el-form>
  </body>
</template>

<script>
import { mapActions } from "vuex";
import { login } from '@/api/login'
import { setToken } from '@/utils/token'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        userName: 'admin',
        password: 'admin'
      },
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: "blur" }],
        password: [{ required: true, message: '请输入密码', trigger: "blur" }]
      }
    }
  },
  methods: {
    // login () {
    //   var _this = this
    //   console.log(this.$store.state)
    //   this.$axios
    //     .post('/login', {
    //       userName: this.loginForm.userName,
    //       password: this.loginForm.password
    //     })
    //     .then(successResponse => {
    //       if (successResponse.data.code === 200) { // 后端返回状态码为200
    //         // var data = this.loginForm
    //         _this.$store.commit('login', _this.loginForm) // 触发store中的login()方法，把loginForm对象传递给store中的user对象
    //         var path = this.$route.query.redirect
    //         this.$router.replace({path: path === '/' || path === undefined ? '/index' : path}) // 获取登录前页面的路径并跳转，如果该路径不存在，则跳转到首页
    //       }
    //     })
    //     .catch(failResponse => {
    //     })
    // }
    userlogin () {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          const para = {
            username: this.loginForm.userName,
            password: this.loginForm.password
            // password: this.$sha1(this.loginForm.userName + this.loginForm.password)
          };
          login(para).then(res => {
            console.log(res)
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            this.relog(res)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 用户登陆成功后返回的数据
    relog (res) {
      const token = res.data.token;
      console.log(token)
      const userid = res.data.userInfo.userId;
      const uname = res.data.userInfo.username;
      const upass = res.data.userInfo.password;
      const imgurl = res.data.userInfo.imgurl;
      const menuList = res.data.menuInfo
      // const roles = res.data[0].roles.map(ele => { return ele.name });
      setToken(token); // sessionStorage.setItem(TokenKey, token) 本地存储token
      // 调用store/user.js 中action setUserdata方法，执行commit('USER_MUTATION'）
      this.setUserdata({ token, userid, uname, upass, imgurl });
      this.setMenu({ menuList })
      this.$router.replace('/home');
    },
    ...mapActions("user/", ["setUserdata"]),
    ...mapActions("menu/", ["setMenu"])
  }
}
</script>

<style>
  #poster {
    background:url("../assets/img/yellow.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0px;
  }
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

</style>
