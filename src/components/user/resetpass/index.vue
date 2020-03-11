<template>
  <div id="resetpass">
    <div class="container">
      <el-form
        ref="dataForm"
        :model="item"
        :rules="rules"
        class="pass-form"
        label-width="100px"
        >
        <el-form-item label="原密码:" prop="pass">
          <el-input
            v-model="item.pass"
            prefix-icon="el-icon-lock"
            placeholder="若包含字母，请注意区分大小写"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码:" prop="newpass">
          <el-input
            v-model="item.newpass"
            prefix-icon="el-icon-lock"
            placeholder="密码有8-16位,至少含数字/字母/字符2种组合"
            show-password
          />
        </el-form-item>
        <el-form-item label="重复新密码:" prop="checknewpass">
          <el-input
            v-model="item.checknewpass"
            prefix-icon="el-icon-lock"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            style="margin:auto;width:40%;font-size:1.1rem;display:block"
            type="primary"
            @click="submitForm('dataForm')"
          >提交</el-button>
          
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

 <script>
import { mapGetters, mapActions } from "vuex";
import { removeToken } from "@/utils/token";
import { logout } from "@/api/login";
import { resetPass, getFlagUserPwd } from "@/api/sysuser";

export default {
  components: {},
  data() {
    // 验证原密码
    const validatePass = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback("请输入原密码");
      } else {
        const param = {
          id: this.userid,
          oldPwd: this.$sha1(value)
        };
        getFlagUserPwd(param).then(res => {
          if (res.data) {
            callback();
          } else {
            callback(new Error("输入密码有误，请重新输入"));
          }
        });
      }
    };
    // 密码包含 数字,英文,字符中的两种以上，长度6-16
    const validateNewPass = (rule, value, callback) => {
      var reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,16}$/;
      if (value.length < 6 || value.length > 18) {
        callback(new Error("密码8-16位"));
      } else if (reg.test(value)) {
        callback();
        if (
          this.item.checknewpass !== "" &&
          this.item.checknewpass !== undefined
        ) {
          this.$refs["dataForm"].validateField("checknewpass");
        }
      } else {
        callback(new Error("至少含数字/字母/字符2种组合"));
      }
    };
    // 验证新密码与重复新密码一致
    const validateCheack = (rule, value, callback) => {
      if (value !== this.item.newpass) {
        callback("与新密码不一致");
      } else {
        callback();
      }
    };

    return {
      item: {},
      // 验证规则
      rules: {
        pass: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        newpass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validateNewPass, trigger: "blur" }
          ],
        checknewpass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validateCheack, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "username",
      "usertype",
      "imageUrl",
      "userid",
      "userpassword"
    ])
  },
  methods: {
    submitForm(dataForm) {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "询问", {
            confirmButtonText: "提交",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.updatePass();
            this.userlogout();
          }).catch(() => {
            console.log("cancel");
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    updatePass() {
      // 发送请求
      // 修改密码 /sys/user/updateUserPwd?id=21&password=""
      const pwd = this.$sha1(this.item.newpass);
      const uid = this.userid;
      resetPass(uid, pwd).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.userlogout(); // 密码修改成功后强制退出登录
        } else {
          this.$message({
            message: "提交失败，原因：" + res.msg,
            type: "danger"
          });
        }
      });
    },
    userlogout() {
      // 退出登录接口
      logout({ uid: this.userid }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "已退出登录",
            type: "warning"
          });
          this.setUserdata("");
          // 退出登录时将sessionStorage里的token和store里面的角色都清零
          removeToken();
          this.resetToken();
          sessionStorage.removeItem("store");
          this.$router.replace("/login");
        }
      });
    },
    ...mapActions("user/", ["setUserdata", "resetToken"])
  }
};
 </script>

<style lang="scss" scoped>
.pass-form {
  width: 30rem;
  min-width: 20rem;
  margin: 6rem auto;
}
#resetpass {
  .el-form-item {
    margin-bottom: 30px !important;
  }
}
</style>
