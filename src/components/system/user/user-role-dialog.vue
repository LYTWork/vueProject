<template>
  <el-dialog
    id="user-role-dialog"
    :title="'用户【'+item.name+'】隶属角色：'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :lock-scroll="false"
    custom-class="customWidth"
    width="50%"
  >
    <search-component ref="search" :tablelist="roleList_copy" :search-states="searchStates" @onSearch="(item) =>handleSearchChange(item)" />

    <el-table
      :data="roleList"
      stripe
      height="20rem"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      @select-all="selectall"
    >
      <el-table-column type="selection"/>
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" class="red" @click="delRole(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button type="primary" plain icon="el-icon-plus" @click="$refs.detailDialog.open(roleList)" >添加角色</el-button>
      <el-button type="danger" plain @click="delRole(multipleSelection)">删除选中</el-button>
      <el-button type="warning" plain @click="cancel">取消</el-button>
      <el-button type="success" plain @click="confirm">提交</el-button>
    </span>
    <detail-dialog ref="detailDialog" :existrole="existrole" title="角色清单" @OnConfirm="(data)=>adduserrole(data)" />
  </el-dialog>
</template>
<script>

import DetailDialog from './role-detail-dialog'
import SearchComponent from '@/components/common/Search/index'
import { delWeight } from '@/utils/index'
import { queryRolesUid, updateUserRole } from "@/api/sysuser";

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
      roleList: [], // el-table 绑定的数据
      delroles: [], // 选择删除的角色
      roleList_copy: [], // 实现模糊搜索的原始数据
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
        this.getroleid(); // 获取默认当前数据
      }
    },
    // 根据用户id 获取角色数组
    getroleid() {
      queryRolesUid(this.item.id).then(res => {
        this.roleList = res.data;
        this.roleList_copy = res.data;
        // 匹配搜索建议
        this.existrole = []
        this.searchStates = [];
        this.roleList_copy.forEach(ele => {
          const value = { value: ele.name }
          this.searchStates.push(value)
          this.existrole.push(ele.id)
        })
      })
    },
    // addroles为添加角色对话框传过来的角色对象数组，前端添加角色到此页面
    adduserrole(addroles) {
      const tabledata = this.roleList.map(a => a.id); // 当前页面 角色id数组
      const selectdatda = addroles.map(a => a.id) // 添加角色页面返回的 角色id数组
      const arr = delWeight(selectdatda, tabledata) // 添加的角色中有和table重复的
      if (arr.length === 0 || arr.length === null || arr.length === undefined) {
        this.roleList = this.roleList.concat(addroles)
        this.roleList_copy = this.roleList;
      } else {
        var name = [];
        for (var i = 0; i < arr.length; i++) { // arr[3,4,5]
          for (var j = 0; j < this.roleList.length; j++) { // this.roleList[{id: 3,name: "前端"},{...}]
            if (this.roleList[j].id === arr[i]) {
              name.push(this.roleList[j].name)
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
    // 前端删除角色，判断data是否为数组，
    delRole(data) {
      if (Array.isArray(data) && data.length !== 0) {
        data.forEach(ele => {
          this.roleList = this.roleList.filter(val => val.id !== ele);
          this.roleList_copy = this.roleList_copy.filter(val => val.id !== ele);
        });
      } else if (data !== '' && data !== null && data !== undefined && data.length !== 0) {
        this.roleList = this.roleList.filter(val => val.id !== data); // table上实际展示的用户
        this.roleList_copy = this.roleList_copy.filter(val => val.id !== data) // 实际上删除的用户
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
      // 根据搜索结果是否为空，更新roleList对象数组
      !item ? this.getroleid() : this.roleList = item
    },
    confirm() {
      this.roleList = this.roleList_copy // table显示实际上角色列表数据
      this.$confirm("确认保存吗？", "询问", {
        confirmButtonText: "确认", // 点击确认按钮之后会触发.then()
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        // 发送修改角色请求
        const tabledata = this.roleList_copy.map(a => a.id);
        const param = {
          userId: this.item.id,
          roleId: tabledata.toString()
        }
        this.updateUserRole(param) // 点击提交后发送后端请求
        // 跟新store里的用户当前所属角色

        this.cancel();// 关闭dialog弹窗
      }).catch(() => {
        console.log("cancel");
      })
    },
    cancel () {
      this.visible = false;
      this.$refs.search.searchString = '';
    },
    updateUserRole(param) {
      updateUserRole(param).then(res => {
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
