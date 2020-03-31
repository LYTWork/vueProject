<template>
  <div id="dept">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.name" clearable placeholder="部门名称" />
        <el-input v-model="searchForm.code" clearable placeholder="部门代码" />
        <el-button type="success" icon="el-icon-search" plain @click="querydept(searchForm)">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click="delAllSelection">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增部门</el-button>
        <el-button type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>

      </div>
      <el-table
        v-loading="loading"
        :data="alldept"
        element-loading-text="拼命加载中"
        stripe
        height="82%"
        class="table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="55">
          <template slot-scope="scope">
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门名称" prop="name" />
        <el-table-column label="部门代码" prop="code" />
        <el-table-column label="部门简介" prop="descrip" />
        <el-table-column
          width="160px"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click.stop="$refs.updateDialog.open(scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click.stop="deldept(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <edit-dialog ref="addDialog" title="添加部门" @OnConfirm="(item)=>addOne(item,'post')" />
      <edit-dialog ref="updateDialog" title="编辑信息" @OnConfirm="(item)=>updatedept(item)" />
    </div>
  </div>
</template>
<script>
import editDialog from './edit-dialog'
import PageComponent from '@/components/common/Pagenation/index'
// import { querydept, insertdept, updatedept, deldept } from '@/api/dept'
import { donwnloadExcel } from '@/utils/index'
export default {
  components: {
    PageComponent,
    editDialog
  },
  data() {
    return {
      searchForm: {
        name: '',
        code: ''
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      },
      loading: false,
      alldept: [{ id: 1, name: '部门a', code: 'a' },
        { id: 2, name: '部门b', code: 'b' },
        { id: 3, name: '部门c', code: 'c' },
        { id: 4, name: '部门d', code: 'd' },
        { id: 5, name: '部门e', code: 'e' },
        { id: 6, name: '部门f', code: 'f' }
      ],
      multipleSelection: [] // 多选

    }
  },
  mounted() {
    // this.querydept(null);
  },
  methods: {
    // 自定义查询所有数据
    querydept(param) {
      // querydept(param).then(res => {
      //   if (res.code === 200) {
      //     this.page.currentPage = res.data.currentPage;
      //     this.page.pageSize = res.data.size;
      //     this.page.totalPage = res.data.pages;
      //     this.page.totalSize = res.data.total;
      //     this.alldept = res.data.list;
      //     this.loading = false
      //   }
      // }).catch(err => {
      //   console.log('请求失败');
      //   console.log(err)
      // })
    },
    // /添加部门数据
    addOne(data, method) {
      // const params = {
      //   name: data.name,
      //   code: data.code,
      // }
      // insertdept(params).then(res => {
      //   if (res.code == 200) {
      //     this.$message({
      //       message: '添加成功',
      //       type: 'success'
      //     });
      //     this.querydept(null);
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    // 修改部门信息
    updatedept(item) {
      // updatedept(item).then(res => {
      //   if (res.code == '200') {
      //     this.$message({
      //       message: '修改成功！',
      //       type: 'success'
      //     })
      //     this.querydept(null)
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    deldept(Did) {
      // const para = { id: Did }
      // this.$confirm("确认删除吗？", "询问", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   lockScroll: false,
      //   closeOnClickModal: false
      // })
      //   .then(() => {
      //   // /删除部门数据
      //     deldept(para).then(res => {
      //       if (res.code == '200') {
      //         this.$message({
      //           message: '删除成功！',
      //           type: 'success'
      //         });
      //         this.querydept();
      //       }
      //     })
      //   })
      //   .catch(() => false)
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
      this.querydept(para);
    },
    // 导出前端选择的数据
    getExcel (param) {
      const filename = "部门明细";
      var exceldata = this.multipleSelection;
      const tHeader = [
        "部门名称",
        "部门代码"
      ];
      const filterVal = [
        "name",
        "code"
      ];
      donwnloadExcel(filename, tHeader, filterVal, exceldata)
    }
  }
}
</script>
