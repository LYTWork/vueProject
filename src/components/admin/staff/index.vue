
<template>
  <div class="staff">
    <div class="container">
      <el-form label-width="0px" :model="searchForm" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.empNum" placeholder="工号" clearable />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" clearable placeholder="在职/离职">
            <el-option label="在职" :value="0">在职</el-option>
            <el-option label="离职" :value="1">离职</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.inDate"
            type="date"
            placeholder="入职日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item >
          <el-select v-model="searchForm.dep" clearable placeholder="离职日期">
            <el-option v-for="ele in deptlist" :key="ele.id" :label="ele.name" :value="ele.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" plain icon="el-icon-search" @click="getliststaff(searchForm)">搜索数据</el-button>
        </el-form-item>
      </el-form>
      <div class="subtitle-button">
        <el-button type="primary" plain icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增员工</el-button>
      </div>
      <el-table
        border
        :data="allstaff"
        height="82%"
        class="table"
        :header-cell-style="headerStyle"
        @cell-mouse-enter="(data)=>focusedData = Object.assign({}, data)"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="邮编">
                <span>{{ props.row.zipcode }}</span>
              </el-form-item>
              <el-form-item label="户籍地址">
                <span>{{ props.row.addr1 }}</span>
              </el-form-item>
              <el-form-item label="现住址">
                <span>{{ props.row.addr2 }}</span>
              </el-form-item>
              <el-form-item label="入职日期">
                <span>{{ props.row.inDate }}</span>
              </el-form-item>
              <el-form-item label="离职日期">
                <span>{{ props.row.otDate }}</span>
              </el-form-item>
              <el-form-item label="身份证号">
                <span>{{ props.row.card }}</span>
              </el-form-item>
              <el-form-item label="学历">
                <span>{{ props.row.education }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="55">
          <template slot-scope="scope">
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工姓名" prop="name" />
        <el-table-column label="工号" prop="empNum" />
        <el-table-column label="部门" prop="depName" />
        <el-table-column label="职务" prop="title" width="90" />
        <el-table-column label="状态" prop="status" width="55" />
        <el-table-column label="生日" prop="birthday" />
        <el-table-column label="性别" prop="gender" width="70" />
        <el-table-column label="婚姻状况" prop="married" width="80" />
        <el-table-column label="政治面貌" prop="polity" width="80" />
        <el-table-column label="籍贯" prop="nativeName" width="80" />
        <el-table-column label="手机号" prop="mobile" width="90" />
        <el-table-column label="电话1" prop="phone1" width="90" />
        <el-table-column label="电话2" prop="phone2" width="90" />
        <el-table-column label="传真" prop="fax" width="120" />
        <el-table-column label="邮箱" prop="email" width="150" />
        <el-table-column
          width="140"
          prop="control"
          align="center"
          label="操作"
        >
          <template>
            <el-button
              type="warning"
              size="mini"
              plain
              @click.stop="$refs.updateDialog.open(focusedData)"
            >修改</el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              @click.stop="delstaff(focusedData.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <add-dialog ref="addDialog" title="新增员工" @OnConfirm="(item)=>addOne(item)" />
      <add-dialog ref="updateDialog" title="编辑信息" @OnConfirm="(item)=>updateOne(item)" />

    </div>
  </div>
</template>
<script>
import PageComponent from '@/components/common/Pagenation/index'
import AddDialog from './insert-dialog'
import { headerStyle } from '@/utils/style'
import { getdepartList } from '@/api/dept'
import { getliststaff, insertstaff, updatestaff, delstaff } from '@/api/staff'
export default {
  components: {
    PageComponent,
    AddDialog
  },
  data() {
    return {
      item: {},
      isOnjob: '在职',
      deptlist: [],
      searchForm: {
        name: '',
        empNum: '',
        status: '',
        inDate: '',
        dep: ''
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      },
      allstaff: [],
      focusedData: {}
    }
  },
  mounted() {
    this.getdepartList();
    this.getliststaff(null);
  },
  methods: {
    headerStyle,
    // 获取所有员工的信息
    getliststaff(param) {
      getliststaff(param).then(res => {
        console.log('员工信息', res);
        if (res.code == '200') {
          this.page.currentPage = res.data.currentPage;
          this.page.pageSize = res.data.size;
          this.page.totalPage = res.data.pages;
          this.page.totalSize = res.data.total;
          this.allstaff = res.data.list;
        // this.allstaff = this.handleResult(res.data);
        }
      }).catch(err => {
        console.log('请求失败');
        console.log(err)
      })
    },
    handleResult(item) {
      item.forEach(ele => {
        switch (ele.gender) {
          case 0:
            ele.egender = '男';
            break;
          case 1:
            ele.egender = '女';
            break;
        }
        switch (ele.status) {
          case 0:ele.estatus = "在职"; break;
          default: ele.estatus = "离职"; break;
        }
        switch (ele.polity) {
          case 0:
            ele.epolity = "群众";
            break;
          case 1:
            ele.epolity = "团员";
            break;
          case 2:
            ele.epolity = "党员";
            break;
          default:
            ele.epolity = "其它";
            break;
        }
        switch (ele.married) {
          case 0:
            ele.emarried = "已婚";
            break;
          case 1:
            ele.emarried = "未婚";
            break;
          case 2:
            ele.emarried = "离异";
            break;
          default:
            ele.emarried = "丧偶";
            break;
        }
        switch (ele.education) {
          case 0:
            ele.eeducation = "初中";
            break;
          case 1:
            ele.eeducation = "中专";
            break;
          case 2:
            ele.eeducation = "高中";
            break;
          case 3:
            ele.eeducation = "大专";
            break;
          case 4:
            ele.eeducation = "本科";
            break;
          case 5:
            ele.eeducation = "硕士";
            break;
          case 6:
            ele.eeducation = "博士";
            break;
          default:
            ele.emarried = "博士后";
            break;
        }
      });
      return item;
    },
    // /添加员工
    addOne(data) {
      const para = data;
      this.handleparams(data);
      // 没有title和id参数，多了position，接口里面没有这个
      insertstaff(para).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.getliststaff();
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    handleparams(ele) {
      // item.forEach(ele => {
      switch (ele.gender) {
        case '男':
          ele.gender = 0;
          break;
        case '女':
          ele.gender = 1;
          break;
      }
      switch (ele.status) {
        case "在职":ele.status = 0; break;
        default: ele.status = 1; break;
      }
      switch (ele.polity) {
        case "群众":
          ele.polity = 0;
          break;
        case "团员":
          ele.polity = 1;
          break;
        case "党员":
          ele.polity = 2;
          break;
        default:
          ele.polity = 3;
          break;
      }
      switch (ele.married) {
        case "已婚":
          ele.married = 0;
          break;
        case "未婚":
          ele.married = 1;
          break;
        case "离异":
          ele.married = 2;
          break;
        default:
          ele.married = 3;
          break;
      }
      switch (ele.education) {
        case "初中":
          ele.education = 0;
          break;
        case "中专":
          ele.education = 1;
          break;
        case "高中":
          ele.education = 2;
          break;
        case "大专":
          ele.education = 3;
          break;
        case "本科":
          ele.education = 4;
          break;
        case "硕士":
          ele.education = 5;
          break;
        case "博士":
          ele.education = 6;
          break;
        default:
          ele.education = 7;
          break;
      }
      // });
      return ele;
    },
    // /更新数据
    updateOne(item) {
      // console.log(item)
      console.log('up', item)
      updatestaff(item).then(res => {
        if (res.code == '200') {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.getliststaff()
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    // /删除员工
    delstaff(eid) {
      const para = { id: eid }
      console.log(para)
      this.$confirm("确认删除吗？", "询问", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {
        delstaff(para).then(res => {
          if (res.code == '200') {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.getliststaff();
          }
        })
      })
    },
    getdepartList() {
      getdepartList().then(res => {
        // console.log(res)
        this.deptlist = res.data;
      })
    },
    handlePageChange(item) {
      // 发送分页查询请求
      const para = { currentPage: item.currentPage, pageSize: item.pageSize }
      this.getliststaff(para);
    }
  }
}
</script>
<style lang="scss">
.subtitle-button{
  .el-select{
    width:6.3rem!important;
    .el-input__inner{
      color:white;
      background:#E6A23C;
    }
    .el-select__caret{color:white!important}
  }
}
.detail-dialog{
  .el-input__inner{
    border:1px solid #c2e7b0;
  }
}
.table{
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand .el-form-item__label{
    width: 90px;
    color: #909399;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    text-align:left;
    margin-left:3rem
  }
}
</style>
