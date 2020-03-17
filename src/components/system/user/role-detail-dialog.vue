<template>
  <el-dialog
    id="role-detail-dialog"
    :title="title"
    :visible.sync="visable"
    :close-on-click-modal="false"
    :show-close="false"
    :lock-scroll="false"
    custom-class="customWidth"
    append-to-body
    width="50%"
  >
    <search-component ref="search" :tablelist="details_copy" :search-states="searchStates" @onSearch="(item) =>handleSearchChange(item)" />

    <el-table
      :data="details"
      :header-cell-style="headerStyle"
      border
      height="20rem"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      @select-all="selectall"
    >
      <el-table-column :selectable="selectInit" type="selection"/>
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-plus"
            @click="addSelect([scope.row])"
          >添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel">取消</el-button>
      <el-button type="success" plain @click="addSelect(multipleSelection)">添加选中</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { headerStyle } from "@/utils/style";
import { queryRoles } from "@/api/role";
import SearchComponent from "@/components/common/Search/index";
export default {
  components: {
    SearchComponent
  },
  props: {
    title: {
      type: String,
      default: "title"
    },
    existrole: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      visable: false,
      multipleSelection: [], // 选中的数据二维数组
      details: [], // table展示的角色列表
      details_copy: [], // 实现模糊搜索的原始数据
      searchStates: [] // 搜索匹配建议
    };
  },
  methods: {
    headerStyle,
    // 对外暴露的接口
    open() {
      this.visable = true;
      this.queryRoles();
    },
    // 获取新增角色下拉框的角色数据
    queryRoles() {
      queryRoles().then(res => {
        this.details = res.data.list;
        this.details_copy = this.details;
        // 匹配搜索建议
        this.searchStates = [];
        this.details_copy.forEach(ele => {
          const value = { value: ele.name };
          this.searchStates.push(value);
        });
        // [{id: 7,name: "骄傲东"},.....{}]
      });
    },
    addSelect(data) {
      if (data.length === 0) {
        this.$message.error("请先至少选择一项");
      } else {
        this.$emit("OnConfirm", data);
        this.cancel();
      }
    },
    handleSelectionChange(val) {
      var temp = val;
      this.multipleSelection = [];
      if (temp.length !== 0) {
        temp.forEach(item => {
          this.multipleSelection.push(item);
        });
      }
    },
    selectall(val) {
      var temp = val;
      this.multipleSelection = [];
      if (temp.length !== 0) {
        temp.forEach(item => {
          this.multipleSelection.push(item);
        });
      }
    },
    handleSearchChange(item) {
      !item ? this.queryRoles() : (this.details = item);
    },
    cancel() {
      this.visable = false;
      this.$refs.search.searchString = "";
    },
    selectInit(row, index) {
      console.log(2121231, this.existrole)
      if (this.existrole.indexOf(row.id) !== -1) {
        // 判断 test 字符串是否存在于 arr 数组中，存在返回true 否则false，此处将返回true) {
        return false; // 不可勾选
      } else {
        return true; // 可勾选
      }
    }
  }
};
</script>
