<template>
  <el-dialog id="edit-dialog" :title="title" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false" width="35%">
    <el-form ref="dataForm" :model="item" :rules="rules" label-width="150px">
      <el-form-item label="班别名称" prop="name">
        <el-input v-model="item.name" />
      </el-form-item>
      <el-form-item label="班别代码" prop="code">
        <el-input v-model="item.code" />
      </el-form-item>
      <el-form-item label="时段" required>
        <el-col :span="8">
          <el-form-item prop="start_time">
            <el-time-picker
              v-model="item.start_time"
              :picker-options="{
                selectableRange: '00:01:00 - 23:59:00'
              }"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="开始时间"
              @blur="getTimeDiff"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1">至</el-col>
        <el-col :span="8">
          <el-form-item prop="end_time">
            <el-time-picker
              v-model="item.end_time"
              :picker-options="{
                selectableRange: '00:01:00 - 23:59:00'
              }"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="结束时间"
              @blur="getTimeDiff"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="时长(单位:小时)">
        <el-input v-model="item.worktime" disabled />
      </el-form-item>
      <el-form-item label="是否跨天">
        <el-input v-model="isover" disabled />
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
      visible: false,
      isover: '否',
      rules: {
        name: [{ required: true, message: '请输入班别名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入班别代码', trigger: 'blur' }],
        start_time: [{ required: true, message: '请输入班别代码', trigger: 'change' }],
        end_time: [{ required: true, message: '请输入班别代码', trigger: 'change' }]
      }
    }
  },
  methods: {
    open (item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {};
      } else {
        this.item = item;
        this.getTimeDiff()
      }
    },

    /**
     * @function 计算时间差
     * @start_time 开始时间
     * @end_time 结束时间
     * @format 输出格式，默认 剩余DD天hh时mm分ss秒SSSS毫秒
     */
    getTimeDiff () {
      const start_time = this.item.start_time || new Date()
      const end_time = this.item.end_time || new Date()
      var hours;
      if (this.item.start_time && this.item.end_time) {
      // Method1
        var time = start_time + ':' + end_time;
        var timeArr = time.split(':'); // ["10", "10", "15", "15"]
        console.log(timeArr)
        hours = Number(timeArr[2]) - Number(timeArr[0]) + (Number(timeArr[3]) - Number(timeArr[1])) / 60;
        console.log(hours);
        // 跨天
        if (hours <= 0) {
          hours = Number(24) - Math.abs(hours)
          this.isover = '是'
        } else { this.isover = '否' }
        this.$set(this.item, 'worktime', hours.toFixed(1))
      }
    },
    confirm(dataForm) {
      this.$refs[dataForm].validate(valid => {
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
      this.isover = '';
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
