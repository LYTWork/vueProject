<template>
  <div class="page-component">
    <el-pagination
      :total="page.totalSize"
      :current-page.sync="page.currentPage"
      :page-size.sync="page.pageSize"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
<style lang="scss" scoped>
.el-pagination{
  text-align: center;
  padding: .5rem;
}
</style>
