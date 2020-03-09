<template>
  <div class="dept">
    <div class="container">
      <el-form v-model="searchForm" :inline="true" center class="demo-form-inline">
        <el-form-item label="部门名称:">
          <el-input v-model="searchForm.name" clearable />
        </el-form-item>
        <el-form-item label="部门代码:">
          <el-input v-model="searchForm.code" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="getdeptlist(searchForm)">搜索部门</el-button>
        </el-form-item>
      </el-form>
      <div class="subtitle-button">
        <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增部门</el-button>
        <span style="float:right;margin:1rem;color:gray">共有数据：{{ page.totalSize }} 条</span>
      </div>
      <el-table
        border
        :data="alldept"
        height="82%"
        class="table"
        :header-cell-style="headerStyle"
        @cell-mouse-enter="(data)=>focusedData = Object.assign({}, data)"
      >
        <el-table-column type="index" label="序号" width="55">
          <template slot-scope="scope">
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门名称" prop="name" />
        <el-table-column label="部门代码" prop="codeName" />
        <el-table-column
          width="160px"
          prop="control"
          align="center"
          label="操作"
        >
          <template solt-scope="scope">
            <el-button
              type="warning"
              size="mini"
              plain
              @click.stop="$refs.updateDialog.open(focusedData)"
            >修改</el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              @click.stop="deldept()"
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
import { headerStyle } from '@/utils/style'
import PageComponent from '@/components/common/Pagenation/index'
import { getdeptlist, insertdept, updatedept, deldept } from '@/api/dept'
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
        currentPage: 1,
        pageSize: 10,
        totalSize: 20,
        totalPage: 100
      },
      alldept: [],
      focusedData: {}

    }
  },
  mounted() {
    this.getdeptlist(null);
  },
  methods: {
    headerStyle,
    // //自定义查询所有数据
    getdeptlist(param) {
      console.log(param)
      getdeptlist(param).then(res => {
        console.log('部门信息', res);
        if (res.code === 200) {
          this.page.currentPage = res.data.currentPage;
          this.page.pageSize = res.data.size;
          this.page.totalPage = res.data.pages;
          this.page.totalSize = res.data.total;
          this.alldept = res.data.list;
        }
      }).catch(err => {
        console.log('请求失败');
        console.log(err)
      })
    },
    // /添加部门数据
    addOne(data, method) {
      const params = {
        name: data.name,
        codeName: data.codeName,
        remarks: data.dep
      }
      insertdept(params).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.getdeptlist(null);
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    // 修改部门信息
    updatedept(item) {
      updatedept(item).then(res => {
        if (res.code == '200') {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.getdeptlist(null)
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    deldept() {
      const para = { id: this.focusedData.id }
      this.$confirm("确认删除吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
        closeOnClickModal: false
      })
        .then(() => {
        // /删除部门数据
          deldept(para).then(res => {
            if (res.code == '200') {
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
              this.getdeptlist();
            }
          })
        })
        .catch(() => false)
    },
    handlePageChange(item) {
      // 发送分页查询请求
      const para = { currentPage: item.currentPage, pageSize: item.pageSize }
      this.getdeptlist(para);
    }
  }
}
</script>
