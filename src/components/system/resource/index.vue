<template>
  <div id="resource">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.name" clearable placeholder="资源名称" />
        <el-input v-model="searchForm.url" clearable placeholder="资源连接" />
        <el-button type="success" icon="el-icon-search" plain @click="getresourceList(searchForm)">搜索</el-button>
        <!-- <el-button type="danger" icon="el-icon-delete" plain @click="delAllSelection">批量删除</el-button> -->
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增资源</el-button>
        <el-button type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>
        
      </div>
      <el-table v-loading="loading" element-loading-text="拼命加载中" border :data="resourceList" style="width: 100%" height="83%" :header-cell-style="headerStyle" @cell-mouse-enter="(data)=>{ focusedData = Object.assign({}, data)}">
        <el-table-column type="index" width="55" label="序号">
          <template slot-scope="scope">
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" width="150" label="资源名称" />
        <el-table-column prop="url" label="资源链接" />
        <el-table-column prop="permission" label="资源权限" />
        <el-table-column label="操作" width="150">
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
            @click="delOne(focusedData)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
    </div>
    <edit-dialog ref="addDialog" title="新增资源" @OnConfirm="item=>insertOne(item)" />
    <edit-dialog ref="updateDialog" title="更新资源" @OnConfirm="item=>updateOne(item)" />
  </div>
</template>
<script>
import { headerStyle } from '@/utils/style'
import PageComponent from '@/components/common/Pagenation/index'
import EditDialog from './edit-dialog'
import { getresourceList, insertOne, updateOne, delOne } from '@/api/resource'
export default {
  components: {
    PageComponent,
    EditDialog
  },
  data() {
    return {
      searchForm: {
        name: '',
        url: '',
        currentPage: '',
        pageSize: ''
      },
      loading: true,
      page: {
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      },
      focusedData: '',
      resourceList: []
    }
  },
  mounted() {
    this.getresourceList(null)
  },
  methods: {
    headerStyle,
    getresourceList(params) {
      getresourceList(params).then(res => {
        // console.log('enter getresourceList')
        // console.log(res.data)
        this.page.currentPage = res.data.currentPage;
        this.page.pageSize = res.data.size;
        this.page.totalPage = res.data.pages;
        this.page.totalSize = res.data.total;
        this.resourceList = res.data.list
        this.loading = false
      })
    },
    insertOne(item) {
      // console.log(item);
      item.permission = item.permission.toString();
      insertOne(item).then(res => {
        if (res.code == '200') {
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.getresourceList();
        }
      })
    },
    updateOne(item) {
      console.log(item);
      item.permission = item.permission.toString();
      updateOne(item).then(res => {
        if (res.code == '200') {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.getresourceList();
        }
      })
    },
    delOne(item) {
      this.$confirm("确认删除吗？", "询问", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
        closeOnClickModal: false
      }).then(() => {
        console.log(item)
      })
    },
    handlePageChange(item) {
      this.searchForm.currentPage = item.currentPage;
      this.searchForm.pageSize = item.pageSize;
      this.getresourceList(this.searchForm)
    }
  }
}
</script>
<style lang="scss">
  @media only screen and (min-width:1920px){
    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)  {
    #resource{
      .el-table{
        height:86%!important;
      }
    }
  }
}
</style>
