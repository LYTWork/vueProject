<template>
  <el-dialog id="edit-dialog" ref="resourceDialog" :title="title" :visible.sync="visable" :lock-scroll="false" :close-on-click-modal="false" :show-close="false">
    <el-form ref="rulesForm" :model="item" label-width="110px" :rules="rules">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="item.name" placeholder="请输入资源名称" />
      </el-form-item>
      <el-form-item label="资源链接" prop="url">
        <el-input v-model="item.url" placeholder="请输入资源url" />
      </el-form-item>
      <el-form-item label="资源权限" prop="permission">
        <el-select
          v-model="item.permission"
          multiple
          filterable
          placeholder="请选择资源权限"
          style="width:100%"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="warning" plain @click="cancel">取消</el-button>
      <el-button type="success" plain @click="confirm">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { queryResourceById, updateTimp } from '@/api/resource'
export default {
  props: {
    title: {
      type: String,
      default: "title"
    }
  },
  data() {
    return {
      item: {
        permission: ''
      },
      visable: false,
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        url: [{ required: true, message: " ", trigger: "blur" }],
        permission: [{ required: true, message: " ", trigger: "blur" }]
      },
      options: [
        { value: 'add', label: 'add' },
        { value: 'delete', label: 'delete' },
        { value: 'update', label: 'update' },
        { value: 'query', label: 'query' },
        { value: 'edit', label: 'edit' }
      ]
    };
  },
  methods: {
    // 对外暴露的接口
    open(item) {
      if (item === undefined || item === null) {
        this.visable = true;
        this.item = {};
      } else {
        this.queryResourceById({ id: item.id })
      }
    },
    queryResourceById(param) {
      queryResourceById(param).then(res => {
        if (res.code === 200) {
          this.visable = true;
          res.data.permission = res.data.permission.split(",")
          this.item = res.data;
        }
      });
    },
    confirm() {
      this.$refs["rulesForm"].validate(vali => {
        if (vali) {
          this.$confirm("确认保存吗？", "询问", {
            confirmButtonText: "保存",
            cancelButtonText: "取消",
            type: "warning",
            lockScroll: false,
            closeOnClickModal: false
          }).then(() => {
            // console.log(this.item)
            this.$emit("OnConfirm", this.item);
            this.visable = false;
          });
        } else {
          this.$message({
            message: '请将信息填写完整！',
            type: 'warning'
          })
        }
      })
    },

    cancel() {
      if (this.item.id) {
        updateTimp({ id: this.item.id }).then(res => {
          console.log('取消时间戳', res)
        })
      }
      this.visable = false;
      // this.$refs.resourceDialog.close()
    }
  }
};
</script>

<style lang="scss">
#edit-dialog {
  text-align: left;
  padding: 1rem;
}
</style>
