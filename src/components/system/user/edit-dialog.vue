<template>
  <el-dialog
    id="user-dialog"
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :lock-scroll="false"
  >
    <el-form ref="dataForm" :model="item" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="item.username"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="员工id" prop="staffId">
        <el-input
          v-model.number="item.staffId"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="头像" prop="imgurl">
        <el-upload
          :data="uptoken"
          :show-file-list="false"
          :on-change="onchange"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <img v-if="item.imgurl" :src="item.imgurl" class="avatar" >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel('dataForm')">取消</el-button>
      <el-button type="success" plain @click="confirm('dataForm')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { parseTime } from "@/utils/index.js";
// import { getUnameFlag } from "@/api/user"
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    // const validateName = (rule, value, callback) => {
    //   if (this.name === value) {
    //     // 没有修改名字
    //     callback();
    //   } else {
    //     getUnameFlag({ name: value }).then(res => {
    //       if (res.data) {
    //         callback(new Error("用户名已存在"));
    //       } else {
    //         callback();
    //       }
    //     });
    //   }
    // };
    return {
      item: {},
      visible: false,
      uptoken: {
        token: "",
        key: ""
      },
      rules: {
        username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
        staffId: [{ required: true, type: "number", trigger: "blur", message: "请输入员工id" }]
      }
    };
  },
  methods: {
    // 对外暴露的接口,item用来接收当前修改的对象
    open(item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {}
      } else {
        this.item = item
      }
    },
    handleAvatarSuccess(res, file) {
      this.$set(this.item, "imgurl", URL.createObjectURL(file.raw));
    },
    // 检测选择的图片是否合适
    beforeAvatarUpload(file) {
      this.uptoken.key = file.name;
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        // 如果不是jpg，也不是png的时候就弹出这条信息
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG || (isPNG && isLt2M);
    },
    // 当上传图片后，调用onchange方法，获取图片本地路径
    onchange(file) {},

    confirm(dataForm) {
      this.$refs[dataForm].validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "询问", {
            cancelButtonText: "取消",
            confirmButtonText: "确认", // 点击确认按钮之后会触发.then()
            type: "warning",
            lockScroll: "false",
            closeOnClickModal: "false"
          })
            .then(() => {
              // this.item.name = this.name;
              this.$emit("OnConfirm", this.item); // 子组件可以使用 $emit 触发父组件的自定义事件,这里是OnConfirm事件
              this.visible = false;
            })
            .catch(() => {
              console.log("cancel");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel(dataForm) {
      this.$refs[dataForm].resetFields();
      this.visible = false;
    }
  }
};
</script>

<style lang="scss">
#edit-dialog {
  text-align: left;
  padding: 1rem;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: left;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
