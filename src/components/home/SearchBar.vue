<template>
 <div>
  <div class='search-bar'
       :class="{'hide-title': !titleVisible, 'hide-shadow': !shadowVisible}">
    <!-- 标题 -->
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title': !titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <!-- 搜索框 -->
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <!-- 一个空白的占位符，来实现 -->
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input class="input"
                  type="text"
                  :placeholder="$t('home.hint')"
                  v-model="searchText"
                  @click="showSearchVisible()"
                  @keyup.13.exact="search"
          >
        </div>
      </div>
  </div>
  <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
</div>
</template>

<script>
import HotSearchList from './HotSearchList'
import { storeHomeMixin } from '../../utils/mixin.js'
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data() {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    offsetY(offsetY) {
      // console.log(offsetY)
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY(offsetY) {
      if (offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    // 点击input回车后执的搜索事件
    search() {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    // 弹出推荐卡片
    showFlapCard() {
      this.setFlapCardVisible(true)
    },
    // 书城的返回按钮
    back() {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      if (this.hotSearchVisible) {
        this.hideSearchVisible()
      } else {
        // 跳转到书架的页面
        this.$router.push('/store/shelf')
      }
      this.showTitle()
    },
    // 搜索的历史框
    hideSearchVisible() {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    showSearchVisible() {
      this.hotSearchVisible = true
      this.hideShadow()
      this.hideTitle()
      // $nextTick是更新完成的方法
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    // 标题
    hideTitle() {
      this.titleVisible = false
    },
    showTitle() {
      this.titleVisible = true
    },
    // 阴影
    hideShadow() {
      this.shadowVisible = false
    },
    showShadow() {
      this.shadowVisible = true
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.search-bar{
  position: relative;
  width:100%;
  height:px2rem(94);
  z-index: 150;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-title{
    height: px2rem(52);
  }
  &.hide-shadow{
    box-shadow: none;
  }
  .search-bar-title-wrapper{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:px2rem(42);
    .title-text-wrapper{
      width:100%;
      height:px2rem(42);
      @include center;
    }
    .title-icon-shake-wrapper{
      position:absolute;
      right:px2rem(15);
      top:0;
      height:px2rem(42);
      @include center;
    }
  }
  .title-icon-back-wrapper{
    position:absolute;
    left:px2rem(15);
    z-index: 200;
    top:0;
    height:px2rem(42);
    @include center;
    transition: height $animationTime $animationType;
    &.hide-title{
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper{
    position: absolute;
    top: px2rem(42);
    left: 0;
    width:100%;
    height:px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    /*$animationTime和$animationType是mixin.scss中定义的，可增加复用性  */
    transition: top $animationTime $animationType;
    display: flex;
    &.hide-title{
      top:0;
    }
    .search-bar-blank{
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hide-title{
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input{
      flex: 1;
      width:100%;
      background: #f4f4f4;
      border-radius: px2rem(20);
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      border:px2rem(1) solid #eee;
      @include left;
      .icon-search{
        color:#999;
      }
      .input{
        width:100%;
        height:px2rem(22);
        border:none;
        background: transparent;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        color:#666;
        &:focus{
          outline:none;
        }
        &::-webkit-input-placeholder {
          color:#ccc;
        }
      }
    }
  }
}
</style>
