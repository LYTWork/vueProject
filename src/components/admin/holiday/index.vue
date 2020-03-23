<template>
  <div id="holiday">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.name" clearable placeholder="假种名称" />
        <el-input v-model="searchForm.code" clearable placeholder="假种代码" />
        <el-button type="success" icon="el-icon-search" plain @click="getholidaylist(searchForm)">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click="delAllSelection">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增假种</el-button>
        <el-button type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="holidayList"
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
          :width="columnStyle(400,200,150)"
          label="假种名称"
          prop="name"
        />
        <el-table-column
          label="假种代码"
          prop="code"
        />
        <el-table-column
          label="请假上限"
          prop="standday"
          width="300"
        />
        <el-table-column
          :width="columnStyle(230,200,150)"
          label="操作"
          prop="operation"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click.stop="$refs.updateDialog.open(scope.row);"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click.stop="delOne(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />

      <edit-dialog ref="addDialog" title="新增假种" @OnConfirm="(item)=>insertOne(item)" />
      <edit-dialog ref="updateDialog" title="修改假种" @OnConfirm="(item)=>updateOne(item)" />
    </div>
  </div>
</template>
<script>
import EditDialog from "./edit-dialog"
import PageComponent from '@/components/common/Pagenation/index'
// import { getholidaylist, insertOne, updateOne, delOne, getExcel } from '@/api/holiday'
import { columnStyle } from '@/utils/style'
// import { donwnloadExcel } from '@/utils/index'
export default {
  components: {
    EditDialog,
    PageComponent
  },
  data() {
    return {
      searchForm: {
        code: '',
        name: ''
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      },
      loading: false,
      holidayList: [{ id: 1, name: '事假', code: 'a', standday: '8' },
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
      multipleSelection: [] // 多选
    }
  },
  mounted() {
    // this.getholidaylist(null);
  },
  methods: {
    columnStyle,
    // 获取记录日志
    getholidaylist(param) {
      // getholidaylist(param).then(res => {
      //   console.log(res)
      //   if (res.code === 200) {
      //     this.page.currentPage = res.data.currentPage;
      //     this.page.pageSize = res.data.size;
      //     this.page.totalPage = res.data.pages;
      //     this.page.totalSize = res.data.total;
      //     this.holidayList = res.data.list;
      //     this.loading = false;
      //   }
      // }).catch(err => {
      //   console.log('请求失败');
      //   console.log(err)
      // })
    },
    insertOne(item) {
      // insertOne(item).then(res => {
      //   if (res.code === 200) {
      //     this.$message({
      //       message: "保存成功",
      //       type: "success"
      //     });
      //     this.getholidaylist();
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    updateOne(item) {
      // updateOne(item).then(res => {
      //   if (res.code === 200) {
      //     this.$message({
      //       message: "保存成功",
      //       type: "success"
      //     });
      //     this.getholidaylist();
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    delOne(Hid) {
      // const id = this.Hid
      // this.$confirm("确认删除吗？", "询问", {
      //   confirmButtonText: "确认",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   lockScroll: "false",
      //   closeOnClickModal: "false"
      // }).then(() => {
      //   delOne(Hid).then(res => {
      //     if (res.code === 200) {
      //       this.$message({
      //         message: "删除成功",
      //         type: "success"
      //       });
      //       this.getholidaylist();
      //     }
      //   })
      // })
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
        str += this.multipleSelection[i].name + ' ';
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    handlePageChange(item) {
      // 发送分页查询请求
      const para = { currentPage: item.currentPage, pageSize: item.pageSize }
      this.getholidaylist(para);
    },
    // 导出后端返回数据
    getExcel (param) {
      // getExcel(param).then(res => {
      //   const filename = "假种明细";
      //   var exceldata = res.data;
      //   const tHeader = [
      //     "假种名称",
      //     "假种代码",
      //     "请假日期上限"
      //   ];
      //   const filterVal = [
      //     "name",
      //     "code",
      //     "standday"
      //   ];
      //   donwnloadExcel(filename, tHeader, filterVal, exceldata)
      // })
    }
  }
}
</script>
