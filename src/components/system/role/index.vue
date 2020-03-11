<template>
  <div id="role">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.name" clearable placeholder="角色名称" />
        <el-button type="success" icon="el-icon-search" plain @click="queryRoles(searchForm)">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增角色</el-button>
        
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="roleList"
        border
        height="83%" 
        :header-cell-style="headerStyle"
        @cell-mouse-enter="(data)=>focusedData = Object.assign({}, data)"
      >
        <el-table-column type="index" :width="columnStyle(55,55,50)" label="序号">
          <template slot-scope="scope">
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" :width="columnStyle(120,120,120)" label="角色名称" />
        <el-table-column prop="weight" label="权重" :width="columnStyle(55,55,55)" />
        <el-table-column prop="orgnode" label="组织架构节点" />
        <el-table-column label="操作" :width="columnStyle(480,430,480)">
          <template>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="$refs.updateDialog.open(focusedData)"
            >修改</el-button>

            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="delOne(focusedData.id)"
            >删除</el-button>
            <el-button
              type="text"
              icon="el-icon-edit-outline"
              @click="$refs.roleuserdialog.open(focusedData)"
            >隶属用户</el-button>
            <el-button
              type="text"
              icon="el-icon-setting"
              class="yellow"
              @click="$refs.resourceDialog.open(focusedData)"
            >资源权限</el-button>
            <el-button
              type="text"
              icon="el-icon-setting"
              class="yellow"
              @click="$refs.menuDialog.open(focusedData)"
            >菜单权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />

    <edit-dialog ref="addDialog" title="新增角色" @OnConfirm="(item)=>insertOne(item)" />
    <edit-dialog ref="updateDialog" title="更新角色" @OnConfirm="(item)=>updateOne(item)" />
    <user-dialog ref="roleuserdialog" title="所属用户编辑" />
    <ResourcePermsedit ref="resourceDialog" title="资源权限编辑" />
    <MenuPermsedit ref="menuDialog" title="菜单权限编辑" />
  </div>
  </div>
</template>

<script>
import EditDialog from "./edit-dialog";
import MenuPermsedit from "./menu-perms-dialog"
import ResourcePermsedit from "./resource-perms-dialog"
import UserDialog from "./role-user-dialog"
import PageComponent from '@/components/common/Pagenation/index'
import { headerStyle, columnStyle } from '@/utils/style'
import { queryRoles, insertOne, updateOne, delOne } from '@/api/role'
export default {
  components: {
    EditDialog,
    MenuPermsedit,
    ResourcePermsedit,
    PageComponent,
    UserDialog
  },
  data() {
    return {
      roleList: [], // 角色数据
      loading: true,
      focusedData: {}, // table选中行数据
      searchForm: { // 搜索表单数据
        name: '',
        orgNode: '',
        currentPage: '',
        pageSize: ''
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      }
    };
  },
  mounted() {
    this.queryRoles(null);
  },
  methods: {
    headerStyle,
    columnStyle,
    // 查询数据
    queryRoles(param) {
      queryRoles(param).then(res => {
        console.log('role',res)
        if (res.code == 200) {
        this.page.currentPage = res.data.currentPage;
        this.page.pageSize = res.data.size;
        this.page.totalPage = res.data.pages;
        this.page.totalSize = res.data.total;
        this.roleList = res.data.list;
        this.loading = false;
        }
      })
    },
    // 插入数据
    insertOne(role) {
      insertOne(role).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.queryRoles();
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      });
    },
    // 修改数据
    updateOne(role) {
      updateOne(role).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.queryRoles();
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    // 删除数据
    delOne(rid) {
      this.$confirm("确认删除吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false,
        closeOnClickModal: false
      })
        .then(() => {
          delOne({ id: rid }).then(res => {
            if (res.code == "200") {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.queryRoles();
            }
          })
        })
        .catch(() => false)
    },
    handlePageChange(item) {
      this.searchForm.currentPage = item.currentPage;
      this.searchForm.pageSize = item.pageSize;
      this.queryRoles(this.searchForm)
    }
  }
};
</script>

