<template>
  <div id="class">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="searchForm.name" clearable placeholder="班别名称" />
        <el-input v-model="searchForm.code" clearable placeholder="班别代码" />
        <el-button type="success" icon="el-icon-search" plain @click="queryclass(searchForm)">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="$refs.addDialog.open(null)">新增班别</el-button>
        <el-button type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>
        <el-button type="danger" icon="el-icon-delete" plain @click="delAllSelection">批量删除</el-button>

      </div>
      <el-table
        v-loading="loading"
        :data="allclass"
        element-loading-text="拼命加载中"
        stripe
        height="82%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="55">
          <template slot-scope="scope">
            <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班别名称" prop="name" />
        <el-table-column label="班别代码" prop="code" />
        <el-table-column label="开始时间--结束时间" >
          <template slot-scope="scope">
            {{ scope.row.start_time }}--{{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column label="时长（单位:小时）" prop="worktime" />
        <el-table-column
          width="160px"
          prop="control"
          align="center"
          label="操作"
        >
          <template solt-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click.stop="$refs.updateDialog.open()"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click.stop="delclass(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalNum" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <edit-dialog ref="addDialog" title="添加班别" @OnConfirm="(item)=>addOne(item,'post')" />
      <edit-dialog ref="updateDialog" title="编辑信息" @OnConfirm="(item)=>updateclass(item)" />
    </div>
  </div>
</template>
<script>
import editDialog from './edit-dialog'
import PageComponent from '@/components/common/Pagenation/index'
// import { queryclass, insertclass, updateclass, delclass } from '@/api/class'
import { donwnloadExcel } from '@/utils/index'
export default {
  components: {
    PageComponent,
    editDialog
  },
  data() {
    return {
      searchForm: {
        name: '',
        code: ''
      },
      page: {
        currentPage: 0,
        pageSize: 0,
        totalNum: 0,
        totalPage: 0
      },
      loading: false,
      allclass: [
        {
          id: 1,
          name: "职能常白班",
          code: "A",
          start_time: '08:00',
          end_time: '18:00',
          worktime: 10.0
        },
        {
          id: 2,
          name: "工程师早班",
          code: "B",
          start_time: '08:00',
          end_time: '12:00',
          worktime: 4.0
        },
        {
          id: 3,
          name: "工程师中班",
          code: "C",
          start_time: '14:00',
          end_time: '18:00',
          worktime: 4.0
        },
        {
          id: 4,
          name: "工程师晚班",
          code: "D",
          start_time: '19:00',
          end_time: '07:00',
          worktime: 14.0
        }
      ],
      multipleSelection: [] // 多选

    }
  },
  mounted() {
    // this.queryclass(null);
  },
  methods: {
    // 自定义查询所有数据
    queryclass(param) {
      // queryclass(param).then(res => {
      //   if (res.code === 200) {
      //     this.page.currentPage = res.data.currentPage;
      //     this.page.pageSize = res.data.totalpageSize;
      //     this.page.totalPage = res.data.totalPages;
      //     this.page.totalNum = res.data.total;
      //     this.allclass = res.data.list;
      //     this.loading = false
      //   }
      // }).catch(err => {
      //   console.log('请求失败');
      //   console.log(err)
      // })
    },
    // /添加班别数据
    addOne(data, method) {
      // const params = {
      //   name: data.name,
      //   code: data.code,
      // }
      // insertclass(params).then(res => {
      //   if (res.code == 200) {
      //     this.$message({
      //       message: '添加成功',
      //       type: 'success'
      //     });
      //     this.queryclass(null);
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    // 修改班别信息
    updateclass(item) {
      // updateclass(item).then(res => {
      //   if (res.code == '200') {
      //     this.$message({
      //       message: '修改成功！',
      //       type: 'success'
      //     })
      //     this.queryclass(null)
      //   } else {
      //     this.$message({
      //       message: "保存失败，原因：" + res.msg,
      //       type: "danger"
      //     });
      //   }
      // })
    },
    delclass(Cid) {
      // const para = { id: cid }
      // this.$confirm("确认删除吗？", "询问", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   lockScroll: false,
      //   closeOnClickModal: false
      // })
      //   .then(() => {
      //   // /删除班别数据
      //     delclass(para).then(res => {
      //       if (res.code == '200') {
      //         this.$message({
      //           message: '删除成功！',
      //           type: 'success'
      //         });
      //         this.queryclass();
      //       }
      //     })
      //   })
      //   .catch(() => false)
    },

    // 多选操作
    handleSelectionChange(val) {
      console.log(1, val)
      this.multipleSelection = val;
    },
    // 删除所选
    delAllSelection() {
      console.log(this.multipleSelection)
      const length = this.multipleSelection.length;
      let str = '';
      // this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' ';
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    handlePageChange(item) {
      // 发送分页查询请求
      const para = { currentPage: item.currentPage, pageSize: item.pageSize }
      this.queryclass(para);
    },
    // 导出前端选择的数据
    getExcel (param) {
      const filename = "班别明细";
      var exceldata = this.multipleSelection;
      const tHeader = [
        "班别名称",
        "班别代码",
        "开始时间",
        "结束时间",
        "时长"
      ];
      const filterVal = [
        "name",
        "code",
        "start_time",
        "end_time",
        "worktime"
      ];
      donwnloadExcel(filename, tHeader, filterVal, exceldata)
    }
  }
}
</script>
