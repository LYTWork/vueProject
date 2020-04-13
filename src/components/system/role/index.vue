<template>
  <div id="role">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.rolename" clearable placeholder="角色名称" />
        <el-button type="success" icon="el-icon-search" plain @click="onSearch()">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增角色</el-button>

      </div>
      <el-table
        v-loading="loading"
        :data="roleList"
        stripe
        element-loading-text="拼命加载中"
        height="83%"
      >
        <el-table-column label="序号" prop="" type="index" width="55">
          <template slot-scope="scope">
            <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 -->
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column :width="columnStyle(120,120,120)" prop="rolename" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <el-table-column :width="columnStyle(480,430,480)" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="$refs.updateDialog.open(scope.row)"
            >修改</el-button>

            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="delRole(scope.row.roleId)"
            >删除</el-button>
            <el-button
              type="text"
              icon="el-icon-setting"
              class="yellow"
              @click="$refs.menuDialog.open(scope.row)"
            >菜单权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalNum" :page="page" @pageChange="(item)=>handlePageChange(item)" />

      <edit-dialog ref="addDialog" title="新增角色" @OnConfirm="(item)=>addRole(item)" />
      <edit-dialog ref="updateDialog" title="更新角色" @OnConfirm="(item)=>modifyRole(item)" />
      <MenuPermsedit ref="menuDialog" title="菜单权限编辑" />
    </div>
  </div>
</template>

<script>
import EditDialog from "./edit-dialog";
import MenuPermsedit from "./menu-perms-dialog"
import PageComponent from '@/components/common/Pagenation/index'
import { queryRoles, addRole, modifyRole, delRole } from '@/api/role'
import { columnStyle } from '@/utils/style'
// import { queryRoles } from '@/api/role'
export default {
  components: {
    EditDialog,
    MenuPermsedit,
    PageComponent
  },
  data() {
    return {
      roleList: [], // 角色数据
      loading: true,
      searchForm: { // 搜索表单数据
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalNum: 0,
        totalPage: 0
      }
    };
  },
  mounted() {
    this.queryRoles({});
  },
  methods: {
    columnStyle,
    // 查询数据
    onSearch() {
      const para = {
        currentPage: 1,
        pageSize: 10,
        condition: {
          rolename: this.searchForm.rolename
        }
      }
      console.log(para)
      this.queryRoles(para)
    },
    queryRoles(params) {
      queryRoles(params).then(res => {
        this.page.currentPage = res.data.currentPage;
        this.page.pageSize = res.data.pageSize;
        this.page.totalPage = res.data.totalPage;
        this.page.totalNum = res.data.totalNum;
        console.log(this.page)
        this.roleList = res.data.items;
        this.loading = false;
      })
    },
    // 插入数据
    addRole(role) {
      console.log(role)
      addRole(role).then(res => {
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.queryRoles({})
      })
    },
    // 修改数据
    modifyRole(role) {
      modifyRole(role).then(res => {
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.queryRoles({});
      })
    },
    // 删除数据
    delRole(Uid, Uname) {
      const para = {
        roleId: Uid,
        rolename: Uname
      }
      this.$confirm("确认删除吗？", "询问", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        delRole(para).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          })
          this.queryRoles({});
        })
      }).catch(() => false)
    },
    handlePageChange(item) {
      const para = {
        currentPage: item.currentPage,
        pageSize: item.pageSize,
        condition: {
          rolename: this.searchForm.rolename
        }
      }
      this.queryRoles(para)
    }
  }
};
</script>

