<template>
  <el-dialog id="edit-dialog" :title="title" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false" width="30%">
    <el-form ref="dataForm" :model="item" :rules="rules" label-width="100px">
      <el-form-item label="职位名称" prop="name">
        <el-input v-model="item.name" />
      </el-form-item>
      <!-- <el-form-item label="职位代码" prop="code">
        <el-input v-model="item.code" />
      </el-form-item> -->
      <el-form-item label="所属部门" prop="belong">
        <el-select v-model="item.belong" placeholder="请选择所属部门">
          <el-option v-for="(ele,index) of deptlist" :key="index" :label="ele.name" :value="ele.name" />
        </el-select>
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
    },
    deptlist: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      item: {},
      visible: false,
      rules: {
        name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
        // code: [{ required: true, message: '请输入职位代码', trigger: 'blur' }],
        belong: [{ required: true, message: '请输选择所属部门', trigger: 'change' }]
      }
    }
  },
  methods: {
    open (item, data) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {};
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
      this.visible = false;
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
