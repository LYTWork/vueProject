<template>
  <el-autocomplete
    v-model="searchString"
    :fetch-suggestions="querySearch"
    :trigger-on-focus="false"
    placeholder="请输入关键词进行搜索"
    clearable
  >
    <el-button slot="append" icon="el-icon-search" @click="onSearch"/>
  </el-autocomplete>
</template>
<script>
export default {
  props: {
    searchStates: {
      required: true,
      type: Array
    },
    tablelist: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      searchString: '',
      tabledata: this.tablelist,
      tabledata_copy: this.tablelist
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var searchStates = this.searchStates;
      var results = queryString ? searchStates.filter(this.createFilter(queryString)) : searchStates;
      cb(results);
    },
    createFilter(queryString) {
      return (searchState) => {
        return (searchState.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    onSearch() {
      var keyword = this.searchString;
      if (keyword === undefined || keyword === '' || keyword === null) {
        this.$emit("onSearch", null)
      } else {
        var result = [];
        this.tablelist.map(ele => {
          if (ele.rolename.indexOf(keyword) !== -1) {
            result.push(ele)
          }
        });
        // data中重新命名父组件传过来的值，避免直接操作父组件传的值；
        this.tabledata = result;
        this.$emit("onSearch", this.tabledata);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-autocomplete{
  margin-bottom: 0.5rem;
  float: right;
}
</style>
