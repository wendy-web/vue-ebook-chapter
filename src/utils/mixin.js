// 为减少复用性，在此建立这个 在需要用到这个内容的.vue进行引用
import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'

import { saveLocation, getBookmark, getBookShelf, saveBookShelf } from './localStorage'
import { gotoBookDetail, appendAddToShelf } from './store'
import { shelf } from '../api/store'
export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY'
    ])
  },
  methods: {
    ...mapActions([
    'setIsEditMode',
    'setShelfList',
    'setShelfSelected',
    'setShelfTitleVisible',
    'setOffsetY'
    ]),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    },
    getShelfList() {
      let shelfList = getBookShelf()
      if (shelfList) {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
    }
  }
}
export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
      ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
      ]),
      showBookDetail(book) {
        gotoBookDetail(this, book)
      }
  }
}
export const ebookMixin = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'bookAvailable',
            'progress',
            'section',
            'isPaginating',
            'currentBook',
            'navigation',
            'cover',
            'metadata',
            'paginate',
            'pagelist',
            'offsetY',
            'isBookmark'

        ]),
        // themeList放入这里，可增加复用性
        themeList() {
            return themeList(this)
        },
        // 获得章节的名称
        getSectionName() {
            return this.section ? this.navigation[this.section].label : ''
        }
    },
    methods: {
        ...mapActions([
            'setmenuVisible',
            'setFileName',
            'setSettingVisible',
            'setDefaultFontSize',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
            'setIsPaginating',
            'setCurrentBook',
            'setNavigation',
            'setCover',
            'setMetadata',
            'setPaginate',
            'setPagelist',
            'setOffsetY',
            'setIsBookmark'
        ]),
        // 初始化全局样式
        initGlobalStyle() {
            removeAllCss()
            switch (this.defaultTheme) {
                case 'Default':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
                    break
                case 'Eye':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
                    break
                case 'Gold':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
                    break
                case 'Night':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
                    break
                default:
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
                    break
            }
        },
        // 进度的跟随
        refreshLocation() {
            // 获取当前的对象，对象里面有当前对应页面的start和end的定位
            const currentLocation = this.currentBook.rendition.currentLocation()
            // console.log(currentLocation)epubjs的cfi
            if (currentLocation && currentLocation.start) {
              const startCfi = currentLocation.start.cfi
              // 通过currentLocation.start.cfi获取到当前页，并把它放进percentageFromCfi解析成其中的percentage(百分比)
              const progress = this.currentBook.locations.percentageFromCfi(startCfi)
              // 设置进度
              this.setProgress(Math.floor(progress * 100))
              this.setSection(currentLocation.start.index)
              // 存储进度
              saveLocation(this.fileName, startCfi)
              const bookmark = getBookmark(this.fileName)
              if (bookmark) {
                if (bookmark.some(item => item.cfi === startCfi)) {
                  this.setIsBookmark(true)
                } else {
                  this.setIsBookmark(false)
                }
              } else {
                this.setIsBookmark(false)
              }
              // 分页
              if (this.pagelist) {
                const totalPage = this.pagelist.length
                const currentPage = currentLocation.start.location
                if (currentPage && currentPage > 0) {
                  this.setPaginate(currentPage + '/' + totalPage)
                } else {
                  this.setPaginate('')
                }
              } else {
                this.setPaginate('')
              }
            }
        },
        display(target, cb) {
            if (target) {
                this.currentBook.rendition.display(target).then(() => {
                    this.refreshLocation()
                    if (cb) cb()
                })
            } else {
                this.currentBook.rendition.display().then(() => {
                    this.refreshLocation()
                    if (cb) cb()
                })
            }
        },
        hiddenTitleAndeMenu() {
            // this.$store.dispatch('setmenuVisible', false) 进行翻页时，上标题和下选项为false，隐藏
            this.setmenuVisible(false)
            this.setSettingVisible(-1)
            this.setFontFamilyVisible(false)
        },
        getReadTimeText() {
            return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
        }
    }
}
