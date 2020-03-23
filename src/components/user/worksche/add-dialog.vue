<template>
  <el-dialog id="edit-dialog" :title="title" :visible.sync="visible" :lock-scroll="false" width="50%">
    <span v-for=" item in stylelist" :key="item.id" style="margin: auto .5rem">{{ item.code }}班({{ item.name }}): {{ item.start_time }}--{{ item.end_time }}</span>

    <el-form ref="dataForm" label-width="90px">
      <el-form-item label="班别" prop="type">
        <el-table :data="weekslist" border height="85%">
          <el-table-column
            type="index"
            width="55"
          />
          <el-table-column
            label="周别"
            prop="name"
          >
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column
            label="排班"
            prop="arrange"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.type" placeholder="请选择班别">
                <el-option
                  v-for="(type,_in) in stylelist"
                  :key="_in"
                  :label="type.name"
                  :value="type.code"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel">取消</el-button>
      <el-button type="success" plain @click="confirm">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    return {
      item: {},
      visible: false,
      weekslist: [],
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
      days: 0,
      firstday: 0,
      lastday: 0,
      weeks: 0
    }
  },
  methods: {
    open (item, days, firstday, lastday, weeks) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {};
      } else {
        this.item = item;
        this.days = days;
        this.firstday = firstday;
        this.lastday = lastday;
        this.weeks = weeks;
        for (var i = 1; i <= weeks; i++) {
          var obj = {};
          obj.name = '第' + i + '周';
          this.weekslist.push(obj)
        }
      }
    },
    confirm() {
      this.$confirm("确认保存吗？", "询问", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        lockScroll: false,
        type: "warning"
      }).then(() => {
        for (var wee = 1; wee <= this.weeks; wee++) {
          if (wee === 1) {
            for (var i = 1; i <= this.firstday; i++) {
              this.item['day' + i.toString()] = this.weekslist[wee - 1].type
            }
          } else if (wee === this.weeks) {
            for (var j = 1; j <= this.lastday; j++) {
              this.item['day' + (this.firstday + (7 * (wee - 2)) + j).toString()] = this.weekslist[wee - 1].type
            }
          } else {
            for (var k = 1; k <= 7; k++) {
              this.item['day' + (this.firstday + (7 * (wee - 2)) + k).toString()] = this.weekslist[wee - 1].type
            }
          }
        }
        this.$emit("OnConfirm", this.item);
        this.cancel()
      });
    },
    cancel() {
      this.weekslist = [];
      this.item = {};
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.el-date-editor,.el-select{
  width:185px!important
}
.el-form-item{
  text-align:left
}
</style>
