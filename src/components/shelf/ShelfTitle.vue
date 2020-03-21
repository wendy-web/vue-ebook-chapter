<template>
<transition name="fade">
  <div class="shelf-title" v-show="shelfTitleVisible" :class="{'hide-shadow': ifHideShadow}">
    <div class="shelf-title-text-wrapper">
      <span class="shelf-title-text">{{$t('shelf.title')}}</span>
      <span class="shelf-title-sub-text" v-show="isEditMode">{{selectText}}</span>
    </div>
    <div class="shelf-title-btn-wrapper shelf-title-left">
      <span class="shelf-title-btn-text" @click="clearCache">
        {{$t('shelf.clearCache')}}
      </span>
    </div>
    <div class="shelf-title-btn-wrapper shelf-title-right">
      <span class="shelf-title-btn-text" @click="onEditClick">
        {{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}
      </span>
    </div>
  </div>
</transition>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin.js'
import { clearLocalStorage } from '../../utils/localStorage.js'
import { clearLocalForage } from '../../utils/localForage.js'
export default {
    mixins: [storeShelfMixin],
    computed: {
      // 编辑图书时选中的几本
      selectText() {
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
      }
    },
    watch: {
      offsetY(offsetY) {
        if (offsetY > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    data () {
      return {
        ifHideShadow: true
      }
    },
    methods: {
      // 清除缓存
      clearCache() {
        // console.log('清除缓存')
        clearLocalStorage()
        clearLocalForage()
        this.setShelfList([])
        this.setShelfSelected([])
        this.getShelfList()
        this.simpleToast(this.$t('shelf.clearCacheSuccess'))
      },
      // 编辑和取消的按钮
      onEditClick() {
        if (!this.isEditMode) {
          this.setShelfSelected([])
          this.shelfList.forEach(item => {
            item.selected = false
          })
        }
        this.setIsEditMode(!this.isEditMode)
      }
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.shelf-title{
  position: relative;
  width: 100%;
  z-index: 130;
  height: px2rem(42);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) rgba($color: #000000, $alpha: .1);
  &.hide-shadow{
    box-shadow: none;
    }
  .shelf-title-text-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    @include columnCenter;
    .shelf-title-text{
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text{
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper{
    position: absolute;
    top:0;
    box-sizing: border-box;
    height: 100%;
    @include center;
    .shelf-title-btn-text{
      font-size: px2rem(14);
      color: #666;
    }
    &.shelf-title-left{
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right{
      right: 0;
      padding-right: px2rem(15);
    }
  }
}

</style>
