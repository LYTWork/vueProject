<template>
  <el-dialog id="edit-dialog" :title="title" :visible.sync="visible" :lock-scroll="false" :close-on-click-modal="false" :show-close="false">
    <el-form ref="dataForm" :model="item" :rules="rules" label-width="110px">
      <el-form-item label="角色名称" prop="rolename">
        <el-input v-model="item.rolename" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="item.roleDesc" placeholder="请对角色进行描述" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel('dataForm')">取消</el-button>
      <el-button type="success" plain @click="confirm('dataForm')">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
// import { getFlagRName } from "@/api/role";
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    // const validateName = (rule, value, callback) => {
    //   if (this.name === value) { // 没有修改名字
    //     callback()
    //   } else {
    //     getFlagRName({ name: value }).then(res => {
    //       if (res.data) {
    //         callback(new Error('角色名已存在'))
    //       } else {
    //         callback()
    //       }
    //     });
    //   }
    // }
    return {
      item: {},
      visible: false,
      rules: {
        rloename: [{ required: true, trigger: "blur", message: "请输入角色名" }],
        roledesc: [{ required: true, trigger: "blur", message: "可对该角色进行描述" }]
      }
    };
  },
  methods: {
    // 对外暴露的接口,item用来接收当前修改的对象
    open(item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {};
      } else {
        this.item = item
      }
    },
    confirm(dataForm) {
      this.$refs[dataForm].validate(vali => {
        if (vali) {
          this.$confirm("确认保存吗？", "询问", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
            type: "warning",
            lockScroll: false,
            closeOnClickModal: false
          }).then(() => {
            // this.item.name = this.name;
            this.$emit("OnConfirm", this.item);
            this.visible = false
          }).catch(() => { return false });
        } else {
          return false
        }
      })
    },
    cancel(dataForm) {
      this.visible = false;
      this.$refs[dataForm].resetFields();
    }
  }
};
</script>
<style style="scss">
</style>
