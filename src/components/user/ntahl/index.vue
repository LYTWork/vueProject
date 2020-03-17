<template>
  <div id="ntahl">
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
        <el-button type="success" icon="el-icon-search" plain @click="getntahllist(searchForm)">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click="delAllSelection">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增请假</el-button>
        <el-button v-if="$checkPermission(['管理员','测试'])" type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="ntahlList"
        :header-cell-style="headerStyle"
        element-loading-text="拼命加载中"
        border
        height="83%"
        @selection-change="handleSelectionChange"
        @cell-mouse-enter="(data)=>focusedData = Object.assign({}, data)"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="55" >
          <template slot-scope="scope">
            <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 -->
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="columnStyle(100,95,95)"
          label="填表日期"
          prop="docDate"
        />
        <el-table-column
          :width="columnStyle(200,200,150)"
          label="员工"
          prop="employee"
        />
        <el-table-column
          label="部门"
          prop="dept"
        />
        <el-table-column
          :width="columnStyle(110,90,70)"
          label="职位"
          prop="position"
        />
        <el-table-column
          :width="columnStyle(180,160,95)"
          label="请假类型"
          prop="holitype"
        />
        <el-table-column
          :width="columnStyle(270,260,160)"
          label="请假时间"
          prop="date"
        />
        <el-table-column
          label="请假事由"
          prop="reason"
        />
        <el-table-column
          :width="columnStyle(90,80,80)"
          label="请假时长"
          prop="leavetime"
        >
          <template slot-scope="scope">{{ scope.row.leavetime+'天 ' }}</template>
        </el-table-column>
        <el-table-column
          :width="columnStyle(230,200,150)"
          label="操作"
          prop="operation"
        >
          <template>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click.stop="$refs.updateDialog.open(focusedData);"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click.stop="delOne(focusedData.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />

      <edit-dialog ref="addDialog" title="新增请假" @OnConfirm="(item)=>insertOne(item)" />
      <edit-dialog ref="updateDialog" title="修改请假" @OnConfirm="(item)=>updateOne(item)" />
    </div>
  </div>
</template>
<script>
import EditDialog from "./edit-dialog"
import PageComponent from '@/components/common/Pagenation/index'
// import { getntahllist, insertOne, updateOne, delOne, getExcel } from '@/api/ntahl'
import { headerStyle, columnStyle } from '@/utils/style'
import { donwnloadExcel } from '@/utils/index'
export default {
  components: {
    EditDialog,
    PageComponent
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
        totalSize: 0,
        totalPage: 0
      },
      loading: false,
      deptlist: [{ id: '001', name: '部门a', code: 'a' },
        { id: '002', name: '部门b', code: 'b' },
        { id: '003', name: '部门c', code: 'c' },
        { id: '004', name: '部门d', code: 'd' },
        { id: '005', name: '部门e', code: 'e' },
        { id: '006', name: '部门f', code: 'f' }
      ], // 部门
      ntahlList: [{ id: '001', docDate: '2020-03-02', employee: '张三a', dept: '部门a', position: '职位好好', holitype: '事假', date: '2020-03-01', leavetime: '8', reason: '我是原因' },
        { id: '002', docDate: '2020-03-02', employee: '张三b', dept: '部门b', position: '职位好好', holitype: '事假', date: '2020-03-01', leavetime: '8', reason: '我是原因' },
        { id: '003', docDate: '2020-03-02', employee: '张三c', dept: '部门c', position: '职位好好', holitype: '事假', date: '2020-03-01', leavetime: '8', reason: '我是原因' },
        { id: '004', docDate: '2020-03-02', employee: '张三d', dept: '部门d', position: '职位好好', holitype: '事假', date: '2020-03-01', leavetime: '8', reason: '我是原因' },
        { id: '005', docDate: '2020-03-02', employee: '张三e', dept: '部门e', position: '职位好好', holitype: '事假', date: '2020-03-01', leavetime: '8', reason: '我是原因' },
        { id: '006', docDate: '2020-03-02', employee: '张三f', dept: '部门f', position: '职位好好', holitype: '事假', date: '2020-03-01', leavetime: '8', reason: '我是原因' }
      ], // 张三
      focusedData: {}, // table 点击行的数据
      multipleSelection: [] // 多选
    }
  },
  mounted() {
    // this.getntahllist(null);
  },
  methods: {
    headerStyle,
    columnStyle,
    // 获取记录日志
    getntahllist(param) {
      console.log(param)
    //   getntahllist(param).then(res => {
    //     console.log(res)
    //     if (res.dept === 200) {
    //       this.page.currentPage = res.data.currentPage;
    //       this.page.pageSize = res.data.size;
    //       this.page.totalPage = res.data.pages;
    //       this.page.totalSize = res.data.total;
    //       this.ntahlList = res.data.list;
    //       this.loading = false;
    //     }
    //   }).catch(err => {
    //     console.log('请求失败');
    //     console.log(err)
    //   })
    },
    insertOne(item) {
    //   insertOne(item).then(res => {
    //     if (res.dept === 200) {
    //       this.$message({
    //         message: "保存成功",
    //         type: "success"
    //       });
    //       this.getntahllist();
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
    //       this.getntahllist();
    //     } else {
    //       this.$message({
    //         message: "保存失败，原因：" + res.msg,
    //         type: "danger"
    //       });
    //     }
    //   })
    },
    delOne(Hid) {
      // const id = this.focusedData.id
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
    //         this.getntahllist();
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
      this.getntahllist(para);
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
