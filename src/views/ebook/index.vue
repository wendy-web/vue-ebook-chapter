<template>
<div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-meru></ebook-meru>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
</div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader.vue'
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import EbookMeru from '../../components/ebook/EbookMeru.vue'
import EbookBookmark from '../../components/ebook/EbookBookmark.vue'
import EbookHeader from '../../components/ebook/EbookHeader.vue'
import EbookFooter from '../../components/ebook/EbookFooter.vue'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'

export default {
    mixins: [ebookMixin],
    components: {
        EbookReader,
        EbookTitle,
        EbookMeru,
        EbookBookmark,
        EbookHeader,
        EbookFooter
    },
    watch: {
      // 监听vuex中下拉偏移量的距离
      offsetY(v) {
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            // 当放下下拉时设置offsetY = 0 所以回拉到原来的位置
            this.reStore(v)
          }
        }
      }
    },
    methods: {
        reStore(v) {
          this.$refs.ebook.style.top = 0
          this.$refs.ebook.style.transition = 'all .2s linear'
          setTimeout(() => {
            this.$refs.ebook.style.transition = ''
          }, 200)
        },
        move(v) {
          this.$refs.ebook.style.top = v + 'px'
        },
        startLoopReadTime() {
            let readTime = getReadTime(this.fileName)
            if (!readTime) {
                readTime = 0
            }
            this.task = setInterval (() => {
                readTime++
                if (readTime % 30 === 0) {
                    saveReadTime(this.fileName, readTime)
                }
            }, 1000)
        }
    },
    mounted () {
        this.startLoopReadTime()
    },
    beforeDestroy() {
        if (this.task) {
            clearInterval(this.task)
        }
    }
}
</script>

<style lang='scss' rel="stylesheet/scss" scoped>
    @import '../../assets/styles/global';
    .ebook{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
</style>
