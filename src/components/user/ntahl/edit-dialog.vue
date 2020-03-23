<template>
  <el-dialog id="ntahl-dialog" :title="title" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false" width="70%">
    <el-form ref="dataForm" :model="item" :inline="true" :rules="rules" align="center">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="name"
          placeholder="点击查找员工信息"
          prefix-icon="el-icon-user"
          @focus="$refs.detailDialog.open(null)"
        />

      </el-form-item>
      <el-form-item label="所属部门" prop="dep">
        <el-input
          v-model="dep"
          :disabled="true"
          prefix-icon="el-icon-folder-opened"
        />
      </el-form-item>
      <el-form-item label="填表日期" prop="docDate" label-width="90px">
        <el-input
          v-model="item.docDate"
          :disabled="true"
          prefix-icon="el-icon-date"
        />
      </el-form-item>
    </el-form>
    <el-form ref="dataForm2" :model="item" :inline="true" :rules="rules" align="center">
      <el-form-item label="请假时间" prop="date" label-width="95px">
        <el-date-picker
          v-model="item.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          @change="handleDateChange"
        />
      </el-form-item>
      <el-form-item label="请假时长" prop="leaveTime" label-width="95px">
        <el-input
          v-model="item.leaveTime"
          disabled
          placeholder="请输入请假时长"
          prefix-icon="el-icon-timer"
        />
      </el-form-item>
    </el-form>
    <el-form ref="reasonForm" :model="item" :rules="rules" label-width="95px">
      <el-form-item label="请假类型" prop="holitype">
        <el-radio-group v-model="item.holitype">
          <el-radio v-for="item in holidayType" :label="item.id" :key="item.id" border>{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请假事由" prop="reason">
        <el-input
          v-model="item.reason"
          :rows="4"
          style="width:100%"
          type="textarea"
          placeholder="请输入请假理由"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel(['dataForm','dataForm2','reasonForm'])">取消</el-button>
      <el-button type="success" size="medium" plain @click="confirm(['dataForm','dataForm2','reasonForm'])">提交</el-button>
    </span>
    <detail-dialog ref="detailDialog" title="清单查找——员工" @OnConfirm="(data)=>setInfo(data)" />
  </el-dialog>
</template>
<script>
import DetailDialog from './detail-dialog'
import { parseTime, getdays } from '@/utils/index'
export default {
  components: {
    DetailDialog
  },
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
      name: '',
      dep: '',
      holidayType: [{ id: 1, name: '事假', code: 'a', standday: '8' },
        { id: 2, name: '病假', code: 'b', standday: '15' },
        { id: 3, name: '婚假', code: 'c', standday: '8' },
        { id: 4, name: '工伤假', code: 'd', standday: '8' },
        { id: 5, name: '年休假', code: 'e', standday: '6' },
        { id: 6, name: '丧假', code: 'f', standday: '8' },
        { id: 7, name: '产假', code: 'a', standday: '8' },
        { id: 8, name: '陪产假', code: 'b', standday: '8' },
        { id: 9, name: '调休假', code: 'c', standday: '9' },
        { id: 10, name: '其他假', code: 'd', standday: '10' }
      ], // 假种
      rules: {
        date: [{ required: true, message: "请选择日期", trigger: "change" }],
        reason: [{ required: true, message: "请输入请假理由", trigger: "blur" }]
      }
    }
  },
  methods: {
    parseTime,
    getdays,
    // 对外暴露的接口
    open (item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.name = ''
        this.item = {}
        const da = new Date();
        const year = da.getFullYear();
        const month = da.getMonth() + 1;
        const day = da.getDate();
        this.item.docDate = year + '-' + month + '-' + day
      } else {
        this.item = item
        console.log(item)
      }
    },
    setInfo(data) {
      console.log(data)
      this.name = data.emp + '-' + data.empcode
      this.dep = data.dep + '-' + data.depcode
    },
    getFormPromise(form) {
      return new Promise((resolve, reject) => {
        this.$refs[form].validate((valid) => {
          if (valid) return resolve();
        })
      })
    },
    async confirm(formArr) {
      this.item.name = this.name
      Promise.all(formArr.map(ele => this.getFormPromise(ele))).then(res => {
        // 日期处理
        if (this.item.date) {
          const startDate = this.item.date[0];
          const endDate = this.item.date[1];
          this.item.startDate = startDate;
          this.item.endDate = endDate;
          delete this.item.date;
        }
      })
    },
    cancel(formArr) {
      this.visible = false;
      formArr.forEach(ele => {
        this.$refs[ele].resetFields()
      });
    },
    handleDateChange(val) {
      console.log(val)
      const staTime = val[0];
      const enTime = val[1];
      var leaveTime = this.getdays(staTime, enTime);
      this.$set(this.item, 'leaveTime', leaveTime)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog{
  .el-table{height:35vh!important};
}
</style>
