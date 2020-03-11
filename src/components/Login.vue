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
        <el-input type="text" v-model="loginForm.userName" clearable auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input type="password" v-model="loginForm.password " clearable auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item :label="$t('login.type')" prop="type">
        <el-select
            ref="selection"
            v-model="loginForm.type"
            placeholder="请选择类型"
            clearable
            style="width:275px"
          >
            <el-option
              v-for="item in userType"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #505458;border: none" @click="userlogin">{{$t('login.login')}}</el-button>
      </el-form-item>
    </el-form>
  </body>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { login } from '@/api/login'
import { setToken } from '@/utils/token'
  export default {
    name: 'Login',
    data () {
      return {
        loginForm: {
          userName: 'admin',
          password: '987654321',
          type: '公司'
        },
        // 用户类型
        userType: [{
          value: '公司',
          label: '公司'
        }, {
          value: '客户',
          label: '客户'
        }, {
          value: '供应商',
          label: '供应商'
        }],
        rules: {
          userName: [{ required: true, message: '请输入用户名', trigger: "blur" }],
          password: [{ required: true, message: '请输入密码', trigger: "blur" }],
          type: [{ required: true, message: '请选择类型', trigger: "change" }]
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
              userName: this.loginForm.userName,
              password: this.$sha1(this.loginForm.userName + this.loginForm.password),
              type: this.loginForm.type
            };
            login(para).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '登录成功',
                  type: 'success'
                });
                this.relog(res)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
    },
    // 用户登陆成功后返回的数据
    relog (res) {
      const token = res.data[1];
      const userid = res.data[0].id
      const uname = res.data[0].userName;
      const utype = res.data[0].type;
      const imageUrl = res.data[0].imageUrl;
      const roles = res.data[0].roles.map(ele => { return ele.name });
      setToken(token); // sessionStorage.setItem(TokenKey, token) 本地存储token
      // 调用store/user.js 中action setUserdata方法，执行commit('USER_MUTATION'）
      this.setUserdata({ token, userid, uname, utype, imageUrl, roles });
      this.$router.replace('/home');
    },
    ...mapActions("user/", ["setUserdata"])
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