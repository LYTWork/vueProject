<template>
  <div id="user">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.username" clearable placeholder="用户名" />
        <el-button type="success" icon="el-icon-search" plain @click="onSearch()">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增用户</el-button>

      </div>
      <el-table
        v-loading="loading"
        :data="userList"
        element-loading-text="拼命加载中"
        stripe
        height="83%"
      >
        <el-table-column label="序号" type="index" width="55">
          <template slot-scope="scope">
            <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 -->
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="staffId" label="员工工号" />
        <el-table-column prop="imgurl" label="头像">
          <template slot-scope="avatar">
            <img :src="avatar.row.imgurl" min-width="30" height="30">
          </template>
        </el-table-column>
        <el-table-column :width="columnStyle(420,350,350)" label="操作">
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
              @click="delUser(scope.row.userId,scope.row.username)"
            >删除</el-button>
            <el-button
              type="text"
              icon="el-icon-edit-outline"
              @click="$refs.rolesEditDialog.open(scope.row)"
            >隶属角色</el-button>

            <el-button
              type="text"
              icon="el-icon-warning-outline"
              class="gray"
              @click="resetPass(scope.row)"
            >重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalNum" :page="page" @pageChange="(item) => handlePageChange(item)" />
      <edit-dialog ref="addDialog" title="新增用户" @OnConfirm="(item)=>addUser(item)" />
      <edit-dialog ref="updateDialog" title="更新用户" @OnConfirm="(item)=>modifyUser(item)" />
      <RolesDialog ref="rolesEditDialog" />
    </div>
  </div>
</template>

<script>
import PageComponent from '@/components/common/Pagenation/index';
import { queryUsers, addUser, modifyUser, delUser } from '@/api/user'
import EditDialog from './edit-dialog';
import RolesDialog from './user-role-dialog';
import { columnStyle } from '@/utils/style'
export default {
  components: {
    PageComponent,
    EditDialog,
    RolesDialog
  },
  data() {
    return {
      userList: [], // 用户数据
      loading: true,
      searchForm: {}, // 搜索表单数据
      page: {
        currentPage: 0, // 第几页
        pageSize: 0, // 每页多少条
        totalNum: 0,
        totalPage: 0 // 第几页
      }
    };
  },
  mounted() {
    this.queryUsers({});
  },
  methods: {
    columnStyle,
    // 查询数据
    onSearch() {
      const para = {
        currentPage: 1,
        pageSize: 10,
        condition: {
          username: this.searchForm.username
        }
      }
      this.queryUsers(para)
    },
    queryUsers(params) {
      queryUsers(params).then(res => {
        console.log(res)
        this.page.currentPage = res.data.currentPage;
        this.page.pageSize = res.data.pageSize;
        this.page.totalPage = res.data.totalPage;
        this.page.totalNum = res.data.totalNum;
        console.log(this.page)
        this.userList = res.data.items;
        this.loading = false;
      })
    },
    // 插入数据
    addUser(user) {
      // 初始密码"123456"
      console.log(user)
      user.password = this.$sha1("123456");
      user.imgurl = '@/assets/img/noimg.jpg'
      addUser(user).then(res => {
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.queryUsers({})
      })
    },
    // 修改数据
    modifyUser(user) {
      modifyUser(user).then(res => {
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.queryUsers({});
      })
    },
    // 删除数据
    delUser(Uid, Uname) {
      const para = {
        userId: Uid,
        username: Uname
      }
      this.$confirm("确认删除吗？", "询问", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        delUser(para).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          })
          this.queryUsers({});
        })
      }).catch(() => false)
    },

    resetPass(user) {
      // 发送请求
      this.$confirm("确认重置密码为123456吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        // 重置密码为123456
        user.password = '123456'
        console.log(user)
        this.modifyUser(user)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        });
      });
    },
    handlePageChange(item) {
      const para = {
        currentPage: item.currentPage,
        pageSize: item.pageSize,
        condition: {
          username: this.searchForm.username
        }
      }
      this.queryUsers(para);
    }
  }
};
</script>
