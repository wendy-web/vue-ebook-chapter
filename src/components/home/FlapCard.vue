<template>
<div class='flap-card-wrapper' v-show="flapCardVisible">
  <!-- 半圆的推荐框 -->
  <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
    <!-- 翻转的动画 -->
    <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
      <div class="flap-card-circl">
        <div class="flap-card-semi-circl flap-card-semi-circl-left" :style="semiCircleStyle(item, 'left')" ref="left"></div>
        <div class="flap-card-semi-circl flap-card-semi-circl-right" :style="semiCircleStyle(item, 'right')" ref="right"></div>
      </div>
    </div>
    <!-- 烟花散开的动画 -->
    <div class="point-wrapper">
      <div class="point" :class="{'animation': runPointAnimation}" v-for="item in pointList" :key="item.index"></div>
    </div>
  </div>
  <!-- 书的卡片 -->
  <div class="book-card" :class="{'animation': runBokCardAnimation}" v-show="runBokCardAnimation">
    <div class="book-card-wrapper">
      <div class="img-wrapper">
        <img class="img" :src="data ? data.cover : ''">
      </div>
      <div class="content-wrapper">
        <div class="content-title">{{data ? data.title : ''}}</div>
        <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
        <div class="content-category">{{categoryText()}}</div>
      </div>
      <div class="read-btn" @click.stop="showBookDetail(data)">
        <!-- @click后加.stop表示阻止事件冒泡 -->
        {{$t('home.readNow')}}
      </div>
    </div>
  </div>

  <!-- 关闭按钮 -->
  <div class="close-btn-wrapper" @click="close()">
    <span class="icon-close"></span>
  </div>
</div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin.js'
import { flapCardList, categoryText } from '../../utils/store.js'
export default {
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data () {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBokCardAnimation: false
    }
  },
  watch: {
    flapCardVisible (v) {
      if (v) {
        this.runAnimation()
      }
    }
  },
  methods: {
    categoryText() {
      if (this.data) {
        return categoryText(this.data.category, this)
      } else {
        return ''
      }
    },
    // 烟花动画的开启
    startPointAnimation() {
      this.runPointAnimation = true
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    // 登场动画
    runAnimation() {
      this.runFlapCardAnimation = true
      this.timeout = setTimeout(() => {
        this.startFlapCardAnimation()
        this.startPointAnimation()
      }, 300)
      this.timeout2 = setTimeout(() => {
        this.stopAnimation()
        this.runBokCardAnimation = true
      }, 2500)
    },
    close() {
      this.stopAnimation()
      this.setFlapCardVisible(false)
    },
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    // 推荐圆的翻页
     rotate(index, type) {
       const item = this.flapCardList[index]
       let dom
       if (type === 'front') {
         dom = this.$refs.right[index]
       } else {
         dom = this.$refs.left[index]
       }
       dom.style.transform = `rotateY(${item.rotateDegree}deg)`
       dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
     },
    flapCardRotate() {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    // 翻到下一张
    next() {
     const frontFlapCard = this.flapCardList[this.front]
     const backFlapCard = this.flapCardList[this.back]
     frontFlapCard.rotateDegree = 0
     backFlapCard.rotateDegree = 0
     frontFlapCard._g = frontFlapCard.g
     backFlapCard._g = backFlapCard.g
     this.rotate(this.front, 'front')
     this.rotate(this.back, 'back')
     this.front++
     this.back++
     const len = this.flapCardList.length
     if (this.front >= len) {
       this.front = 0
     }
     if (this.back >= len) {
       this.back = 0
     }
     // 动态设置zIndex
     // 100 -> 96
     // 99 -> 100
     // 98 -> 99
     // 97 -> 98
     // 96 -> 97
     // (0 - 1 + 5) % 5 = 4
     // (1 - 1 + 5) % 5 = 0
     this.flapCardList.forEach((item, index) => {
       item.zIndex = 100 - ((index - this.front + len) % len)
     })
     this.prepare()
   },
    // 让右边的左侧半圆和底下的半圆重叠起来
    prepare() {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      // 对颜色和角度进行预先的扣除
      backFlapCard._g = backFlapCard.g - 5 * 9
      this.rotate(this.back, 'back')
    },
    // 进行推荐的翻页动画
    startFlapCardAnimation() {
      this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotate()
      }, this.intervalTime)
    },
    // 重置卡片的样式
    reset() {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runBokCardAnimation = false
      this.runFlapCardAnimation = false
      this.runPointAnimation = false
    },
    stopAnimation () {
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timeout) {
        clearInterval(this.timeout)
      }
      if (this.timeout2) {
        clearInterval(this.timeout2)
      }
      this.reset()
    }
  },
  // 创建烟花点的数组
  created() {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
@import '../../assets/styles/flapCard';
.flap-card-wrapper {
  z-index: 1000;
  width: 100%;
  height: 100%;
  @include absCenter;
  @include center;
  background: rgba($color: #000000, $alpha: .6);
  .flap-card-bg{
    position: relative;
    width:px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: white;
    transform: scale(0);
    opacity: 0;
    /* 弹出的动画 */
    &.animation{
      /* animation 后面添加both 停止在最后一秒 */
      animation: flap-card-move .3s ease-in both;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity:1;
      }
    }
    .flap-card{
      width: px2rem(48);
      height: px2rem(48);
      @include absCenter;
      .flap-card-circl{
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circl{
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          /* 转动到背面的时候隐藏 */
          backface-visibility: hidden;
        }
        .flap-card-semi-circl-left{
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          /* 转动轴的中心 */
          transform-origin: right;
        }
        .flap-card-semi-circl-right{
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper{
      z-index: 1500;
      @include absCenter;
      .point{
        border-radius: 50%;
        @include absCenter;
        &.animation{
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    max-width: px2rem(400);
    box-sizing: border-box;
    border-radius: px2rem(15);
    background: white;
    &.animation {
      animation: scale .3s ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .content-title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2)
        }
        .content-author {
          margin-top: px2rem(10);
          text-align: center;
        }
        .content-category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(15) 0;
        text-align: center;
        color: white;
        font-size: px2rem(14);
        background: $color-blue;
      }
    }
  }
  .close-btn-wrapper{
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    z-index: 1100;
    width: 100%;
    @include center;
    .icon-close{
      width: px2rem(45);
      height: px2rem(45);
      font-size: px2rem(25);
      border-radius: 50%;
      background: #333;
      color: white;
      @include center;
    }
  }
}
</style>
