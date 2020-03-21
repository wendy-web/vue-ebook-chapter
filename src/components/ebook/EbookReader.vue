<template>
<div class='ebook-reader'>
    <div id="read"></div>
    <!-- 蒙版的建立，实现下拉这些事件的执行 -->
    <div class="ebook-reader-mask"
        @click="onMaskClick"
        @touchmove="move"
        @touchend="moveEnd"
        @mousedown.left="onMouseEnter"
        @mousemove.left="onMouseMove"
        @mouseup.left="onMouseEnd"
    >
    </div>
</div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    getTheme,
    saveTheme,
    getLocation
} from '../../utils/localStorage'
import { flatten } from '../../utils/book'
import { getLocalForage } from '../../utils/localForage.js'

import Epub from 'epubjs'
global.ePub = Epub
export default {
    mixins: [ebookMixin],
    methods: {
      // 1-鼠标进入
      // 2-鼠标进入后的移动
      // 3-鼠标从移动状态松手
      // 4-鼠标还原
        onMouseEnter(e) {
          this.mouseState = 1
          this.mouseStateTime = e.timeStamp// 时间
          e.preventDefault()
          e.stopPropagation()
        },
        onMouseMove(e) {
          if (this.mouseState === 1) {
            this.mouseState = 2
          } else if (this.mouseState === 2) {
            let offsetY = 0
            if (this.firstOffsetY) {
              offsetY = e.clientY - this.firstOffsetY
              this.setOffsetY(offsetY)
            } else {
              this.firstOffsetY = e.clientY
            }
          }
          e.preventDefault()
          e.stopPropagation()
        },
        onMouseEnd(e) {
          if (this.mouseState === 2) {
            this.setOffsetY(0)
            this.firstOffsetY = null
            this.mouseState = 3
          } else {
            this.mouseState = 4
          }
          // 利用点击的时间来判定
          const time = e.timeStamp - this.timeStamp
          if (time < 200) {
            this.mouseState = 4
          }
          e.preventDefault()
          e.stopPropagation()
        },
        move(e) {
         // console.log(e)
         let offsetY = 0
         if (this.firstOffsetY) {
           offsetY = e.changedTouches[0].clientY - this.firstOffsetY
           this.setOffsetY(offsetY)
         } else {
           this.firstOffsetY = e.changedTouches[0].clientY
         }
         // 禁止调用默认方法和禁止进行传播
         e.preventDefault()
         e.stopPropagation()
        },
        // 移动结束时执行
        moveEnd(e) {
          // 将vuex的值重置
          this.setOffsetY(0)
          this.firstOffsetY = null
        },
        // 点击蒙版所执行的函数
        onMaskClick(e) {
            if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
              return
            }
            const offsetX = e.offsetX
            const width = window.innerWidth
            if (offsetX > 0 && offsetX < width * 0.3) {
              this.prevPage()
            } else if (offsetX > 0 && offsetX > width * 0.7) {
              this.nextPage()
            } else {
              this.toggleTitleAndeMenu()
            }
        },
        nextPage () {
            if (this.rendition) {
                this.rendition.next().then(() => {
                    this.refreshLocation()
                })
                this.hiddenTitleAndeMenu()
            }
        },
        prevPage () {
             if (this.rendition) {
                this.rendition.prev().then(() => {
                    this.refreshLocation()
                })
                this.hiddenTitleAndeMenu()
            }
        },
        // 点击中间所执行的函数
        toggleTitleAndeMenu () {
            if (this.menuVisible) {
                this.setSettingVisible(-1)
                this.setFontFamilyVisible(false)
            }
            // this.$store.dispatch('setmenuVisible', !this.menuVisible)
            this.setmenuVisible(!this.menuVisible)
        },
        // 字体大小设置保存
        initFontSize () {
            const fontSize = getFontSize(this.fileName)
            if (!fontSize) {
                saveFontSize(this.fileName, this.defaultFontSize)
            } else {
                this.rendition.themes.fontSize(fontSize)
                this.setDefaultFontSize(fontSize)
            }
        },
        // 字体样式的设置保存
        initFontFamily () {
            const font = getFontFamily(this.fileName)
            if (!font) {
                saveFontFamily(this.fileName, this.defaultFontFamily)
            } else {
                this.rendition.themes.font(font)
                this.setDefaultFontFamily(font)
            }
        },
        // 文本主题的样式
        initFontTheme () {
            // 进行主题样式的存储
            let defaultTheme = getTheme(this.fileName)
            if (!defaultTheme) {
                defaultTheme = this.themeList[0].name
                saveTheme(this.fileName, defaultTheme)
            }
            this.setDefaultTheme(defaultTheme)
            // 进行样式的存入
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name, theme.style)
            })
            // 设置样式的默认值
            this.rendition.themes.select(defaultTheme)
        },
        initRendition () {
             // console.log (this.book)
            this.rendition = this.book.renderTo('read', {
                width: innerWidth,
                height: innerHeight,
                method: 'default'
                // flow:'scrolled' 上下滑动的模式
            })
            // 将电子书渲染出来
            const location = getLocation(this.fileName)
            this.display(location, () => {
                // 字体大小设置保存
               this.initFontSize()
                // 字体样式的设置保存
                this.initFontFamily()
                // 改变主题的样式
                this.initFontTheme()
                // 初始化全局样式
                this.initGlobalStyle()
            })
            this.rendition.hooks.content.register(contents => {
                 Promise.all([
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
                 ]).then(() => {})
             })
        },
        // 手指的左右滑动事件，但由于要添加上下滑动的事件
        initGesture () {
            // 利用rendition.on动态的绑定数据   touchstart， touchend 手指触摸的开始和结束事件
            this.rendition.on('touchstart', event => {
                // console.log(event)
                this.toucgStartX = event.changedTouches[0].clientX
                this.touchStartTime = event.timeStamp
            })
             this.rendition.on('touchend', event => {
                // console.log(event) 手指滑动的偏移量
                const offsetX = event.changedTouches[0].clientX - this.toucgStartX
                const time = event.timeStamp - this.touchStartTime
                // 手指触摸的时间少于500毫秒 和 偏移量大于40时，进行下一页的翻页
                if (time < 500 && offsetX > 40) {
                    this.prevPage()
                } else if (time < 500 && offsetX < -40) {
                    this.nextPage()
                } else {
                    // 点击中间的时候执行的 显示或隐藏上标题和下选项的按钮 事件
                    this.toggleTitleAndeMenu()
                }
                // 阻止默认事件的复用
                event.preventDefault()
                event.stopPropagation()
             })
        },
        parseBook() {
            // 获取封面信息
            this.book.loaded.cover.then(cover => {
                this.book.archive.createUrl(cover).then(url => {
                    this.setCover(url)
                    // console.log(url)
                })
            })
            // 获取标题信息
            this.book.loaded.metadata.then(metadata => {
                this.setMetadata(metadata)
            })
            this.book.loaded.navigation.then(nav => {
                // console.log(flatten(nav.toc))
                const navItem = flatten(nav.toc)
                function find(item, level = 0) {
                  return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
                }
                navItem.forEach(item => {
                  item.level = find(item)
                })
                // 将处理好的数据放入的vuex中
                this.setNavigation(navItem)
            })
        },
        // 获得书籍的调用函数
        inintEpub (url) {
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            this.initRendition()
            // this.initGesture()
            // 电子书的解析
            this.parseBook()
            this.book.ready.then(() => {
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
            }).then(locations => {
                // 分页
                this.navigation.forEach(nav => {
                  nav.pagelist = []
                })
                locations.forEach(item => {
                  const loc = item.match(/\[(.*)\]!/)[1]
                  this.navigation.forEach(nav => {
                    if (nav.href) {
                      const href = nav.href.match(/^(.*)\.html$/)
                      if (href === loc) {
                        nav.pagelist.push(item)
                      }
                    }
                  })
                })
                // console.log(this.navigation)
                let currentPage = 1
                this.navigation.forEach((nav, index) => {
                  if (index === 0) {
                    nav.page = 1
                  } else {
                    nav.page = currentPage
                  }
                  currentPage += nav.pagelist.length + 1
                })
                // 将修改后的locations保存
                this.setPagelist(locations)
                this.setBookAvailable(true)
                this.refreshLocation()
            })
        }
    },
    mounted() {
        const books = this.$route.params.fileName.split('|')
        const fileName = books[1]
        getLocalForage(fileName, (err, blob) => {
          if (!err && blob) {
            console.log('找到离线缓存的电子书')
            this.setFileName(books.join('/')).then(() => {
              this.inintEpub(blob)
            })
          } else {
            console.log('在线获取电子书')
            this.setFileName(books.join('/')).then(() => {
                const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
                this.inintEpub(url)
            })
          }
        })
        // let fileName = this.$route.params.fileName
        // // split是先要判断值是否存在，再进行执行的
        // if (fileName) {
        //     fileName = fileName.split('|').join('/')
        // }
    }
}
</script>

<style lang='scss' rel="stylesheet/scss" scoped>
    @import '../../assets/styles/global';
    .ebook-reader{
        width:100%;
        height:100%;
        overflow: hidden;
        .ebook-reader-mask{
            position: absolute;
            top:0;
            left:0;
            z-index: 100;
            width:100%;
            height:100%;
        }
    }
</style>
