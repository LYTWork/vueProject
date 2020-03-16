<template>
  <div id="ntahl">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.name" clearable placeholder="请假名称" />
        <el-input v-model="searchForm.code" clearable placeholder="请假代码" />
        <el-button type="success" icon="el-icon-search" plain @click="getntahllist(searchForm)">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click="delAllSelection">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增请假</el-button>
        <el-button type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        border
        height="83%"
        :data="ntahlList"
        :header-cell-style="headerStyle"
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
          label="请假名称"
          prop="name"
          :width="columnStyle(400,200,150)"
        />
        <el-table-column
          label="请假代码"
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
      ntahlList: [{id: '001',name: '请假a',code: 'a',standday: '8'},
                    {id: '002',name: '请假b',code: 'b',standday: '8'},
                    {id: '003',name: '请假c',code: 'c',standday: '8'},
                    {id: '004',name: '请假d',code: 'd',standday: '8'},
                    {id: '005',name: '请假e',code: 'e',standday: '8'},
                    {id: '006',name: '请假f',code: 'f',standday: '8'}
                    ], // 请假
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
    //   getntahllist(param).then(res => {
    //     console.log(res)
    //     if (res.code === 200) {
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
    //     if (res.code === 200) {
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
    //     if (res.code === 200) {
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
    //       if (res.code === 200) {
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
      console.log(1,val)
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
      this.getntahllist(para);
    },
    getExcel (param) {
      getExcel(param).then(res => {
        const filename = "请假明细";
        var exceldata = res.data;
        const tHeader = [
          "请假名称",
          "请假代码",
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