
<template>
  <div id="staff">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.name" clearable placeholder="员工姓名" />
        <el-input v-model="searchForm.code" clearable placeholder="员工工号" />
        <el-select v-model="searchForm.status" clearable placeholder="在职/离职">
          <el-option label="在职" :value="0">在职</el-option>
          <el-option label="离职" :value="1">离职</el-option>
        </el-select>
        <el-button type="success" icon="el-icon-search" plain @click="querystaff(searchForm)">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增员工</el-button>
        <el-button type="danger" icon="el-icon-delete" plain >批量删除</el-button>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
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
              <el-form-item label="身份证号">
                <span>{{ props.row.card }}</span>
              </el-form-item>
              <el-form-item label="入职日期">
                <span>{{ props.row.inDate }}</span>
              </el-form-item>
              <el-form-item label="离职日期">
                <span>{{ props.row.otDate }}</span>
              </el-form-item>
              <el-form-item label="手机号" >
                <span>{{ props.row.mobile }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ props.row.email }}</span>
              </el-form-item>
              <el-form-item label="户籍地址">
                <span>{{ props.row.addr1 }}</span>
              </el-form-item>
              <el-form-item label="现住址">
                <span>{{ props.row.addr2 }}</span>
              </el-form-item>
              
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="55">
          <template slot-scope="scope">
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="性别" prop="gender" width="50" />
        <el-table-column label="工号" prop="empNum" />
        <el-table-column label="部门" prop="depName" />
        <el-table-column label="职务" prop="title" width="90" />
        <el-table-column label="出生日期" prop="birthday" />
        <el-table-column label="婚姻状况" prop="married" width="80" />
        <el-table-column label="政治面貌" prop="polity" width="80" />
        <el-form-item label="学历" prop="education" width="80" />
        <el-table-column label="籍贯" prop="nativeName" width="80" />
        <el-table-column label="人员状态" prop="status" width="80" />
        <el-table-column
          width="140"
          prop="control"
          align="center"
          label="操作"
        >
          <template>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click.stop="$refs.updateDialog.open(focusedData)"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click.stop="delOne(focusedData.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <edit-dialog ref="addDialog" title="新增员工" @OnConfirm="(item)=>addOne(item)" />
      <edit-dialog ref="updateDialog" title="编辑信息" @OnConfirm="(item)=>updateOne(item)" />

    </div>
  </div>
</template>
<script>
import PageComponent from '@/components/common/Pagenation/index'
import EditDialog from './edit-dialog'
import { headerStyle } from '@/utils/style'
import { querydept } from '@/api/dept'
import { querystaff, insertstaff, updatestaff, delstaff } from '@/api/staff'
export default {
  components: {
    PageComponent,
    EditDialog
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
      loading: true,
      allstaff: [],
      focusedData: {}
    }
  },
  mounted() {
    this.querydept();
    this.queryAll(null);
  },
  methods: {
    headerStyle,
    // 获取所有数据
    queryAll(param) {
      querystaff(param).then(res => {
        console.log('员工信息', res);
        if (res.code == '200') {
          this.page.currentPage = res.data.currentPage;
          this.page.pageSize = res.data.size;
          this.page.totalPage = res.data.pages;
          this.page.totalSize = res.data.total;
          this.allstaff = res.data.list;
          this.loading = false
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
    // 添加数据
    addOne(data) {
      const para = data;
      this.handleparams(data);
      insertstaff(para).then(res => {
        if (res.code == 200) {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.queryAll();
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    // 更新数据
    updateOne(item) {
      updatestaff(item).then(res => {
        if (res.code == '200') {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.queryAll()
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      })
    },
    // 删除数据
    delOne(eid) {
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
            this.queryAll();
          }
        })
      })
    },
    querydept() {
      querydept().then(res => {
        // console.log(res)
        this.deptlist = res.data;
      })
    },
    handlePageChange(item) {
      // 发送分页查询请求
      const para = { currentPage: item.currentPage, pageSize: item.pageSize }
      this.queryAll(para);
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
