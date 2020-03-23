<template>
  <el-dialog id="sigin-detail-dialog" :title="item.user_name + ' 出勤详情'" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false" width="50%">
    <el-table
      :data="tableData"
      stripe
      height="99%">
      <el-table-column
        prop="docDate"
        label="日期"
        align="center"/>
      <el-table-column
        label="打卡记录"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time }}</span>
          <span>--</span>
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="工作时长"
        align="center">
        <span slot-scope="scope">{{ scope.row.workday }}</span>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <el-button type="warning" plain @click="cancel('dataForm')">取消</el-button>
    </span>

  </el-dialog>
</template>
<script>

import PageComponent from '@/components/common/Pagenation/index'
export default {
  components: {
    PageComponent
  },
  props: {
    title: {
      type: String,
      default: 'title'
    }
  },
  data () {
    return {
      item: {},
      visible: false,
      page: {
        currentPage: 0,
        pageSize: 0,
        totalSize: 0,
        totalPage: 0
      },
      // 个人出勤详情的数据
      tableData: [{
        "docDate": "2018-05-30",
        "create_time": 1527647626,
        "email": "xiaotao.lei@ihandysoft.com",
        "id": "xiaotao.lei@ihandysoft.com2018-05-30",
        "is_changed": true,
        "original_duration": 45972,
        "status": "normal",
        "update_time": 1527665339,
        "duration": 45972,
        "end_time": "21:21",
        "start_time": "07:34",
        "workday": 0
      },
      {
        "docDate": "2018-05-29",
        "create_time": 1527667635,
        "email": "xiaotao.lei@ihandysoft.com",
        "id": "xiaotao.lei@ihandysoft.com2018-05-29",
        "is_changed": true,
        "original_duration": 45972,
        "status": "normal",
        "update_time": 1527667635,
        "duration": 45972,
        "end_time": "21:21",
        "start_time": "07:34",
        "workday": 1
      },
      {
        "docDate": "2018-05-28",
        "create_time": 1527561778,
        "email": "xiaotao.lei@ihandysoft.com",
        "id": "xiaotao.lei@ihandysoft.com2018-05-28",
        "is_changed": true,
        "original_duration": 0,
        "status": "exchange",
        "update_time": 1527561778,
        "duration": 0,
        "end_time": "",
        "start_time": "",
        "workday": 1
      },
      {
        "docDate": "2018-05-26",
        "create_time": 1527647620,
        "email": "xiaotao.lei@ihandysoft.com",
        "id": "xiaotao.lei@ihandysoft.com2018-05-26",
        "is_changed": false,
        "original_duration": 36587,
        "status": "normal",
        "update_time": 1527647620,
        "duration": 36587,
        "end_time": "20:33",
        "start_time": "09:23",
        "workday": 1
      },
      {
        "docDate": "2018-05-23",
        "create_time": 1527647611,
        "email": "xiaotao.lei@ihandysoft.com",
        "id": "xiaotao.lei@ihandysoft.com2018-05-23",
        "is_changed": false,
        "original_duration": 40214,
        "status": "patch",
        "update_time": 1527647611,
        "duration": 40214,
        "end_time": "21:43",
        "start_time": "09:32",
        "workday": 1
      }]

    }
  },
  methods: {
    // 对外暴露的接口
    open (item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {}
      } else {
        this.item = item
        // this.getsiginlist({ id: this.item.id })
      }
    },
    getsiginlist(para) {
      // 根据用户id获取考勤信息
    },
    handlePageChange(item) {
      // 发送分页查询请求
      // const para = { currentPage: item.currentPage, pageSize: item.pageSize }
      // this.getsiginlist(para);
    },
    cancel() {
      this.visible = false;
      // this.newStatus = ''
      // this.$refs[dataForm].resetFields();
    }
  }
}
</script>
