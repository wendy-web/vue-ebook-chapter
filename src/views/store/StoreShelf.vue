<template>
  <div class="store-shelf">
    <shelf-title></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            @onScroll="onScroll"
            :bottom="scrollBottom"
            ref="scroll">
      <shelf-search></shelf-search>
      <shelf-list></shelf-list>
      <shelf-footer></shelf-footer>
    </scroll>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin.js'
import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
import ShelfSearch from '../../components/shelf/ShelfSearch'
import ShelfList from '../../components/shelf/ShelfList.vue'
import ShelfFooter from '../../components/shelf/ShelfFooter.vue'
import Scroll from '../../components/common/Scroll.vue'
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter
  },
  // 判断scroll底部的位置
  data () {
    return {
      scrollBottom: 0
    }
  },
  // 监听是否进入编辑状态而改变scroll的底部的位置
  watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  mounted() {
    this.getShelfList()
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.store-shelf{
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: white;
  .store-shelf-scroll-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
}

</style>
