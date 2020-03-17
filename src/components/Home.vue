<template>
  <div class="wrapper">
    <v-header/>
    <v-sidebar/>
    <div :class="{'content-collapse':collapse}" class="content-box">
      <v-tags/>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view class="dashboard"/>
          </keep-alive>
        </transition>
        <el-backtop target=".content"/>
      </div>
    </div>
  </div>
</template>

<script>
import VHeader from '@/components/common/nav/Header'
import VSidebar from '@/components/common/nav/Sidebar'
import VTags from '@/components/common/nav/Tags'
import Footer from '@/components/common/nav/Footer'
import bus from '@/utils/bus';
export default {
  components: {
    VHeader,
    VSidebar,
    VTags,
    Footer
  },
  data() {
    return {
      tagsList: [],
      collapse: false
    };
  },
  created() {
    bus.$on('collapse-content', msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      const arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }
};
</script>
<style lang="scss">
  .nav-menu {
    /*margin-bottom: 40px;*/
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.05);
  }
</style>
