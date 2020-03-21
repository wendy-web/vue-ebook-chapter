
<template>
<div class='ebook-bookmark' ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
        <div class="ebook-bookmark-down-wrapper" ref="iconDown">
            <span class="icon-down"></span>
        </div>
        <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark
        :color="color"
        :width="15"
        :height="35">
      </bookmark>
    </div>
</div>
</template>

<script>
import { realPx } from '../../utils/utils.js'
import Bookmark from '../common/Bookmark.vue'
import { ebookMixin } from '../../utils/mixin.js'
import { getBookmark, saveBookmark } from '../../utils/localStorage.js'
const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  computed: {
    height() {
      return realPx(35)
    },
    threshold() {
      return realPx(55)
    },
    fixedStyle() {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    // 监听下拉偏移量的变化
    offsetY(v) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return
      }
      // 状态2：未达到零界状态
      if (v >= this.height && v < this.threshold) {
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        // 状态3：超越零界状态
        this.afterThreshold(v)
      } else if (v > 0 && v < this.height) {
        // 状态一
        this.beforeHeight(v)
      } else if (v === 0) {
        // 当下拉结束时，v=0，bookmark和iconDown变回原来的
        this.restore(v)
      }
    },
    isBookmark(isBookmark) {
      this.isFixed = isBookmark
      if (isBookmark) {
        this.color = BLUE
      } else {
        this.color = WHITE
      }
    }
  },
  data() {
      return {
          text: '',
          color: WHITE,
          isFixed: false
      }
  },
  methods: {
    // 存储书签
    addBookmark() {
      // 刚开始进行初始化
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.currentBook.rendition.currentLocation()// 获得该页面的信息 cfi
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '')
      const cfirange = `${cfibase}!,${cfistart},${cfiend}`
      // 将截取的cfi路段放入到range中，通过tostring来读取其中的文本
      this.currentBook.getRange(cfirange).then(range => {
        const text = range.toString().replace(/\s\s/g, '')
        // console.log(text)
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        })
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    // 删除书签
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation()// 获得该页面的信息 cfi
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      if (this.bookmark) {
        saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
        this.setIsBookmark(false)// 设置当前页不是书签
      }
    },
    // 归位，下拉结束，位移归为0，恢复默认
    restore(v) {
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if (this.isFixed) {
        this.setIsBookmark(true)
        this.addBookmark()// 存储书签
      } else {
        this.setIsBookmark(false)
        this.removeBookmark()// 删除书签
      }
    },
    // 状态1：未超过书签的高度
    beforeHeight (v) {
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
    },
    // 状态2：未达到零界状态
    beforeThreshold(v) {
      // 相对的顶部的运动，置顶效果
      this.$refs.bookmark.style.top = `${-v}px`
      // 判断是否为书签，是的话显示删除书签的样式
      this.beforeHeight(v)
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
    },
    // 状态3：超越零界状态
    afterThreshold(v) {
      this.$refs.bookmark.style.top = `${-v}px`

      // 判断是否为书签，是的话显示删除书签的样式
      if (this.isBookmark) {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(0deg)' || iconDown.style.transform === '') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.ebook-bookmark{
    position: absolute;
    top:px2rem(-40);
    left:0;
    z-index: 200;
    width:100%;
    height:px2rem(35);
    .ebook-bookmark-text-wrapper{
      position: absolute;
      right: px2rem(45);
      bottom: px2rem(1);
      display: flex;
      .ebook-bookmark-down-wrapper{
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
        .icon-down{}
      }
      .ebook-bookmark-text{
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper{
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
}
</style>
