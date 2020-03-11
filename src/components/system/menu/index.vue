<template>
  <div id="menu">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.title" clearable placeholder="菜单名称" />
        <el-button type="success" icon="el-icon-search" plain @click="onSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增菜单</el-button>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="mockdata"
        border
        row-key="id"
        :header-cell-style="headerStyle"
        height="83%"
        :tree-props="{children: 'lowerMenu', hasChildren: 'hasChildren'}"
        @cell-mouse-enter="mouseEnter"
      >
        <el-table-column prop="title" label="菜单名称" width="200" />
        <el-table-column prop="icon" label="菜单图标">
          <template slot-scope="scope">
            <i :class="scope.row.icon" style="font-size:1.1rem" />
          </template>
        </el-table-column>
        <el-table-column prop="type" :formatter="parseType" label="菜单类型" />
        <el-table-column prop="url" label="菜单链接" />
        <el-table-column label="操作" width="260">
          <template >
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
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <edit-dialog
        ref="updateDialog"
        :menu-tree="mockdata"
        title="更新菜单"
        @OnConfirm="(item)=>{updateOne(item)}"
      />

      <edit-dialog
        ref="addDialog"
        :menu-tree="mockdata"
        title="新增菜单"
        @OnConfirm="(item)=>{insertOne(item)}"
      />
      <edit-dialog
        ref="insertChildDialog"
        :menu-tree="mockdata"
        title="插入子节点"
        @OnConfirm="(item)=>{insertOne(item)}"
      />
    </div>
  </div>
</template>

<script>
import { dataToTree } from '@/utils/index'
import EditDialog from "./edit-dialog";
import PageComponent from '@/components/common/Pagenation/index';
import { headerStyle } from '@/utils/style.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    EditDialog,
    PageComponent,
  },
  data () {
    return {
      searchForm: {
        title: '',
        mid: '',
        currentPage: '',
        pageSize: ''
      },
      mockdata: [
            {"id":1,
            "parentId":null,
            "title":"系统首页",
            "url":"/user/welcom",
            "icon":"el-icon-user"
            },
            {"id":2,
            "parentId":null,
            "title":"权限设置",
            "icon":"el-icon-setting",
            "lowerMenu":[{"id":21,
                        "parentId":2,
                        "title":"用户管理",
                        "url":"/system/user"
                        },
                        {"id":22,
                        "parentId":2,
                        "title":"角色管理",
                        "url":"/system/role"
                        },
                        {"id":23,
                        "parentId":2,
                        "title":"菜单管理",
                        "url":"/system/menu"
                        },
                        {"id":24,
                        "parentId":2,
                        "title":"资源管理",
                        "url":"/system/resource"
                        }]
            },
            {"id":3,
            "parentId":null,
            "title":"基础资料",
            "icon":"el-icon-orange",
            "lowerMenu":[{"id":31,
                        "parentId":3,
                        "title":"员工信息",
                        "url":"/admin/staff"
                        },
                        {"id":32,
                        "parentId":3,
                        "title":"部门信息",
                        "url":"/admin/dept"
                        },
                        {"id":33,
                        "parentId":3,
                        "title":"假种信息",
                        "url":"/admin/holiday"
                        }]
            },
            {"id":4,
            "parentId":null,
            "title":"错误处理",
            "icon":"el-icon-watermelon",
            "lowerMenu":[{"id":41,
                        "parentId":4,
                        "title":"403",
                        "url":"/403"
                        },
                        {"id":42,
                        "parentId":4,
                        "title":"404",
                        "url":"/404"
                        }]

            },
            {"id":5,
            "parentId":null,
            "title":"修改密码",
            "url":"/user/resetpass",
            "icon":"el-icon-edit"
            }],
      focusedData: {},
      page: {
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuType", "menuList", "typeList", "userid"])
  },
  methods: {
    headerStyle,
    ...mapActions("menu/", ["setMenu"]),
    onSearch() {
      // 发送请求
    },
    // 查询数据
    // 插入数据
    insertOne (menu) {
      // delete menu["lowerMenu"]
      // insertOne(menu).then(res => {
      //   if (res.code == '200') {
      //     this.$message({
      //       message: "添加成功！",
      //       type: "success"
      //     });
      //     this.getMenuParent({ mid: 1 });
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    // 修改数据
    updateOne(menu) {
      // delete menu["lowerMenu"]
      // updateOne(menu).then(res => {
      //   if (res.code == '200') {
      //     this.$message({
      //       message: "修改成功！",
      //       type: "success"
      //     });
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    // 删除数据
    delOne(mid) {
      // const id = this.focusedData.id;
      // const para = { id: id };
      console.log(mid);
      this.$confirm("确认删除吗？", "询问", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          // delOne(para).then(res => {
          //   if (res.code === 200) {
          //     this.$message({
          //       message: "删除成功",
          //       type: "success"
          //     });
          //   }
          // });
        })
        .catch(() => false);
    },
    mouseEnter (data) {
      this.focusedData = Object.assign({}, data);
      delete this.focusedData.lowerMenu;
    },
    handlePageChange(item) {
      this.searchForm.currentPage = item.currentPage;
      this.searchForm.pageSize = item.pageSize;
      // 请求数据
    },
    parseType (row) {
      // 枚举数字：1，2
      row.type = Number(row.type);
      const str = ["目录", "菜单"];
      return str[row.type - 1];
    }
  }
};
</script>
