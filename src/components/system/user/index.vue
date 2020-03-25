<template>
  <div id="user">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.username" clearable placeholder="用户名" />
        <el-button type="success" icon="el-icon-search" plain @click="queryUsers(searchForm)">搜索</el-button>
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
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="imageUrl" label="头像">
          <template slot-scope="avatar">
            <img :src="avatar.row.imageUrl" min-width="30" height="30">
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
              @click="delOne(scope.row.id)"
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
              @click="resetPass(scope.row.name,scope.row.id)"
            >重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item) => handlePageChange(item)" />
      <edit-dialog ref="addDialog" title="新增用户" @OnConfirm="(item)=>insertOne(item)" />
      <edit-dialog ref="updateDialog" title="更新用户" @OnConfirm="(item)=>updateOne(item)" />
      <RolesDialog ref="rolesEditDialog" />
    </div>
  </div>
</template>

<script>
import PageComponent from '@/components/common/Pagenation/index';
// import { queryUsers, insertOne, updateOne } from '@/api/sysuser'
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
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      },
      mockdata: [
        {
          id: 1,
          imageUrl: "string",
          name: "admin",
          password: "9accb83c1e358e1287d785561056ec597a71eff0",
          roleList: [{ id: 12,
            name: "管理员"
          }],
          timeStamp: null
        },
        {
          id: 2,
          imageUrl: "string",
          name: "测试新增",
          password: "9accb83c1e358e1287d785561056ec597a71eff0",
          roleList: [{ id: 2,
            name: "测试"
          }],
          timeStamp: null
        }
      ]
    };
  },
  mounted() {
    this.queryUsers(null);
  },
  methods: {
    columnStyle,
    // 查询数据
    queryUsers(params) {
      // queryUsers(params).then(res => {
      //   if (res.code === 200) {
      //     this.page.currentPage = res.data.currentPage;
      //     this.page.pageSize = res.data.size;
      //     this.page.totalPage = res.data.pages;
      //     this.page.totalSize = res.data.total;
      //     this.userList = res.data.list;
      //     this.loading = false;
      //     console.log(11, res.data.list)
      //   }
      // })
      this.loading = false;
      this.userList = this.mockdata
    },
    // 插入数据
    insertOne(user) {
      // 初始密码"123456"
      user.password = this.$sha1("123456");
      // insertOne(user).then(res => {
      //   if (res.code === 200) {
      //     this.$message({
      //       message: "保存成功",
      //       type: "success"
      //     });
      //     this.queryUsers();
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    // 修改数据
    updateOne(user) {
      // updateOne(user).then(res => {
      //   if (res.code === 200) {
      //     this.$message({
      //       message: "保存成功",
      //       type: "success"
      //     });
      //     this.queryUsers();
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    // 删除数据
    delOne(id) {
      this.$confirm("确认删除吗？", "询问", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        // delOne(id).then(res => {
        //   if (res.code == 200) {
        //     this.$message({
        //       message: "删除成功",
        //       type: "success"
        //     })
        //     this.queryUsers();
        //   }
        // })
      }).catch(() => false)
    },

    resetPass(Uname, Uid) {
      // 发送请求
      this.$confirm("确认重置密码为123456吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        // 重置密码为123456
        // const pwd = this.$sha1(Uname + "123456");
        // resetPass(Uid, pwd).then(res => {
        //   if (res.code === 200) {
        //     this.$message({
        //       message: "重置密码为123456",
        //       type: "success"
        //     });
        //     this.queryUsers();
        //   } else {
        //     this.$message({
        //       message: "保存失败，原因：" + res.msg,
        //       type: "danger"
        //     });
        //   }
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        });
      });
    },
    handlePageChange(item) {
      const para = { currentPage: item.currentPage, pageSize: item.pageSize };
      this.queryUsers(para);
    }
  }
};
</script>
