<template>
  <el-dialog
    id="roleresource-dialog"
    ref="roledialog"
    width="70%"
    height="100%"
    :title="'角色【'+role.name+'】的资源权限：'"
    :visible.sync="visable"
    :lock-scroll="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <search-component ref="search" :tablelist="oldmenuList_copy" :search-states="searchStates" @onSearch="(item)=>handleSearchChange(item)" />
    
    <el-table
      ref="multipleTable"
      border
      :data="oldmenuList"
      tooltip-effect="dark"
      size="mini"
      height="20rem"
      :header-cell-style="headerStyle"
      @selection-change="handleSelectionChange"
      @select="SelectRow"
      @select-all="selectall"
      @cell-mouse-enter="mouseEnter"
    >
      <el-table-column type="index" label="序号" center :width="columnStyle(55,55,55)" />
      <el-table-column prop="name" label="权限名称" center :width="columnStyle(200,100,90)" />
      <el-table-column prop="type" label="类型" :width="columnStyle(200,100,90)" />
      <el-table-column label="权限" prop="childPerms">
        <template slot-scope="scope">
          <el-checkbox-group v-model="scope.row.perms" style="padding:0 1rem">
            <el-checkbox-button
              v-for="item in scope.row.childPerms"
              :key="item.type"
              :label="item.name"
            >{{ item.name }}</el-checkbox-button>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="columnStyle(180,160,150)">
        <template slot="header">
          <el-button type="warning" size="mini" @click="allcopy">全权限</el-button>
          <el-button type="danger" size="mini" @click="alluncheck">全不选</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="warning" @click="copy(scope.$index)">全选</el-button>
          <el-button type="danger" @click="uncheck(scope.$index)">不选</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel">取消</el-button>
      <el-button type="success" plain @click="updateRolesPerms">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getRolepermslist, updateRolesPerms } from "@/api/role";
import { headerStyle, columnStyle } from '@/utils/style'
import SearchComponent from '@/components/common/Search/index'
export default {
  components: {
    SearchComponent
  },
  props: {
    title: {
      type: String,
      default: "权限编辑"
    }
  },
  data () {
    return {
      rolemenu: {},
      visable: false,
      multipleSelection: [],
      delselection: [],
      menuList: [],
      oldmenuList: [],
      oldmenuList_copy: [],
      role: {},
      focesedData: '',
      searchStates: []
    }
  },
  watch: {
    visable () {
      if (this.visable === true) {
        this.getRolepermslist();
      }
    }
  },
  methods: {
    open (role) {
      this.visable = true;
      if (role === undefined || role === null) {
        this.role = {};
      } else {
        this.role = Object.assign({}, role);
        this.getRolepermslist();
      }
    },
    headerStyle,
    columnStyle,
    // 对外暴露的接口
    // toggleSelection () {
    //   this.menuList.forEach(row => {
    //     if (row.roleid !== null) {
    //       this.$refs.multipleTable.toggleRowSelection(row, true);
    //     }
    //     if (row.perms === null) {
    //       row.perms = []
    //     }
    //   });
    //   console.log(this.menuList)
    // },
    getRolepermslist(param) {
      const para = { rid: this.role.id };
      getRolepermslist(para).then(res => {
        // console.log(res.data)
        var temp = res.data;
        temp.forEach(ele => {
          if (ele.perms === null || ele.perms === undefined || ele.perms === '') {
            ele.perms = []
          }
          // 对于没有资源授权的角色，显示资源列表为空
          // if (ele.perms.length === 0 || ele.perms.length === undefined || ele.perms.length === null) {
          //   ele.childPerms = [];
          // }
        })
        this.menuList = temp;
        this.oldmenuList = temp;
        this.oldmenuList_copy = temp;
        // 匹配搜索建议
        this.searchStates = [];
        temp.forEach(ele => {
          const value = { value: ele.name }
          this.searchStates.push(value)
        })
      })
    },
    updateRolesPerms () {
      this.$confirm("确认提交吗？", "询问", {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {
        this.menuList.forEach(item => {
          delete item.name
          delete item.type
          delete item.childPerms
          delete item.permission
        })
        var list = this.menuList;

        const para = { list: list, rid: this.menuList[0].rid }
        updateRolesPerms(para).then(res => {
          if (res.code == '200') {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.getRolepermslist();
            this.visable = false;
          }
        })
      });
    },
    cancel () {
      this.$emit("OnCancel", this.item);
      this.visable = false;
      this.$refs.search.searchString = '';
    },
    copy (index) {
      // console.log(this.menuList[index].perms)
      // console.log(this.permission)
      // console.log(this.menuList[index].perms === this.permission)
      // if (this.menuList[index].perms !== this.permission) {
      //   this.$set(this.menuList[index], "perms", this.permission)
      // } else {
      //   this.$set(this.menuList[index], "perms", [])
      // }
      this.menuList[index].perms = [];
      this.menuList[index].childPerms.forEach(ele => {
        this.menuList[index].perms.push(ele.name)
      })
    },
    allcopy () {
      this.menuList.forEach(item => {
        // if (this.ifallcopy) {
        //   this.$set(element, "perms", this.permission)
        // } else {
        //   this.$set(element, "perms", [])
        // }
        item.perms = [];
        item.childPerms.forEach((ele, idx) => {
          item.perms.push(ele.name);
        })
      });
      // this.ifallcopy = !this.ifallcopy
    },
    uncheck(index) {
      this.menuList[index].perms = [];
    },
    alluncheck() {
      this.menuList.forEach((item) => {
        item.perms = []
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    SelectRow (val, row) {
      if (val.indexOf(row) === -1 && this.delselection.indexOf(row) === -1) {
        this.delselection.push(row);
      } else if (val.indexOf(row) !== -1 && this.delselection.indexOf(row) !== -1) {
        this.delselection.splice(row);
      }
    },
    selectall (val) {
      if (val.length === 0) {
        this.delselection = this.menuList
      }
      console.log(this.delselection)
    },
    mouseEnter(data) {
      this.focesedData = Object.assign({}, data);
      // console.log(data)
    },
    handleChange(val) {
    //   var perm = this.perm;
    //   this.menuList.forEach(item => {
    //     if (item === perm) {
    //       item.addp.push(val)
    //     }
    //   })
    },
    handleSearchChange(item) {
      !item ? this.getRolepermslist() : this.oldmenuList = item;
    }
  }
}
</script>

<style lang="scss">
// 资源权限
  #roleresource-dialog{
  .el-table{
    tbody{
      tr{td:nth-child(4){text-align:left;}}
  }}
}
</style>
