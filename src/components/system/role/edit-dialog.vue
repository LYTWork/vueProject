<template>
  <el-dialog id="edit-dialog" :title="title" :visible.sync="visable" :lock-scroll="false" :close-on-click-modal="false" :show-close="false">
    <el-form ref="dataForm" :model="item" label-width="110px" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="item.name" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input v-model="item.weight" placeholder="请输入权重" />
      </el-form-item>
      <el-form-item label="组织架构节点">
        <el-input v-model="item.orgNode" placeholder="请输入组织架构节点" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel('dataForm')">取消</el-button>
      <el-button type="success" plain @click="confirm('dataForm')">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getFlagRName } from "@/api/role";
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (this.name === value) { // 没有修改名字
        callback()
      } else if (value == '') {
        callback(new Error('请输入角色名'))
      } else {
        getFlagRName({ name: value }).then(res => {
          if (res.data) {
            callback(new Error('角色名已存在，若已删除可进行恢复'))
          } else {
            callback()
          }
        });
      }
    }
    return {
      item: {},
      visable: false,
      timeout: null,
      name: '',
      rules: {
        name: [{ required: true, trigger: "blur", validator: validateName }],
        weight: [{ required: true, message: "请填写权重", trigger: "blur" }],
        orgNode: [{ required: true, message: "", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 对外暴露的接口,item用来接收当前修改的对象
    open(item) {
      this.visable = true;
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
            this.cancel('dataForm')
          }).catch(() => { return false });
        } else {
          return false
        }
      })
    },
    cancel(dataForm) {
      this.visable = false;
      this.$refs[dataForm].resetFields();
    }
  }
};
</script>
<style style="scss">
</style>
