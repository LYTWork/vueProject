<template>
  <div id="signagin">
    <div class="container">
      <el-calendar id="calendar" :first-day-of-week="7">
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
          <!--自定义内容-->
          <div>
            <div class="calendar-day" >{{ data.day.split('-').slice(2).join('-') }}</div>
            <div v-for="item in attendance" :key="item.key" @click.stop="select(item)">
                <div v-if="(item.date).indexOf(data.day)!=-1" @click.stop="select(item)">
                  <span v-for="(val,_in) in item.type" :key="_in" @click.stop="select(item)">
                    <span class="node" v-if="val==0"></span>
                    <span v-if="val==1" class=" blue" @click.stop="select(item)">加</span>
                    <span v-if="val==2" class=" purple" @click.stop="select(item)">差</span>
                    <span v-if="val==3" class=" yellow" @click.stop="select(item)">假</span>
                    <span v-if="val==4" class=" green" @click.stop="select(item)">节</span>
                  </span>
                </div>
                <div v-else />
            </div>
          </div>
        </template>
      </el-calendar>
      <div v-show="showFlag" style="float: right;width: 39%;border-left: 1px solid #E6E6EB;height: 284px;margin-top: 8px;text-align: center;">
                <div>
                    <div style="color: #5AC8FA;font-size: 54px;">{{showdata.day}}</div>
                    <div style="color: #75787B;font-size: 18px;">{{showdata.year}}年{{showdata.month}}月</div>
                    <div style="color: #FF4C4D;font-size: 16px;margin-top: 6px;">出勤状态：<span v-for="type in showdata.type">{{type}}/</span></div>
                    <div v-for="item in showdata.value">
                      <div style="margin-top: 16px;"><span :class="item.isflag ? 'normal' : 'abnormal'" >{{item.namevalue}}</span></div>
                    </div>
                    
                </div>
            </div>
    </div>
  </div>
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
      // value3: new Date().setMonth(new Date().getMonth() - 1),
      showdata: {
      },
      visable: false,
      showFlag: false,
      base_title: {
        week1: [],
        week2: [],
        week3: [],
        week4: [],
        week5: [],
        week6: []
      }, // 动态表头信息（每月天数）
      tableData: [], // 个人信息
      workdata: [], // 排班信息
      currentPage: 1,
      pagesize: 10,
      attendance: [
        { date:'2020-03-01',
                type:[1,2],// 0、代表异常 1、代表加班 2、出差 3、假期 4、节日;
                num:4,//2、代表一天打两次卡 4、代表一天打四次卡
                value:[
                    {
                        isflag:true,//正常
                        namevalue:"上午上班/08:35:00(正常)"
                    },
                    {
                        isflag:false,//异常
                        namevalue:"上午下班/08:35:00(早退)"
                    },
                    {
                        isflag:true,
                        namevalue:"下午上班/---"
                    },
                    {
                        isflag:true,
                        namevalue:"下午下班/---"
                    },
                ] },{
                date:'2020-03-02',
                type:[0],// 0、代表异常 1、代表加班 2、出差 3、假期 4、节日;
                num:2,//2、代表一天打两次卡 4、代表一天打四次卡
                value:[
                    {
                        isflag:true,//正常
                        namevalue:"上班/08:35:00(正常)"
                    },
                    {
                        isflag:false,//异常
                        namevalue:"下班/08:35:00(早退)"
                    },
                    
                ]
        
            },{
                date:'2020-03-08',
                type:[3],// 0、代表异常 1、代表加班 2、出差 3、假期 4、节日;
                num:2,//2、代表一天打两次卡 4、代表一天打四次卡
                value:[
                    {
                        isflag:true,//正常
                        namevalue:"上班/08:35:00(正常)"
                    },
                    {
                        isflag:false,//异常
                        namevalue:"下班/08:35:00(早退)"
                    },
                    
                ]
        
            },{
                date:'2020-03-09',
                type:[4],// 0、代表异常 1、代表加班 2、出差 3、假期 4、节日;
                num:2,//2、代表一天打两次卡 4、代表一天打四次卡
                value:[
                    {
                        isflag:true,//正常
                        namevalue:"上班/08:35:00(正常)"
                    },
                    {
                        isflag:false,//异常
                        namevalue:"下班/08:35:00(早退)"
                    },
                    
                ]
        
            },{
                date:'2020-03-07',
                type:[1],// 0、代表异常 1、代表加班 2、出差 3、假期 4、节日;
                num:2,//2、代表一天打两次卡 4、代表一天打四次卡
                value:[
                    {
                        isflag:true,//正常
                        namevalue:"上班/08:35:00(正常)"
                    },
                    {
                        isflag:false,//异常
                        namevalue:"下班/08:35:00(早退)"
                    },
                    
                ]
        
            }]
    }
  },
  mounted() {
  },
  methods: {
    select(data){
      this.showFlag = true
      console.log(data)
      this.showdata = {year: '',
        month: '',
        day:'',
        type:[]
        }
      this.showdata.num = data.num;
      this.showdata.value = data.value;
      var now = new Date(data.date);
      this.showdata.year = now.getFullYear(); //得到年份
      this.showdata.month = now.getMonth()+1;//得到月份
      this.showdata.day = now.getDate();//得到日期
      data.type.forEach(element => {
        switch(element){
          case 0: this.showdata.type.push('异常');
          break;
          case 1: this.showdata.type.push('加班');
          break;
          case 2: this.showdata.type.push('出差');
          break;
          case 3: this.showdata.type.push('假期');
          break;
          case 4: this.showdata.type.push('节日');
          break;
        }
        
      });
    }
  }
}
</script>
<style lang="scss" scoped>
// 日历样式calendar-day-worksche
.is-leaf{
  padding:.5rem 0 0 0!important;
}
.el-calendar__title {
  font-weight: bold;
}
.el-calendar{
  // margin: 2rem;
  width:50%;
  text-align:center;
  float:left;
}
.node{
  position: absolute;
  top: 4px;
  right: 1px;
  border-radius: 100%;
  width: 6px;
  height: 6px;
  background: red;
}
.purple{
  color: #a98be2;
  font-size: 13px;
}
.blue{
  color: #0089FA;
  font-size: 13px;

}
.green{
  color: #00A753;
  font-size: 13px;

}
.yellow{
  color: #FF9500;
  font-size: 13px;
}
.el-table{
  width:65%;
  float:right;
  margin-top: 4rem;
}
.normal{
  color: #2D2D2D;
  font-size: 15px;
}
.abnormal{
  color: #FF4C4D;
  font-size: 15px;
}
</style>
<style lang="scss">
.el-calendar-table {
  .el-calendar-day {
    position: relative;
    // height: 80px!important;
  }
  td {
    &.is-today {
      .calendar-day {
        font-size: 17px;
        color: rgb(80, 147, 185);
      }
      // background-color: #0089FA;
    }
  }
}
.el-calendar-table thead th:first-child,.el-calendar-table thead th:last-child {
  color: rgb(129, 168, 219);
}
.el-tabs__content{
    overflow: auto;
    height: 74vh
    }
.calendar-day {
  text-align: center;
  line-height: 30px;
  font-size: 15px;
}
.is-selected {
  color: #9096a1;
  font-size: 0.7rem;
  margin-top: 10px;
}
.el-calendar {
  .el-button-group {
    & > .el-button {
      &:not(:first-child):not(:last-child):after {
        content: '当月';
      }
    }
  }
}

</style>
