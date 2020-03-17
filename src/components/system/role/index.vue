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
        :data="roleList"
        :header-cell-style="headerStyle"
        element-loading-text="拼命加载中"
        border
        height="83%"
        @cell-mouse-enter="(data)=>focusedData = Object.assign({}, data)"
      >
        <el-table-column :width="columnStyle(55,55,50)" type="index" label="序号">
          <template slot-scope="scope">
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column :width="columnStyle(120,120,120)" prop="name" label="角色名称" />
        <el-table-column :width="columnStyle(55,55,55)" prop="weight" label="权重" />
        <el-table-column prop="orgnode" label="组织架构节点" />
        <el-table-column :width="columnStyle(480,430,480)" label="操作">
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
      <MenuPermsedit ref="menuDialog" title="菜单权限编辑" />
    </div>
  </div>
</template>

<script>
import EditDialog from "./edit-dialog";
import MenuPermsedit from "./menu-perms-dialog"
import PageComponent from '@/components/common/Pagenation/index'
import { headerStyle, columnStyle } from '@/utils/style'
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
      },
      mockdata: [
        {
          id: 1,
          name: "管理员",
          orgNode: null,
          users: [{ id: 1,
            imageUrl: null,
            name: "Admin",
            type: "公司" }],
          weight: 10
        },
        {
          id: 2,
          name: "测试",
          orgNode: null,
          users: [{ id: 2,
            imageUrl: null,
            name: "test",
            type: "公司" }],
          weight: 10
        }
      ]
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
      // queryRoles(param).then(res => {
      //   console.log('role', res)
      //   if (res.code === 200) {
      //     this.page.currentPage = res.data.currentPage;
      //     this.page.pageSize = res.data.size;
      //     this.page.totalPage = res.data.pages;
      //     this.page.totalSize = res.data.total;
      //     this.roleList = res.data.list;
      //     this.loading = false;
      //     console.log(this.roleList)
      //   }
      // })
      this.roleList = this.mockdata;
      this.loading = false;
    },
    // 插入数据
    insertOne(role) {
      // insertOne(role).then(res => {
      //   if (res.code === 200) {
      //     this.$message({
      //       message: "保存成功",
      //       type: "success"
      //     });
      //     this.queryRoles();
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // });
    },
    // 修改数据
    updateOne(role) {
      // updateOne(role).then(res => {
      //   if (res.code === 200) {
      //     this.$message({
      //       message: "保存成功",
      //       type: "success"
      //     });
      //     this.queryRoles();
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
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
      // .then(() => {
      //   delOne({ id: rid }).then(res => {
      //     if (res.code === 200) {
      //       this.$message({
      //         message: "删除成功！",
      //         type: "success"
      //       });
      //       this.queryRoles();
      //     }
      //   })
      // })
      // .catch(() => false)
    },
    handlePageChange(item) {
      this.searchForm.currentPage = item.currentPage;
      this.searchForm.pageSize = item.pageSize;
      this.queryRoles(this.searchForm)
    }
  }
};
</script>

