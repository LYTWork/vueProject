<template>
  <el-dialog
    id="edit-dialog"
    :title="title"
    :visible.sync="visable"
    :lock-scroll="false"
    width="70%"
    top="5.5rem"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-form ref="dataForm1" inline :model="item" :rules="rules" label-width="90px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="item.name" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="item.gender" label="男" border size="medium">男</el-radio>
        <el-radio v-model="item.gender" label="女" border size="medium">女</el-radio>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="item.mobile" />
      </el-form-item>
      
      
      
    </el-form>
    <el-form ref="dataForm2" inline :model="item" :rules="rules" label-width="90px">
      <el-form-item label="学历" prop="education">
        <el-select v-model="item.education" placeholder="请选择学历">
          <el-option
            v-for="ele in educationlist"
            :key="ele.value"
            :label="ele.label"
            :value="ele.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="政治面貌">
        <el-select v-model="item.polity" placeholder="请选择政治面貌">
          <el-option
            v-for="ele in politylist"
            :key="ele.value"
            :label="ele.label"
            :value="ele.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="婚姻状况">
        <el-select v-model="item.married" placeholder="请选择政治面貌">
          <el-option
            v-for="ele in marriedlist"
            :key="ele.value"
            :label="ele.label"
            :value="ele.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form ref="dataForm3" inline :model="item" :rules="rules" label-width="90px">
      <el-form-item label="身份证号" prop="card">
        <el-input v-model="item.card" />
      </el-form-item>
      <el-form-item label="籍贯" prop="nativeName">
        <el-input v-model="item.nativeName" />
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          v-model="item.birthday"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions0"
        />
      </el-form-item>
    </el-form>
    <el-form ref="dataForm4" inline :model="item" :rules="rules" label-width="90px">
      <el-form-item label="部门" prop="dep">
        <el-select v-model="item.dep" placeholder="请选择部门">
          <el-option v-for="ele in deptlist" :key="ele.name" :label="ele.name" :value="ele.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="职务" prop="title">
        <el-input v-model="item.title" />
      </el-form-item>
      <el-form-item label="工号" prop="empNum">
        <el-input v-model="item.empNum" />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-select v-model="item.status" placeholder="请选择状态">
          <el-option label="在职" value="在职" />
          <el-option label="离职" value="离职" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职日期" prop="inDate">
        <el-date-picker
          v-model="item.inDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="离职日期" prop="otDate">
        <el-date-picker
          v-model="item.otDate"
          :disabled="item.status == '在职'"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        />
      </el-form-item>
    </el-form>
    <el-form ref="dataForm5" inline :model="item" label-width="90px">
      
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="item.email" />
      </el-form-item>
      <el-form-item label="户籍地址">
        <el-input v-model="item.addr1" />
      </el-form-item>
      <el-form-item label="现住址" prop="addr2">
        <el-input v-model="item.addr2" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button
        type="warning"
        plain
        @click="cancel(['dataForm1','dataForm2','dataForm3','dataForm4','dataForm5'])"
      >取消</el-button>
      <el-button
        type="success"
        plain
        @click="confirm(['dataForm1','dataForm2','dataForm3','dataForm4','dataForm5'])"
      >提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { querydept } from "@/api/dept";
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    const cheackCard = (rule, value, callback) => {
      if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) == false) {
        callback(new Error("你的身份证格式不正确"));
      } else {
        // callback();
        // 获取出生日期
        var birth =
          value.substring(6, 10) +
          "-" +
          value.substring(10, 12) +
          "-" +
          value.substring(12, 14);
        this.$set(this.item, "birthday", birth); // 动态添加
      }
    };
    return {
      // birthday: null,
      item: {},
      visable: false,
      value1: "",
      radio: "",
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        dep: [{ required: true, message: "请选择部门", trigger: "blur" }],
        title: [{ required: true, message: "请输入职务", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        empNum: [{ required: true, message: "请输入工号", trigger: "blur" }],
        card: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: cheackCard, trigger: "blur" }
        ],
        mobile: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^(\+86)?1[3|4|5|7|8][0-9]{9}$/,
            message: "你的手机号格式不正确",
            trigger: "blur"
          }
        ],
        email: [
          { required: false, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: "你的邮箱格式不正确",
            trigger: "blur"
          }
        ]
      },
      deptlist: [],
      educationlist: [],
      marriedlist: [],
      politylist: []
    };
  },
  mounted() {
    this.querydept();
  },
  methods: {
    open(item) {
      this.visable = true;
      if (item === undefined || item === null) {
        this.item = {};
        this.$set(this.item, "status", "在职");
      } else {
        this.item = item;
      }
    },
    getFormPromise(form) {
      return new Promise(resolve => {
        this.$refs[form].validate(valid => {
          if (valid) resolve();
        });
      });
    },
    confirm(formArr) {
      Promise.all(formArr.map(ele => this.getFormPromise(ele))).then(res => {
        this.$confirm("确认保存吗？", "询问", {
          cancelButtonText: "取消",
          confirmButtonText: "确认",
          lockScroll: false,
          closeOnClickModal: false,
          type: "warning"
        })
          .then(() => {
            this.$emit("OnConfirm", this.item);
            this.cancel('dataForm')
          })
          .catch(() => false);
      });
    },
    cancel(formArr) {
      this.visable = false;
      formArr.forEach(ele => {
        this.$refs[ele].resetFields();
      });
    },
    querydept() {
      // querydept().then(res => {
      //   this.deptlist = res.data;
      // });
      this.deptlist = [{id: '001',name: '部门a',code: 'a'},
                {id: '002',name: '部门b',code: 'b'},
                {id: '003',name: '部门c',code: 'c'},
                {id: '004',name: '部门d',code: 'd'},
                {id: '005',name: '部门e',code: 'e'},
                {id: '006',name: '部门f',code: 'f'}
                ]
    }
  }
};
</script>
<style lang="scss" scoped>
.el-date-editor,
.el-input,
.el-select {
  width: 185px !important;
}
.el-form-item {
  text-align: left;
}
</style>
