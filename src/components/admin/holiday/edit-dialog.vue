<template>
  <el-dialog
    id="holiday-dialog"
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :lock-scroll="false"
    width="35%"
  >
    <el-form ref="dataForm" :model="item" :rules="rules" label-width="100px">
      <el-form-item label="假种" prop="name">
        <el-input v-model="item.name" placeholder="请输入假种" />
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="item.code" placeholder="请输入代码" />
      </el-form-item>
      <el-form-item label="请假上限" prop="standday">
        <el-input v-model.number="item.standday" placeholder="请输入数字" />
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
      visible: false, // 对话框显示或隐藏
      item: {
        name: '',
        code: '',
        standday: ''
      },
      rules: {
        name: [{ required: true, message: '请输入假种', trigger: 'blur' }],
        code: [{ required: true, message: '请输入代码', trigger: 'blur' }],
        standday: [{ required: true, type: 'number', message: '请输入数字', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open(item) { // item用来接收当前修改的对象
      this.visible = true;
      if (item === undefined || item === null) { // 新增
        this.item = {}
      } else { // 修改
        this.item = item;
      }
    },
    confirm(dataForm) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认保存吗？", "询问", {
            cancelButtonText: "取消",
            confirmButtonText: "确认", // 点击确认按钮之后会触发.then()
            lockScroll: false,
            name: "warning"
          }).then(() => {
            this.$emit("OnConfirm", this.item);// 子组件可以使用 $emit 触发父组件的自定义事件,这里是OnConfirm事件
            this.cancel('dataForm') // 关闭dialog弹窗后重置form，不能在这里重置，函数执行完之后才把数据添加的父元素table中
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel(dataForm) {
      this.$refs[dataForm].resetFields();
      this.visible = false;
    }
  }
}
</script>
