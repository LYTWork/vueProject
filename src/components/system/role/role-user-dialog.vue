<template>
  <el-dialog
    id="role-user-dialog"
    custom-class="customWidth"
    :title="'角色【'+item.name+'】隶属用户：'"
    :visible.sync="visable"
    :close-on-click-modal="false"
    :show-close="false"
    :lock-scroll="false"
    width="50%"
  >
      
    <search-component ref="search" :tablelist="userList_copy" :search-states="searchStates" @onSearch="(item)=>handleSearchChange(item)" />
    
    <el-table
      border
      height="20rem"
      :data="userList"
      tooltip-effect="dark"
      :header-cell-style="headerStyle"
      @selection-change="handleSelectionChange"
      @select-all="selectall"
      @cell-mouse-enter="(data)=>focusedData = Object.assign({}, data)"
    >
      <el-table-column type="selection" />
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="name" label="用户名称" width="200" />
      <el-table-column prop="imgurl" label="用户头像" />
      <el-table-column prop="type" label="用户类型" />
      <el-table-column label="操作" width="100">
        <template>
          <el-button type="text" icon="el-icon-delete" class="red" @click="delUser(focusedData.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button type="primary" plain icon="el-icon-plus" @click="$refs.detailDialog.open(null)">添加用户</el-button>
      <el-button type="danger" plain @click="delUser(multipleSelection)">删除选中</el-button>
      <el-button type="warning" plain @click="cancel">取消</el-button>
      <el-button type="success" plain @click="confirm">提交</el-button>
    </span>
    <detail-dialog ref="detailDialog" title="用户清单"  :existrole="existrole"  @OnConfirm="(item)=>addroleuser(item)" />
  </el-dialog>
</template>
<script>

import detailDialog from './user-detail-dialog'
import SearchComponent from '@/components/common/Search/index'
import { headerStyle } from '@/utils/style'
import { delWeight } from "@/utils/index.js";
import { queryUsersRid, updateRoleUsers } from "@/api/role";

export default {
  components: {
    detailDialog,
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
      visable: false,
      multipleSelection: [],// 选中的数据二维数组
      focusedData: {}, // table 点击行数据
      userList: [], // el-table 绑定的数据
      delroles: [], // 选择删除的角色
      userList_copy: [], // 实现模糊搜索的原始数据
      existrole: [],
      searchStates: [] // 搜索框的匹配建议输入
    }
  },
  methods: {
    headerStyle,
    // 对外暴露的接口,item接受对象数据
    open (item) {
      this.visable = true;
      if (item === undefined || item === null) {
        this.item = {};
      } else {
        this.item = Object.assign({}, item);
        this.getuserid(); // 获取默认当前数据
      }
    },
    // 根据角色id 获取用户数组
    getuserid() {
      const para = { id: this.item.id };
      queryUsersRid(para).then(res => {
        console.log(this.r)
        this.userList = res.data;
        this.userList_copy = res.data;
        // 匹配搜索建议
        this.existrole = []
        this.searchStates = [];
        this.userList_copy.forEach(ele => {
          const value = { value: ele.name }
          this.searchStates.push(value)
          this.existrole.push(ele.id)
        })
        console.log(this.existrole)
      })
    },
    // addusers为添加用户对话框传过来的对象对象数组，前端添加用户到此页面
    addroleuser(addusers) {
      const tabledata = this.userList.map(a => a.id);  // 当前页面 用户id数组
      const selectdatda = addusers.map(a => a.id) // 添加用户页面返回的 用户id数组
      const arr = delWeight(selectdatda, tabledata) // 添加的用户中有和table重复的
      if (arr.length === 0 || arr.length === null || arr.length === undefined) {
        this.userList = this.userList.concat(addusers)
        this.userList_copy = this.userList;
      } else {
        var name = [];
        for (var i = 0; i < arr.length; i++) { // arr[3,4,5]
          for (var j = 0; j < this.userList.length; j++) { // this.userList[{id: 3,name: "前端"},{...}]
            if (this.userList[j].id === arr[i]) {
              name.push(this.userList[j].name)
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
    // 前端删除用户，判断data是否为数组，
    delUser(data) {
      if (Array.isArray(data) && data.length !== 0) {
        data.forEach(ele => {
          this.userList = this.userList.filter(val => val.id != ele);
          this.userList_copy = this.userList_copy.filter(val => val.id != ele);
        });
      } else if (data !== '' && data !== null && data !== undefined && data.length !== 0) {
        this.userList = this.userList.filter(item => item.id != data)
        this.userList_copy = this.userList_copy.filter(val => val.id != data) // 实际上删除的用户
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
          this.multipleSelection.push(item.id)
        })
      }
    },
    selectall (val) {
      var temp = val;
      this.multipleSelection = [];
      if (temp.length !== 0) {
        temp.forEach(item => {
          this.multipleSelection.push(item.id)
        })
      }
    },
    handleSearchChange(item) {
      // 根据搜索结果是否为空，更新userList对象数组
      !item ? this.getuserid() : this.userList = item;
    },
    confirm() {
      this.userList = this.userList_copy // table显示实际上角色列表数据
      this.$confirm("确认保存吗？", "询问", {
        confirmButtonText: "确认", // 点击确认按钮之后会触发.then()
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        // 发送修改角色请求
        const tabledata = this.userList_copy.map(a => a.id);
        const param = {
          rid: this.item.id,
          uid: tabledata.toString()
        }
        this.updateRoleUsers(param) // 点击提交后发送后端请求
        // 跟新store里的用户当前所属角色

        this.cancel();// 关闭dialog弹窗
      }).catch(() => {
        console.log("cancel");
      })
    },
    cancel () {
      this.visable = false;
      this.$refs.search.searchString = '';
    },
    updateRoleUsers(param) {
      updateRoleUsers(param).then(res => {
        if (res.code === 200) {
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

<style lang="scss">
</style>
