<template>
<div class="shelf-search-wrapper" :class="{'select-top': ifInputClicked, 'hide-shadow': ifHideShadow}">
  <!-- 搜索 -->
  <div class="shelf-search" :class="{'search-top': ifInputClicked}">
    <!-- 搜索框-->
    <div class="search-wrapper">
      <div class="icon-scroll-wrapper">
        <span class="icon-search icon"></span>
      </div>
      <div class="search-input-wrapper">
        <input class="search-input"
                type="text"
                :placeholder="$t('shelf.search')"
                @click="onSearchClick"
                v-model="searchText"
        />
      </div>
      <!-- 输入框里面的取消 -->
      <div class="icon-clear-wrapper"
           v-show="searchText.length > 0"
           @click="clearSearchText">
        <span class="icon-close-circle-fill"></span>
      </div>
    </div>
    <!-- 切换语言 -->
    <div class="icon-local-wrapper" v-if="!ifInputClicked" @click="switchLocal">
      <span class="icon-cn icon" v-if="lang === 'cn'"></span>
      <span class="icon-en icon" v-else></span>
    </div>
    <!-- 取消的按钮 -->
    <div class="cancel-btn-wrapper"
          @click="onCancelClick"
          v-else>
      <div class="cancel-text">{{$t('shelf.cancel')}}</div>
    </div>
  </div>
  <!-- tab -->
  <transition name="hot-search-move">
    <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
      <div class="shelf-search-tab-item"
           v-for="item in tabs"
           :key="item.id"
           @click="onTabClick(item.id)">
        <span class="shelf-search-tab-text"
              :class="{'is-select': item.id === selectedTab}">
          {{item.text}}
        </span>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
import { setLocalStorage } from '../../utils/localStorage.js'
import { storeShelfMixin } from '../../utils/mixin.js'
export default {
    mixins: [storeShelfMixin],
    watch: {
      offsetY(offsetY) {
        if (offsetY > 0 && this.ifInputClicked) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    computed: {
      // 语言的计算属性
      lang() {
        return this.$i18n.locale
      },
      tabs() {
        return [
          {
            id: 1,
            text: this.$t('shelf.default')
          },
          {
            id: 2,
            text: this.$t('shelf.progress')
          },
          {
            id: 3,
            text: this.$t('shelf.purchase')
          }
        ]
      }
    },
    data () {
      return {
        ifInputClicked: false,
        searchText: '',
        selectedTab: 1,
        ifHideShadow: true
      }
    },
    methods: {
      onTabClick(id) {
        this.selectedTab = id
      },
      // 清除搜索文本
      clearSearchText() {
        this.searchText = ''
      },
      // 切换语言的设置
      switchLocal() {
        if (this.lang === 'cn') {
          this.$i18n.locale = 'en'
        } else {
          this.$i18n.locale = 'cn'
        }
        setLocalStorage('locale', this.$i18n.locale)
      },
      onSearchClick() {
        this.ifInputClicked = true
        this.setShelfTitleVisible(false)
      },
      onCancelClick() {
        this.ifInputClicked = false
        this.setShelfTitleVisible(true)
      }
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.shelf-search-wrapper{
  position: relative;
  z-index: 105;
  width: 100%;
  height: px2rem(94);
  font-size: px2rem(16);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) rgba($color: #000000, $alpha: .1);
  &.hide-shadow{
    box-shadow: none;
    }
  &.select-top{
    position: fixed;
    top: 0;
    left: 0;
  }
  .shelf-search{
    position: absolute;
    top: px2rem(42);
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(52);
    display: flex;
    transition: top $animationTime linear;
    &.search-top{
      top: 0;
    }
    .search-wrapper{
      display: flex;
      flex: 1;
      margin: px2rem(8) 0 px2rem(8) px2rem(10);
      border: px2rem(1) solid #ccc;
      border-radius: px2rem(3);
      .icon-scroll-wrapper{
        flex: 0 0 px2rem(22);
        @include right;
        .icon-search{
          font-size: px2rem(12);
        }
      }
      .search-input-wrapper{
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        @include center;
        .search-input{
          width: 100%;
          font-size: px2rem(14);
          border: none;
          color: #333;
          &:focus{
            outline: none;
          }
          &::-webkit-input-placeholder{
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper{
        flex: 0 0 px2rem(24);
        @include left;
        .icon-close-circle-fill{
          font-size: px2rem(14);
          color: #ccc;
        }
      }
    }
    .icon-local-wrapper{
      flex: 0 0 px2rem(55);
      @include center;
      .icon-cn, .icon-en{
        font-size: px2rem(22);
        color: #666;
      }
    }
    .cancel-btn-wrapper{
      flex: 0 0 px2rem(55);
      @include center;
      .cancel-text{
        font-size: px2rem(14);
        color: $color-blue;
      }
    }
  }
  .shelf-search-tab-wrapper{
    position: absolute;
    top: px2rem(52);
    left: 0;
    z-index: 105;
    display: flex;
    width: 100%;
    height: px2rem(48);
    .shelf-search-tab-item{
      flex: 1;
      @include center;
      .shelf-search-tab-text{
        font-size: px2rem(12);
        color: #999;
        &.is-select{
          color: $color-blue;
        }
      }
    }
  }
}
</style>
