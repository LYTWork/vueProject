<template>
  <el-dialog id="edit-dialog" :title="title" :visible.sync="visable" :lock-scroll="false" width="30%" :show-close="false" :close-on-click-modal="false">
    <el-form ref="dataForm" :model="item" label-width="100px" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="item.name" />
      </el-form-item>
      <el-form-item label="部门代码" prop="code">
        <el-input v-model="item.code" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel('dataForm')">{{ $t("button.cancel") }}</el-button>
      <el-button type="success" plain @click="confirm('dataForm')">{{ $t("button.confirm") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    return {
      item: {},
      visable: false,
      value1: '',
      radio: '',
      name: '',
      code: '',
      dep: [],
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入部门代码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open (item, data) {
      this.visable = true;
      if (item === undefined || item === null) {
        this.item = {};
        this.item.dep = "成都路维"
      } else {
        this.item = item;
      }
    },
    confirm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "询问", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            lockScroll: false,
            type: "warning",
            closeOnClickModal: false
          }).then(() => {
            this.$emit("OnConfirm", this.item);
            this.cancel('dataForm')
          }).catch(() => { false });
        }
      })
    },
  cancel(dataForm) {
      this.$refs[dataForm].resetFields();
      this.visable = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.el-date-editor,.el-select{
  width:185px!important
}
.el-form-item{
  text-align:left
}
</style>
