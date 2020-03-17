<template>
  <el-drawer
    :title="'角色【'+item.name+'】的菜单可见权限：'"
    :visible.sync="visible"
    direction="rtl"
    size="35%">
    <div class="demo-drawer__content">
      <el-tree
        ref="tree"
        :data="menuList"
        :default-checked-keys="defaultChecked"
        :expand-on-click-node="false"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
      >
        >
        <span slot-scope="{ node, data }">{{ data.name }}</span>
      </el-tree>

    </div>
    <div class="demo-drawer__footer">
      <el-button type="warning" plain @click="cancel">取消</el-button>
      <el-button type="success" plain @click="confirm">提交</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { getMenuByRid, updateMenuperms } from '@/api/role'
import { mapActions } from "vuex";
import { queryMenuLeft } from "@/api/menu";
export default {
  props: {
    title: {
      type: String,
      default: "权限编辑"
    }
  },
  data () {
    return {
      visible: false,
      item: {},
      menuList: [], // 获取所有菜单
      defaultProps: {
        children: 'lowerMenu',
        name: 'name',
        type: 'type'
      },
      defaultChecked: [] // 角色所拥有子菜单的id
    }
  },
  methods: {
    ...mapActions("menu/", ["setMenu"]),
    open (item) {
      this.visible = true;
      if (item === undefined || item === null) {
        this.item = {};
      } else {
        this.item = Object.assign({}, item);
        // 根据角色id获取菜单列表
        this.getMenuByRid({ rid: this.item.id });
      }
    },
    getMenuByRid(params) {
      getMenuByRid(params).then(res => {
        console.log(111, res.data)
        this.menuList = res.data[0];

        this.defaultChecked = res.data[1];// 只获取子菜单的id
        console.log(1231, this.menuList, this.defaultChecked)
      })
    },
    updateMenuperms(params) {
      // console.log(111, params)
      this.$confirm("确认提交吗？", "询问", {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {
        updateMenuperms(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '提交成功！',
              type: 'success'
            });
            // 更新当前对话框内容
            this.getMenuByRid({ rid: this.item.id });
            this.visible = false;

            // 更新左侧侧边栏(更新store)
            // 重新查询菜单到store
            var para = { uid: this.userid };
            queryMenuLeft(para).then(res => {
            //  更新store菜单信息
              var menuList = res.data;
              // console.log('当前展示', res)
              this.setMenu({ menuList });
            })
          }
        })
      })
    },
    confirm() {
      var parentid = this.$refs.tree.getHalfCheckedKeys();
      var mid = this.$refs.tree.getCheckedKeys();
      mid = mid.concat(parentid);// 更新时将父元素的id也传递回去
      const rid = this.item.id;
      const para = { rid: rid, mid: mid };
      // console.log(para);
      this.updateMenuperms(para);
    },
    cancel () {
      this.visible = false;
    }
  }
}
</script>

<style lang="scss">
 .el-drawer{
   padding-left: 5rem;
  }
  .demo-drawer__content{
    height: calc(100% - 10rem);
    overflow-y: scroll;
  }
  .demo-drawer__footer{
    margin: 2rem auto;
  }
</style>
