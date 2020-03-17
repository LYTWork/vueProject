<template>
  <el-dialog
    id="menu-dialog"
    :title="title"
    :visible.sync="visable"
    :lock-scroll="false"
    :show-close="false"
    :close-on-click-modal="false"
    width="40%"
  >
    <el-form
      ref="editForm"
      :model="item"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="父亲节点" prop="parentId">
        <el-cascader
          :value="item.parentId"
          :options="menuTree"
          :props="cascaderProps"
          @change="parentChanged"
        />
      </el-form-item>

      <el-form-item label="菜单类型" prop="type">
        <el-select v-model="item.type">
          <el-option :value="1" label="一级菜单" />
          <el-option :value="2" label="二级菜单" />
        </el-select>
      </el-form-item>

      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="item.title" />
      </el-form-item>

      <el-form-item label="菜单图标" prop="icon">
        <el-select v-model="item.icon">
          <el-option
            v-for="ele in icon"
            :key="ele.value"
            :label="ele.label"
            :value="ele.value"
          >
            <span style="float: left">{{ ele.label }}</span>
            <i :class="ele.value" style="float:right;line-height:34px" />
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :rules="{required: item.type === 2?true:false, message: '请填写链接路径', trigger: 'blur' }" label="链接路径" prop="url">
        <el-input v-model="item.url" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="warning" plain @click="cancel('editForm')">取消</el-button>
      <el-button type="success" plain @click="confirm('editForm')">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    menuTree: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: "title"
    }
  },
  data () {
    return {
      cascaderProps: {
        children: "lowerMenu",
        value: "id",
        label: "title",
        checkStrictly: "true",
        expandTrigger: "hover"
      },
      item: {},
      visable: false,
      rules: {
        title: [{ required: true, message: "请填写名字", trigger: "blur" }],
        parentId: [{ required: false, message: "请选择父节点", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        icon: [{ required: false, message: "请填写图标", trigger: "blur" }]
      },
      icon: [
        { label: "el-icon-orange", value: "el-icon-orange" },
        { label: "el-icon-pear", value: "el-icon-pear" },
        { label: "el-icon-grape", value: "el-icon-grape" },
        { label: "el-icon-watermelon", value: "el-icon-watermelon" },
        { label: "el-icon-cherry", value: "el-icon-cherry" },
        { label: "el-icon-apple", value: "el-icon-apple" }
      ]
    };
  },
  methods: {
    // 对外暴露的接口
    open (item) {
      this.visable = true;
      if (item === undefined || item === null || item === {}) {
        this.item = {};
      } else {
        this.item = item
        console.log(this.item);
        // this.$set(this.item, 'parentId', data.id); // 插入子节点
      }
    },
    parentChanged (value) {
      if (value !== undefined) {
        this.item.parentId = value[value.length - 1];
      }
    },
    confirm (dataForm) {
      this.$refs[dataForm].validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "询问", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
            type: "warning",
            lockScroll: false,
            closeOnClickModal: false
          }).then(() => {
            this.$emit("OnConfirm", this.item);
            this.cancel('dataForm')
          })
        }
      })
    },
    cancel(dataForm) {
      this.$refs[dataForm].resetFields();
      this.$set(this.item, 'parentId', '')
      this.visable = false;
    }
  }
};
</script>
<style lang="scss">
  #menu-dialog{
    .el-form-item__content {
      width: 80%;
    }
    .el-select{
      width:100%!important
    }
  }
</style>
