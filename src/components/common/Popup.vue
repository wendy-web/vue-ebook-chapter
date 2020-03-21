<template>
  <div class="popup" v-if="popupvisible">
    <!-- 透明度为灰的背景 -->
    <transition name="fade">
      <div class="popup-bg" @click.stop.prevent="hide" v-show="popupvisible"></div>
    </transition>
    <!-- 弹出的标题和btn-->
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible">
        <div class="popup-title" v-if="title && title.length > 0">{{title}}</div>
        <div class="popup-btn"
              v-for="(item, index) in btn"
              :key="index"
             :class="{'danger': item.type === 'danger'}"
             @click="item.click"
             >
          {{item.text}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'popup',
  props: {
    title: String,
    btn: Array
  },
  data () {
    return {
      popupvisible: false,
      visible: false
    }
  },
  methods: {
    show() {
      this.popupvisible = true
      setTimeout(() => {
        this.visible = true
      })
    },
    hide() {
      this.visible = false
      setTimeout(() => {
        this.popupvisible = false
      }, 200)
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.popup{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background: rgba($color: #000000, $alpha: 0.4);
  .popup-bg{
    width: 100%;
    height: 100%;
  }
  .popup-wrapper{
    position: fixed;
    z-index: 2000;
    left: 0;
    bottom: 0;
    width: 100%;
    background: white;
    .popup-title{
      width: 100%;
      height: px2rem(44);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(12);
      line-height: px2rem(14);
      padding: px2rem(15);
      box-sizing: border-box;
      color: #999;
      @include center;
    }
    .popup-btn{
      width: 100%;
      height: px2rem(60);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(16);
      color: #666;
      font-weight: bold;
      @include center;
      &.danger{
        color: $color-pink;
      }
    }
  }
}
</style>
