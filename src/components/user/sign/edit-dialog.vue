<template>
  <el-dialog id="sigin-dialog" :title="title" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false" width="30%">
    <el-form ref="dataForm" :model="item" :rules="rules" label-width="110px">
      <el-form-item label="原始状态">
        <el-input v-model="item.status" disabled />
      </el-form-item>
      <el-form-item label="更改状态" prop="status">
        <el-select
          v-model="newStatus"
          placeholder="请选择"
          class="changeStatus">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="newStatus == '补打卡'" label="补打卡">
        <el-time-picker
          v-model="patchTime"
          is-range
          range-separator="～"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择打卡时间"
          format="HH:mm"
          value-format="HH:mm"/>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button type="warning" plain @click="cancel('dataForm')">取消</el-button>
      <el-button type="success" plain @click="confirm('dataForm')">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    }
  },
  data() {
    return {
      item: {},
      visible: false,
      newStatus: '',
      // 状态选择器内备选项
      statusOptions: [{
        value: '补打卡',
        label: '补打卡'
      }, {
        value: '请假',
        label: '请假'
      }],
      rules: {
        status: [{ required: true, message: "请数入", trigger: "blur" }]
      }
    }
  },
  methods: {
    // 对外暴露的接口
    open (item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {}
      } else {
        this.item = item
        this.newStatus = ''
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
            this.item.status = this.newStatus;
            this.$emit("OnConfirm", this.item);
            this.cancel('dataForm')
          }).catch(() => { return false });
        } else {
          return false
        }
      })
    },
    cancel(dataForm) {
      this.visible = false;
      // this.newStatus = ''
      // this.$refs[dataForm].resetFields();
    }
  }
}
</script>
