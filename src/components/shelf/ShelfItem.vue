<template>
<div class="shelf-item"
     :class="{'shelf-item-shadow': data.type !== 3}"
     @click="onItemClick"
>
  <component
        :is="item"
        :data="data"
        class="shelf-item-comp"
        :class="{'is-edit': isEditMode && data.type === 2}"
  ></component>
  <!-- 是否选择的小图标 -->
  <div class="icon-selected"
       v-show="isEditMode && data.type === 1"
       :class="{'is-select': data.selected}"
       ></div>
</div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin.js'
import ShelfItemBook from './ShelfItemBook'
import ShelfItemCategory from './ShelfItemCategory'
import ShelfItemAdd from './ShelfItemAdd'
import { gotoStoreHome } from '../../utils/store.js'
export default {
    mixins: [storeShelfMixin],
    props: {
      data: Object
    },
    computed: {
      item() {
        return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
      }
    },
    data() {
      return {
        book: ShelfItemBook,
        category: ShelfItemCategory,
        add: ShelfItemAdd
      }
    },
    methods: {
      onItemClick() {
        if (this.isEditMode) {
          // 选中的状态
          this.data.selected = !this.data.selected
          // 添加到选中的数组列表中
          if (this.data.selected) {
            this.shelfSelected.pushWithoutDuplicate(this.data)
          } else {
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        } else {
          if (this.data.type === 1) {
            // 跳转到书的详情页
            this.showBookDetail(this.data)
          } else if (this.data.type === 2) {

          } else {
            // 跳转书架的首页
            gotoStoreHome(this)
          }
        }
      }
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.shelf-item{
  width: 100%;
  height: 100%;
  position: relative;
  &.shelf-item-shadow{
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
  }
  .shelf-item-comp{
    opacity: 1;
    &.is-edit{
      opacity: .5;
    }
  }
  .icon-selected{
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, .4);
    &.is-select{
      color: $color-blue;
    }
  }
}
</style>
