<template>
  <el-dialog
    id="holiday-dialog"
    :title="title"
    width="35%"
    :visible.sync="visable"
    :close-on-click-modal="false"
    :show-close="false"
    :lock-scroll="false"
    @close="resetForm('dataForm')"
  >
    <el-form ref="dataForm" :model="item" :rules="rules" label-width="100px">
      <el-form-item label="假种" prop="name">
        <el-input v-model="item.name" v-filter-special-char="item.name" placeholder="请输入假种" />
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="item.code" placeholder="请输入代码" />
      </el-form-item>
      <el-form-item label="请假上限" prop="standday">
        <el-input v-model.number="item.standday" placeholder="请输入数字" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button type="warning" plain @click="resetForm('dataForm')">{{ $t("button.cancel") }}</el-button>
      <el-button type="success" plain @click="submitForm('dataForm')">{{ $t("button.confirm") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getholidayadd, getholidaybyid } from '@/api/holiday';
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    return {
      visable: false, // 对话框显示或隐藏
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
      this.visable = true;
      if (item === undefined || item === null) { // 新增
        this.getholidayadd();
      } else { // 修改
        this.getholidaybyid(item.id);
      }
    },
    getholidayadd() {
      getholidayadd().then(res => {
        console.log(res)
        this.item.name = res.data.name;
        this.item.code = res.data.code;
        this.item.standday = res.data.standday;
      })
    },
    getholidaybyid(id) {
      getholidaybyid(id).then(res => {
        console.log(res)
        this.item.id = res.data.id;
        this.item.name = res.data.name;
        this.item.code = res.data.code;
        this.item.standday = res.data.standday;
      })
    },
    submitForm(dataForm) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认保存吗？", "询问", {
            cancelButtonText: "取消",
            confirmButtonText: "确认", // 点击确认按钮之后会触发.then()
            lockScroll: false,
            name: "warning"
          }).then(() => {
            this.$emit("OnConfirm", this.item);// 子组件可以使用 $emit 触发父组件的自定义事件,这里是OnConfirm事件
            this.resetForm('dataForm') // 关闭dialog弹窗后重置form，不能在这里重置，函数执行完之后才把数据添加的父元素table中
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(dataForm) {
      this.$nextTick(() => {
        this.$refs[dataForm].clearValidate();
      })
      this.visable = false;
    }
  }
}
</script>
