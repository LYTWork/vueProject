<template>
  <el-dialog
    id="user-role-dialog"
    :title="'用户【'+item.username+'】隶属角色：'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :lock-scroll="false"
    custom-class="customWidth"
    width="50%"
  >
    <search-component ref="search" :tablelist="roleList" :search-states="searchStates" @onSearch="(item) =>handleSearchChange(item)" />

    <el-table
      :data="tableData"
      stripe
      height="20rem"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      @select-all="selectall"
    >
      <el-table-column type="selection"/>
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="rolename" label="角色名称" />
      <el-table-column prop="roleDesc" label="角色描述" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" class="red" @click="delRole(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button type="primary" plain icon="el-icon-plus" @click="$refs.detailDialog.open(tableData)" >添加角色</el-button>
      <el-button type="danger" plain @click="delRole(multipleSelection)">删除选中</el-button>
      <el-button type="warning" plain @click="cancel()">取消</el-button>
      <el-button type="success" plain @click="confirm()">提交</el-button>
    </span>
    <detail-dialog ref="detailDialog" :existrole="existrole" title="角色清单" @OnConfirm="(data)=>addRole(data)" />
  </el-dialog>
</template>
<script>

import DetailDialog from './role-detail-dialog'
import SearchComponent from '@/components/common/Search/index'
import { delWeight } from '@/utils/index'
import { getUserRoles, grantUserRoles } from "@/api/user";

export default {
  components: {
    DetailDialog,
    SearchComponent
  },
  props: {
    title: {
      type: String,
      default: "编辑"
    }
  },
  data () {
    return {
      item: {},
      visible: false,
      multipleSelection: [], // 选中的数据二维数组
      tableData: [], // el-table 绑定的数据
      delroles: [], // 选择删除的角色
      roleList: [], // 实现模糊搜索的原始数据
      existrole: [],
      searchStates: [] // 搜索框的匹配建议输入
    }
  },
  methods: {
    // 对外暴露的接口,item接受对象数据
    open (item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {};
      } else {
        this.item = Object.assign({}, item);
        this.getUserRoles(); // 获取默认当前数据
      }
    },
    // 根据用户id 获取角色数组
    getUserRoles() {
      const para = {
        currentPage: 1,
        pageSize: 10,
        condition: {
          userId: this.item.userId
        }
      }
      getUserRoles(para).then(res => {
        console.log(res)
        this.tableData = res.data.items[0].userRoles; // table绑定数据
        this.roleList = this.tableData; // 备份初始数据
        // 匹配搜索建议
        this.existrole = []
        this.searchStates = [];
        this.roleList.forEach(ele => {
          const value = { value: ele.rolename }
          this.searchStates.push(value) // 搜索建议
          this.existrole.push(ele.roleId) // 用户所属角色的id
        })
      })
    },
    // 前端添加
    // select_list为添加角色对话框传过来的角色对象数组，前端添加角色到此页面
    addRole(select_list) {
      const tabledata = this.tableData.map(a => a.roleId); // 当前页面 角色id数组
      const selectdatda = select_list.map(a => a.roleId) // 添加角色页面返回的 角色id数组
      const arr = delWeight(selectdatda, tabledata) // 添加的角色中有和table重复的
      // 没有重复
      if (arr.length === 0 || arr.length === null || arr.length === undefined) {
        this.tableData = this.tableData.concat(select_list)
        this.roleList = this.tableData;
      } else {
        var name = [];
        for (var i = 0; i < arr.length; i++) { // arr[3,4,5]
          for (var j = 0; j < this.tableData.length; j++) { // this.tableData[{id: 3,name: "前端"},{...}]
            if (this.tableData[j].roleId === arr[i]) {
              name.push(this.tableData[j].rolename)
            }
          }
        }
        var msg = `角色【 ${name} 】已经存在！`;
        this.$message({
          message: msg,
          type: 'warning'
        })
      }
    },
    // 前端删除角色
    // 判断data是否为数组，
    delRole(arr_int) {
      // 多选删除，multipleSelection不为空
      if (Array.isArray(arr_int) && arr_int.length !== 0) {
        arr_int.forEach(ele => {
          this.tableData = this.tableData.filter(val => val.roleId !== ele);
          this.roleList = this.roleList.filter(val => val.roleId !== ele);
        });
      } else if (arr_int !== '' && arr_int !== null && arr_int !== undefined && arr_int.length !== 0) {
        this.tableData = this.tableData.filter(val => val.roleId !== arr_int); // table上实际展示的用户
        this.roleList = this.roleList.filter(val => val.roleId !== arr_int) // 实际上删除的用户
      } else {
        this.$message({
          message: '请至少选择一个选项',
          type: 'warning'
        })
      }
    },
    // val 为选中数据的集合
    // 通过this.multipleSelection.prop字段 取得每一个选项的值，prop字段就是表格里面子项的prop值。
    // this.multipleSelection.length为选择了多少项。
    handleSelectionChange (val) {
      var temp = val;
      this.multipleSelection = [];
      if (temp.length !== 0) {
        temp.forEach(item => {
          this.multipleSelection.push(item.roleId)
        })
      }
    },
    selectall (val) {
      var temp = val;
      this.multipleSelection = [];
      if (temp.length !== 0) {
        temp.forEach(item => {
          this.multipleSelection.push(item.roleId)
        })
      }
    },
    handleSearchChange(item) {
      // 根据搜索结果是否为空，更新tableData对象数组
      !item ? this.getUserRoles() : this.tableData = item
    },
    confirm() {
      this.tableData = this.roleList // table显示实际上角色列表数据
      this.$confirm("确认保存吗？", "询问", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        lockScroll: false,
        type: "warning",
        closeOnClickModal: false
      }).then(() => {
        // 发送修改角色请求
        var arrid = this.roleList.map(function (user) { return (user.roleId).toString(); });
        const param = {
          userId: this.item.userId,
          roleIds: arrid
        }
        this.grantUserRoles(param) // 点击提交后发送后端请求
        // // 跟新store里的用户当前所属角色

        // this.cancel();// 关闭dialog弹窗
        this.visible = false
        console.log(this.item, this.roleList, arrid)
      }).catch(() => { false });
    },
    cancel () {
      this.visible = false;
      // this.$refs.search.searchString = '';
    },
    grantUserRoles(param) {
      grantUserRoles(param).then(res => {
        if (res.code === '1') {
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      });
    }
  }
}
</script>
