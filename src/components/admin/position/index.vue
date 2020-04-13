<template>
  <div id="position">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.name" clearable placeholder="职位名称" />
        <el-input v-model="searchForm.code" clearable placeholder="职位代码" />
        <el-select v-model="searchForm.belong" clearable placeholder="所属部门">
          <el-option v-for="(ele,index) of deptlist" :key="index" :label="ele.name" :value="ele.name" />
        </el-select>
        <el-button type="success" icon="el-icon-search" plain @click="queryposition(searchForm)">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增职位</el-button>
        <el-button type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click="delAllSelection">批量删除</el-button>

      </div>
      <el-table
        v-loading="loading"
        :data="allposition"
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
        <el-table-column label="职位名称" prop="name" />
        <el-table-column label="职位代码" prop="code" />
        <el-table-column label="所属部门" prop="belong" />
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
              @click.stop="delposition(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalNum" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <edit-dialog ref="addDialog" :deptlist="deptlist" title="添加职位" @OnConfirm="(item)=>addOne(item,'post')" />
      <edit-dialog ref="updateDialog" :deptlist="deptlist" title="编辑信息" @OnConfirm="(item)=>updateposition(item)" />
    </div>
  </div>
</template>
<script>
import editDialog from './edit-dialog'
import PageComponent from '@/components/common/Pagenation/index'
// import { queryposition, insertposition, updateposition, delposition } from '@/api/position'
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
        code: '',
        belong: ''
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalNum: 0,
        totalPage: 0
      },
      loading: false,
      allposition: [{ id: 1, name: '职位a', code: 'a', belong: '信息部' },
        { id: 2, name: '前端工程师', code: 'b', belong: '信息部' },
        { id: 3, name: '后端工程师', code: 'c', belong: '信息部' },
        { id: 4, name: '软件工程师', code: 'd', belong: '信息部' },
        { id: 5, name: '测试工程师', code: 'e', belong: '信息部' },
        { id: 6, name: '网络维护工程师', code: 'f', belong: '信息部' }
      ],
      deptlist: [{ id: '001', name: '部门a', code: 'a' },
        { id: '002', name: '部门b', code: 'b' },
        { id: '003', name: '部门c', code: 'c' },
        { id: '004', name: '部门d', code: 'd' },
        { id: '005', name: '部门e', code: 'e' },
        { id: '006', name: '部门f', code: 'f' }
      ],
      multipleSelection: [] // 多选

    }
  },
  mounted() {
    // this.querydept(null);
    // this.queryposition(null);
  },
  methods: {
    // 自定义查询所有数据
    queryposition(param) {
      // queryposition(param).then(res => {
      //   if (res.code === 200) {
      //     this.page.currentPage = res.data.currentPage;
      //     this.page.pageSize = res.data.totalpageSize;
      //     this.page.totalPage = res.data.totalPages;
      //     this.page.totalNum = res.data.total;
      //     this.allposition = res.data.list;
      //     this.loading = false
      //   }
      // }).catch(err => {
      //   console.log('请求失败');
      //   console.log(err)
      // })
    },
    // /添加职位数据
    addOne(data, method) {
      // const params = {
      //   name: data.name,
      //   code: data.code,
      // }
      // insertposition(params).then(res => {
      //   if (res.code == 200) {
      //     this.$message({
      //       message: '添加成功',
      //       type: 'success'
      //     });
      //     this.queryposition(null);
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    // 修改职位信息
    updateposition(item) {
      // updateposition(item).then(res => {
      //   if (res.code == '200') {
      //     this.$message({
      //       message: '修改成功！',
      //       type: 'success'
      //     })
      //     this.queryposition(null)
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    delposition(Did) {
      // const para = { id: Did }
      // this.$confirm("确认删除吗？", "询问", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   lockScroll: false,
      //   closeOnClickModal: false
      // })
      //   .then(() => {
      //   // /删除职位数据
      //     delposition(para).then(res => {
      //       if (res.code == '200') {
      //         this.$message({
      //           message: '删除成功！',
      //           type: 'success'
      //         });
      //         this.queryposition();
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
      this.queryposition(para);
    },
    // 导出前端选择的数据
    getExcel (param) {
      const filename = "职位明细";
      var exceldata = this.multipleSelection;
      const tHeader = [
        "职位名称",
        "职位代码"
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
