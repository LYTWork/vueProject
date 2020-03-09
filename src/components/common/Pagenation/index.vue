<template>
  <div class="page-component">
    <div class="page">
      <el-pagination
        background
        layout="sizes,prev, pager, next,jumper"
        :total="total"
        :current-page.sync="page.currentPage"
        :page-size.sync="page.pageSize"
        :page-sizes="[10, 30, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
  </div>
    <div class="total">共有数据：{{ page.totalSize }} 条</div>
  </div>

</template>
<script>
export default {
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      required: true,
      type: Object
    }
  },
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.$emit("pageChange", this.page)
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.$emit("pageChange", this.page)
    }
  }
}
</script>
<style lang="scss">
.total{
  float: right;
  text-align: right;
  width:38%;
  color:gray;
  margin:.5rem 0;
  line-height: 32px;/*让黄色div中的文字内容垂直居中*/
}
.page{
  float: left;
  text-align: right;
  width:60%;
  margin:.5rem 0;
  margin-left: 2%;
}

.page-component{
  // height: 40px;
  vertical-align: middle
  // padding: .5rem 0;
  }
</style>
