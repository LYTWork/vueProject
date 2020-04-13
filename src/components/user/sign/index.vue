<template>
  <div id="sigin">
    <div class="container">
      <div class="handle-box">
        <el-date-picker
          v-model="searchForm.docDate"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="填表日期"
        />
        <el-input v-model="searchForm.employee" clearable placeholder="员工姓名" />
        <el-select v-model="searchForm.dept" clearable placeholder="员工部门">
          <el-option v-for="(ele,index) of deptlist" :key="index" :label="ele.name" :value="ele.name" />
        </el-select>
        <el-button type="success" icon="el-icon-search" plain @click="getsiginlist(searchForm)">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addntahldialog.open(null)">新增请假</el-button>
        <el-button v-if="$checkPermission(['管理员','测试'])" type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click="delAllSelection">批量删除</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="siginList"
        element-loading-text="拼命加载中"
        stripe
        height="83%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="55" >
          <template slot-scope="scope">
            <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 -->
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="姓名"
          align="center"/>
        <el-table-column
          prop="docDate"
          label="打卡日期"
          sortable
          align="center"/>
        <el-table-column
          label="打卡记录"
          align="center">
          <template slot-scope="scope">
            <div :class="{red: (scope.row.status === '异常'), blue: ((scope.row.status === '补打卡') || (scope.row.status === '请假')) }">
              <span>{{ scope.row.start_time }}</span>
              <span>--</span>
              <span>{{ scope.row.end_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="工作时长(h)"
          align="center">
          <template slot-scope="scope">
            <span :class="{red:(scope.row.status === '异常'), blue: ((scope.row.status === '请假') || (scope.row.status === '补打卡')) }">
              {{ scope.row.workday }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          column-key="status"
          align="center">
          <template slot-scope="scope">
            <span :class="{red: scope.row.status === '异常', blue: ((scope.row.status === '补打卡') || (scope.row.status === '请假'))}">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="$checkPermission(['管理员'])"
              type="text"
              icon="el-icon-edit"
              @click="$refs.updateDialog.open(scope.row)">
              更改状态
            </el-button>
            <el-button
              v-if="$checkPermission(['管理员','部长'])"
              type="text"
              icon="el-icon-more"
              class="gray"
              @click="$refs.detailDialog.open(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalNum" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <edit-dialog ref="updateDialog" title="更改状态" @OnConfirm="(item)=>updateOne(item)" />
      <detail-dialog ref="detailDialog" title="详细信息" @OnConfirm="(item)=>updateOne(item)" />
      <add-ntahl-dialog ref="addntahldialog" title="新增气请假" @OnConfirm="(item)=>updateOne(item)" />
    </div>
  </div>
</template>
<script>
import AddNtahlDialog from '../ntahl/edit-dialog'
import EditDialog from './edit-dialog'
import DetailDialog from './detail-dialog'
import PageComponent from '@/components/common/Pagenation/index'
// import { getsiginlist, insertOne, updateOne, delOne, getExcel } from '@/api/sigin'
import { columnStyle } from '@/utils/style'
import { donwnloadExcel } from '@/utils/index'
export default {
  components: {
    PageComponent,
    EditDialog,
    DetailDialog,
    AddNtahlDialog
  },
  data() {
    return {
      searchForm: {
        dept: '',
        employee: ''
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalNum: 0,
        totalPage: 0
      },
      loading: false,
      deptlist: [],
      // 模拟表格数据
      siginList: [
        {
          "id": 1,
          "docDate": "2018-05-14",
          "status": "异常",
          "end_time": "",
          "start_time": "",
          "user_name": "黎雨彤",
          "workday": 1
        },
        {
          "id": 2,
          "docDate": "2018-05-16",
          "status": "正常",
          "end_time": "",
          "start_time": "",
          "user_name": "lyt",
          "workday": 1
        },
        {
          "id": 3,
          "docDate": "2018-05-19",
          "status": "请假",
          "end_time": "",
          "start_time": "",
          "user_name": "fff",
          "workday": 1
        },
        {
          "id": 4,
          "docDate": "2018-05-22",
          "status": "补打卡",
          "end_time": "21:05",
          "start_time": "21:05",
          "user_name": "test",
          "workday": 1
        }],
      multipleSelection: [] // 多选
    }
  },
  mounted() {
    // this.getsiginlist(null);
    this.getdept()
  },
  methods: {
    columnStyle,
    // 获取记录日志
    getsiginlist(param) {
      console.log(param)
    //   getsiginlist(param).then(res => {
    //     console.log(res)
    //     if (res.dept === 200) {
    //       this.page.currentPage = res.data.currentPage;
    //       this.page.pageSize = res.data.totalpageSize;
    //       this.page.totalPage = res.data.totalPages;
    //       this.page.totalNum = res.data.total;
    //       this.siginList = res.data.list;
    //       this.loading = false;
    //     }
    //   }).catch(err => {
    //     console.log('请求失败');
    //     console.log(err)
    //   })
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
    insertOne(item) {
    //   insertOne(item).then(res => {
    //     if (res.dept === 200) {
    //       this.$message({
    //         message: "保存成功",
    //         type: "success"
    //       });
    //       this.getsiginlist();
    //     } else {
    //       this.$message({
    //         message: "保存失败，原因：" + res.msg,
    //         type: "danger"
    //       });
    //     }
    //   })
    },
    updateOne(item) {
    //   updateOne(item).then(res => {
    //     if (res.dept === 200) {
    //       this.$message({
    //         message: "保存成功",
    //         type: "success"
    //       });
    //       this.getsiginlist();
    //     } else {
    //       this.$message({
    //         message: "保存失败，原因：" + res.msg,
    //         type: "danger"
    //       });
    //     }
    //   })
    },
    delOne(Hid) {
    //   this.$confirm("确认删除吗？", "询问", {
    //     confirmButtonText: "确认",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     lockScroll: "false",
    //     closeOnClickModal: "false"
    //   }).then(() => {
    //     delOne(Hid).then(res => {
    //       if (res.dept === 200) {
    //         this.$message({
    //           message: "删除成功",
    //           type: "success"
    //         });
    //         this.getsiginlist();
    //       }
    //     })
    //   })
    },
    // 多选操作
    handleSelectionChange(val) {
      console.log(1, val)
      this.multipleSelection = val;
    },
    // 删除所选
    delAllSelection() {
      console.log(this.multipleSelection)
      const length = this.multipleSelection.length;
      let str = '';
      // this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].employee + ' ';
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    handlePageChange(item) {
      // 发送分页查询请求
      const para = { currentPage: item.currentPage, pageSize: item.pageSize }
      this.getsiginlist(para);
    },
    // 导出选中数据
    getExcel (param) {
      const fileemployee = "请假明细";
      var exceldata = this.multipleSelection;
      const tHeader = [
        "填表日期",
        "员工",
        "部门",
        "职位",
        "请假类型",
        "请假时间",
        "请假事由",
        "请假时长"
      ];
      const filterVal = [
        "docDate",
        "employee",
        "position",
        "holitype",
        "date",
        "leavetime",
        "reason"
      ];
      donwnloadExcel(fileemployee, tHeader, filterVal, exceldata)
    }
  }
}
</script>
