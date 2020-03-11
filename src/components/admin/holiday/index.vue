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
        element-loading-text="拼命加载中"
        border
        height="83%"
        :data="holidayList"
        :header-cell-style="headerStyle"
        @cell-mouse-enter="(data)=>focusedData = Object.assign({}, data)"
      >
        <el-table-column
          label="序号"
          type="index"
          width="55"
        >
          <template slot-scope="scope">
            <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 -->
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="假种名称"
          prop="name"
          :width="columnStyle(400,200,150)"
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
          label="操作"
          prop="operation"
          :width="columnStyle(230,200,150)"
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

      <edit-dialog ref="addDialog" title="新增假种" @OnConfirm="(item)=>insertOne(item)" />
      <edit-dialog ref="updateDialog" title="修改假种" @OnConfirm="(item)=>updateOne(item)" />
    </div>
  </div>
</template>
<script>
import EditDialog from "./edit-dialog"
import PageComponent from '@/components/common/Pagenation/index'
import { getholidaylist, insertOne, updateOne, delOne, getExcel } from '@/api/holiday'
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
        code: '',
        name: ''
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      },
      loading: true,
      holidayList: [], // 假种
      focusedData: {} // table 点击行的数据
    }
  },
  mounted() {
    this.getholidaylist(null);
  },
  methods: {
    headerStyle,
    columnStyle,
    // 获取记录日志
    getholidaylist(param) {
      getholidaylist(param).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.page.currentPage = res.data.currentPage;
          this.page.pageSize = res.data.size;
          this.page.totalPage = res.data.pages;
          this.page.totalSize = res.data.total;
          this.holidayList = res.data.list;
          this.loading = false;
        }
      }).catch(err => {
        console.log('请求失败');
        console.log(err)
      })
    },
    insertOne(item) {
      insertOne(item).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getholidaylist();
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    updateOne(item) {
      updateOne(item).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getholidaylist();
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    delOne(Hid) {
      // const id = this.focusedData.id
      this.$confirm("确认删除吗？", "询问", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        delOne(Hid).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getholidaylist();
          }
        })
      })
    },

    handlePageChange(item) {
      // 发送分页查询请求
      const para = { currentPage: item.currentPage, pageSize: item.pageSize }
      this.getholidaylist(para);
    },
    getExcel (param) {
      getExcel(param).then(res => {
        const filename = "假种明细";
        var exceldata = res.data;
        const tHeader = [
          "假种名称",
          "假种代码",
          "请假日期上限"
        ];
        const filterVal = [
          "name",
          "code",
          "standday"
        ];
        donwnloadExcel(filename, tHeader, filterVal, exceldata)
      })
    }
  }
}
</script>