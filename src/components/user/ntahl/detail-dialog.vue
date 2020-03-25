<template>
  <el-dialog :title="title" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false" width="81%" class="detail-dialog" append-to-body>
    <el-form :data="searchForm" :inline="true" align="center">
      <el-form-item label="姓名:">
        <el-input v-model="searchForm.emp" clearable />
      </el-form-item>
      <el-form-item label="工号:">
        <el-input v-model="searchForm.empcode" clearable /> - <el-select v-model="searchForm.status" clearable>
          <el-option :value="0" label="在职">在职</el-option>
          <el-option :value="1" label="离职">离职</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入职月份/部门:">
        <el-date-picker
          v-model="searchForm.inDate"
          clearable
          type="month"
        /> -
        <el-select v-model="searchForm.dep" clearable>
          <el-option v-for="(ele,idx) of deptlist" :key="idx" :label="ele.name" :value="ele.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" plain @click="getdetails(searchForm)">查询员工</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="details"
      stripe
      height="600"
      @row-click="getInfo">
      <el-table-column type="index" label="序号" prop="id" width="55" />
      <el-table-column label="姓名" prop="emp" />
      <el-table-column label="员工工号" prop="empcode" />
      <el-table-column label="部门" prop="dept" />
      <el-table-column label="部门代码" prop="deptcode" />
      <el-table-column label="性别" prop="gender" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="用户" prop="user" />
      <el-table-column label="职务" prop="title" />
    </el-table>
    <span slot="footer">
      <el-button type="warning" plain @click="()=>visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
// import { getdetails } from '@/api/staff'
// import { getdept } from '@/api/dept'
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
      isOnjob: '在职',
      details: [],
      deptlist: [],
      searchForm: {
        emp: '',
        empcode: '',
        status: '',
        inDate: '',
        dept: ''
      }
    }
  },
  mounted() {
    // 获取部门列表
    this.getdept();
    this.getdetails()
  },
  methods: {
    // 对外暴露的接口
    open (item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {};
        // 获取员工信息
      } else {
        this.item = item;
      }
    },
    getdept() {
      // getdept().then(res => {
      //   console.log('部门信息', res.data)
      //   this.deptlist = res.data
      // })
      this.deptlist = [{ id: '001', name: '部门a', code: 'a' },
        { id: '002', name: '部门b', code: 'b' },
        { id: '003', name: '部门c', code: 'c' },
        { id: '004', name: '部门d', code: 'd' },
        { id: '005', name: '部门e', code: 'e' },
        { id: '006', name: '部门f', code: 'f' }
      ]
    },
    getdetails() {
      // getdept().then(res => {
      //   console.log('部门信息', res.data)
      //   this.deptlist = res.data
      // })
      this.details = [{ id: '001', emp: '张三', empcode: '001', dept: '部门1', deptcode: 'a', gender: 0, title: '前端工程师', married: 0, polity: 0, education: 0, status: 0 },
        { id: '002', emp: '李四', empcode: '002', dept: '部门1', deptcode: 'a', gender: 0, title: '前端工程师', married: 0, polity: 0, education: 0, status: 0 },
        { id: '003', emp: '王五', empcode: '003', dept: '部门1', deptcode: 'a', gender: 0, title: '前端工程师', married: 0, polity: 0, education: 0, status: 0 },
        { id: '004', emp: '张三', empcode: '004', dept: '部门1', deptcode: 'a', gender: 0, title: '前端工程师', married: 0, polity: 0, education: 0, status: 0 },
        { id: '005', emp: '张三', empcode: '005', dept: '部门1', deptcode: 'a', gender: 0, title: '前端工程师', married: 0, polity: 0, education: 0, status: 0 },
        { id: '006', emp: '张三', empcode: '006', dept: '部门1', deptcode: 'a', gender: 0, title: '前端工程师', married: 0, polity: 0, education: 0, status: 0 }
      ]
    },

    getInfo(data) {
      const item = {
        emp: data.emp,
        empcode: data.empcode,
        dept: data.dep,
        deptcode: data.deptcode
      }
      this.$emit("OnConfirm", item);
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog{
  .el-table{height:55vh!important}
}
.el-input{width:8.5rem;
  .el-input__inner{border:1px solid green!important}
}
.el-select{width:10rem}
.el-form{
  margin:0 0 1rem 0;
  border-bottom:1px solid #c2e7b0;
  .el-form-item{margin-bottom:10px!important}
}
</style>
