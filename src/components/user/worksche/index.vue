<template>
  <div id="worksche">
    <div class="container">
      <div class="handle-box">
        <!-- <el-date-picker
          v-model="searchForm.date"
          align="right"
          type="month"
          placeholder="月度"
        /> -->
        <el-select v-model="searchForm.dep" placeholder="请选择部门" filterable clearable>
          <el-option
            v-for="item in deptlist"
            :key="item.id"
            :value="item.name"
            :label="item.name"
          />

        </el-select>
        <el-select v-model="searchForm.type" filterable clearable placeholder="请选择班别">
          <el-option
            v-for="item in stylelist"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
          </el-option>
        </el-select>
        <el-input v-model="searchForm.name" clearable placeholder="员工姓名" />
        <el-input v-model="searchForm.number" clearable placeholder="员工工号" />
        <el-button type="success" icon="el-icon-search" plain @click="onSearch()">搜索</el-button>
        <el-button type="warning" icon="el-icon-download" plain @click="getExcel">导出EXCEL</el-button>
      </div>
      <el-date-picker
        v-model="searchForm.date"
        :clearable= "false"
        type="month"
        class="datepicker"
        @change="onSearch"
      />
      <span style="font-weight:bold">{{ showdate }}</span>
      <span v-for=" item in stylelist" :key="item.id" style="margin: auto .5rem">{{ item.code }}班({{ item.name }}): {{ item.start_time }}--{{ item.end_time }}</span>
      <el-table
        :data="workschelogs"
        stripe
        height="68%">
        <el-table-column label="员工信息">
          <el-table-column
            :width="columnStyle(65,55,55)"
            label="工号"
            prop="empcode"
          />
          <el-table-column
            :width="columnStyle(null,null,null)"
            label="姓名"
            prop="name"
          />
          <el-table-column
            :width="columnStyle(null,null,null)"
            label="部门"
            prop="dept"
          />
        </el-table-column>

        <el-table-column
          v-for=" (index,idx) in weeks"
          :key="idx"
          :label="'第' + index +'周'"
        >
          <!-- 第一周 且 天数<7 -->
          <template v-if="index == 1 && firstday != 7" >
            <el-table-column
              v-for="(i,idx) in firstday "
              :key="idx"
              :label="i.toString()"
              :prop="'day' + i.toString()"
              :width="columnStyle(40,34,28)"
              :class-name="i === firstday ?'style6':''"
            >
              <el-input slot-scope="scope" v-model="scope.row['day' + i.toString()]" @change="handleEditChange" />
            </el-table-column>
          </template>
          <!-- 最后一周 且 天数!=0 -->
          <template v-else-if="index == weeks && lastday != 0">
            <el-table-column
              v-for="(i,idx) in lastday "
              :key="idx"
              :label="(firstday + (7 * (index - 2)) + i).toString()"
              :prop="'day' + (firstday + (7 * (index - 2)) + i).toString()"
              :width="columnStyle(40,34,28)"
              :class-name="i === 1 ?'style0':''"
            >
              <el-input slot-scope="scope" v-model="scope.row['day' + (firstday + (7 * (index - 2)) + i).toString()]" @change="handleEditChange" />
            </el-table-column>
          </template>
          <!-- 一般情况 且 每周7天 -->
          <template v-else>
            <el-table-column
              v-for="(i,idx) in 7 "
              :key="idx"
              :label="(firstday + (7 * (index - 2)) + i).toString()"
              :prop="'day' + (firstday + (7 * (index - 2)) + i).toString()"
              :width="columnStyle(40,34,28)"
              :class-name=" i==1 || i == 7 ? i == 1 ? 'style0':'style6': ''"
            >
              <el-input slot-scope="scope" v-model="scope.row['day' + (firstday + (7 * (index - 2)) + i).toString()]" @change="handleEditChange" />
            </el-table-column>
          </template>
        </el-table-column>
        <el-table-column
          :width="columnStyle(200,120,120)"
          prop="control"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click.stop="$refs.adddialog.open(scope.row,days,firstday,lastday,weeks)"
            >排班</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click.stop="cleanData(scope.row,days)"
            >清空</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin-top:.6rem;" type="warning" size="medium" icon="el-icon-success" @click="DoSaveData()">保存数据</el-button>
      <page-component :total="workschelogs.length" :page="page" @pageChange="(item)=>handlePageChange(item)" />
    </div>
    <add-dialog ref="adddialog" title="排班计划" @OnConfirm="(item)=>DoSaveData(item)" />
  </div>
</template>
<script>
import PageComponent from '@/components/common/Pagenation/index'
import AddDialog from './add-dialog'
import { columnStyle } from '@/utils/style'
// import { donwnloadExcel } from '@/utils/index'
export default {
  components: {
    PageComponent,
    AddDialog
  },
  data() {
    return {
      searchForm: {
        date: new Date(),
        dept: '',
        type: '',
        number: ''
      },
      page: {
        currentPage: 0,
        pagesize: 0,
        totalPage: 0,
        totalSize: 0
      },
      showdate: '', // 显示日期
      days: 0, // 当月天数
      firstday: 0, // 第一周几天
      lastday: 0, // 最后一周几天
      weeks: 0, // 一个月多少周
      editModeEnabled: true, // 编辑按钮
      workschelogs: [],
      deptlist: [
        {
          id: 1,
          name: '财务部'
        },
        {
          id: 2,
          name: 'IT部'
        },
        {
          id: 3,
          name: '采购部'
        },
        {
          id: 4,
          name: '财务部'
        },
        {
          id: 5,
          name: '财务部'
        }
      ],
      stylelist: [
        {
          id: 1,
          name: "职能常白班",
          code: "A",
          start_time: '08:00',
          end_time: '18:00'
        },
        {
          id: 2,
          name: "工程师早班",
          code: "B",
          start_time: '08:00',
          end_time: '12:00'
        },
        {
          id: 3,
          name: "工程师中班",
          code: "C",
          start_time: '14:00',
          end_time: '18:00'
        },
        {
          id: 4,
          name: "工程师晚班",
          code: "D",
          start_time: '19:00',
          end_time: '07:00'
        }
      ],
      isContentSave: false // 判断数据修改是否保存
    }
  },
  mounted() {
    this.createtable(new Date());
    this.handleReload();
    this.getworkschelogs();
  },
  // 页面跳转未保存数据提示
  beforeRouteLeave: function(to, from, next) {
    if (!this.isContentSave) {
      next();
    } else {
      this.$confirm('您还没有保存内容，确定离开吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
        })
    }
  },
  methods: {
    columnStyle,
    // 刷新页面未保存数据提示
    handleReload() {
      window.onbeforeunload = e => {
        if (!this.isContentSave) {
          return;
        }
        e.preventDefault();
        e.returnValue = '';
      };
    },
    // 监听内容改变isContentSave的状态
    handleEditChange(newVal) {
      this.isContentSave = true
    },
    onSearch() {
      console.log(this.searchForm)
      this.createtable(this.searchForm.date)
      if (this.isContentSave) {
        this.$confirm('您还没有保存内容', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          lockScroll: false
        })
          .then(() => {
            this.workschelogs.forEach(ele => {
              for (var key in ele.date) {
                ele.date[key] = ""
              }
            })
            this.createtable(this.searchForm.date);
          })
          .catch(() => {
            return false
          });
        this.isContentSave = false;
      } else {
        this.workschelogs.forEach(ele => {
          for (var key in ele.date) {
            ele.date[key] = ""
          }
        })
        this.createtable(this.searchForm.date);
      }
      // 发送搜索请求
      // if (this.searchForm.date === '') {
      //   this.$message.warning("查询条件不能为空！");
      //   return;
      // }
    },
    getworkschelogs() {
      const data = [
        {
          id: 1,
          empcode: '111111',
          dept: '工程B部',
          name: 'AAA',
          day1: 'A',
          day2: 'A',
          day3: 'A',
          day4: 'A',
          day5: 'A',
          day6: 'A',
          day7: 'A',
          day8: 'A',
          day9: 'A',
          day10: 'A',
          day11: 'A',
          day12: 'A',
          day13: 'A',
          day14: 'A',
          day15: 'A',
          day16: 'A',
          day17: 'A',
          day18: 'A',
          day19: 'A',
          day20: 'A',
          day21: '',
          day22: '',
          day23: '',
          day24: '',
          day25: '',
          day26: '',
          day27: '',
          day28: '',
          day29: '',
          day30: '',
          day31: ''
        },
        {
          id: 2,
          empcode: '22222',
          dept: '工程D部',
          name: 'BBB',
          day1: 'b',
          day2: 'b',
          day3: 'b',
          day4: 'b',
          day5: 'b',
          day6: 'b',
          day7: 'b',
          day8: 'b',
          day9: 'b',
          day10: 'c',
          day11: 'c',
          day12: 'c',
          day13: 'c',
          day14: 'c',
          day15: 'c',
          day16: 'c',
          day17: 'c',
          day18: 'c',
          day19: 'c',
          day20: 'c',
          day21: 'c',
          day22: 'c',
          day23: 'c',
          day24: 'c',
          day25: 'c',
          day26: 'c',
          day27: 'c',
          day28: 'c',
          day29: 'c',
          day30: 'c',
          day31: 'c'
        }
      ]
      this.workschelogs = data;
      this.oldLogs = data;
    },
    createtable(date) {
      var Y = date.getFullYear().toString()
      var M = date.getMonth().toString() // 第一个月（1 月）是月号 0，因此 12 月返回月号 11
      var Mshow = (date.getMonth() + 1).toString()
      this.showdate = Y + '年' + Mshow + '月'

      this.days = new Date(Y, Mshow, 0).getDate() // new Date(Y,3,0).getDate() 返回值3月份天数
      this.firstday = 7 - new Date(Y, M, "1").getDay() // 获取第一周天数,new Date(Y,2,1).getDay() 判断3月1为星期几，
      this.lastday = (this.days - this.firstday) % 7 // 获取最后一周天数
      const num = parseInt((this.days - this.firstday) / 7)
      this.weeks = this.lastday === 0 ? num + 1 : num + 2 // 一个月几周
      console.log(this.days, this.firstday, this.weeks, this.lastday)
    },
    handlePageChange(item) {
      console.log(item.pageSize, item.currentPage)
      // 发送分页查询请求
      this.currentPage = item.currentPage;
      this.pagesize = item.pageSize;
    },
    DoSaveData(item) {
      console.log(item)
      // 发送数据保存
      // console.log(this.workschelogs)
      // this.workschelogs.forEach((ele, index) => {
      //   if (ele.id === item.id) {
      //     this.workschelogs[index] = item;
      //     this.isContentSave = true
      //   }
      // })
    },
    cleanData(item, days) {
      for (var i = 1; i <= days; i++) {
        item['day' + i] = ''
      }
      console.log(item, this.workschelogs)
    },
    // 导出后端返回数据
    getExcel (param) {
      // getExcel(param).then(res => {
      //   const filename = "假种明细";
      //   var exceldata = res.data;
      //   const tHeader = [
      //     "假种名称",
      //     "假种代码",
      //     "请假日期上限"
      //   ];
      //   const filterVal = [
      //     "name",
      //     "code",
      //     "standday"
      //   ];
      //   donwnloadExcel(filename, tHeader, filterVal, exceldata)
      // })
    }
  }
}
</script>
<style lang="scss">
.el-table .cell{
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
.datepicker{
  width: 150px !important;
  .el-input__inner{
    border: none !important;
  }
  .el-input__suffix {
    display: none;
  }
  .el-input{
    width: 100px;
  }
}
.style0{
  background:#d6f1eb;
  .el-input__inner{
    background:#d6f1eb
  }
  }
.style6{
  background:#e2b2b2;
  .el-input__inner{
    background:#e2b2b2
  }
}
#worksche{
  .el-table{
    .el-input{
      .el-input__inner{
        border:0px!important;
        padding:0 .1rem
      }
    }
  }
}
</style>
