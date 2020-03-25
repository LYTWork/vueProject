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
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="item.name"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
      <section>
        <img v-if="!progressFlag" :src="imageUrl" class="head-img" >
        <div v-show="progressFlag" class="head-img">
          <el-progress :percentage="progressPercent" type="circle"/>
        </div>
        <el-upload
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadImg"
          class="img-btn"
          action="#">
        <el-button type="success" plain round size="mini">更改头像</el-button></el-upload>
      </section>
      <!-- <el-form-item label="头像" prop="imageUrl">
            <el-upload
              :data="uptoken"
              :show-file-list="false"
              :on-change="onchange"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
            >
              <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item> -->
    </el-form>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel('dataForm')">取消</el-button>
      <el-button type="success" plain @click="confirm('dataForm')">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { parseTime } from "@/utils/index.js";
import { getUnameFlag } from "@/api/sysuser"
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (this.name === value) {
        // 没有修改名字
        callback();
      } else {
        getUnameFlag({ name: value }).then(res => {
          if (res.data) {
            callback(new Error("用户名已存在"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      progressFlag: false,
      progressPercent: 0,
      item: {},
      visible: false,
      name: "",
      uptoken: {
        token: "",
        key: ""
      },
      rules: {
        name: [{ required: true, trigger: "blur", message: "请输入用户名" },
          { trigger: "blur", validator: validateName }]
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
    uploadImg (f) {
      console.log(f)
      this.progressFlag = true
      const formdata = new FormData()
      formdata.append('image', f.file)
      // axios({
      //   url: 'tast' + '/image',
      //   method: 'post',
      //   data: formdata,
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   onUploadProgress: progressEvent => {
      //     // progressEvent.loaded:已上传文件大小
      //     // progressEvent.total:被上传文件的总大小
      //     this.progressPercent = (progressEvent.loaded / progressEvent.total * 100)
      //   }
      // }).then(res => {
      //   this.imageUrl = res.data.data
      //   if (this.progressPercent === 100) {
      //     this.progressFlag = false
      //     this.progressPercent = 0
      //   }
      // }).then(error => {
      //   console.log(error)
      // })
    },
    // 上传图片前的过滤
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = (file.size / 1024 / 1024) < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.$set(this.item, "imageUrl", URL.createObjectURL(file.raw));
    },
    // 检测选择的图片是否合适
    // beforeAvatarUpload(file) {
    //   this.uptoken.key = file.name;
    //   const isJPG = file.type === "image/jpeg";
    //   const isPNG = file.type === "image/png";
    //   const isLt2M = file.size / 1024 / 1024 < 2;

    //   if (!isJPG && !isPNG) {
    //     // 如果不是jpg，也不是png的时候就弹出这条信息
    //     this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传头像图片大小不能超过 2MB!");
    //   }
    //   return isJPG || (isPNG && isLt2M);
    // },
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
              this.item.name = this.name;
              this.$emit("OnConfirm", this.item); // 子组件可以使用 $emit 触发父组件的自定义事件,这里是OnConfirm事件
              this.cancel("dataForm");
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
  width: 80px;
  height: 80px;
  display: block;
}
</style>
