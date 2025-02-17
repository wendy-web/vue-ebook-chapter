<template>
<div class='ebook-slide-contents'>
    <!-- 搜索 -->
    <div class="slide-contents-search-wrapper">
        <div class="slide-contents-search-input-wrapper">
            <div class="slide-contents-search-icon">
                <span class="icon-search"></span>
            </div>
            <input class="slide-contents-search-input"
                    type="text"
                    :placeholder="$t('book.searchHint')"
                    @click="showSearchPage()"
                    v-model="searchText"
                    @keyup.enter.exact="search()">
                    <!--  @keyup.enter="search()"按键抬起的执行事件 添加exact表示只能点击回车键时执行事件-->
        </div>
        <div class="slide-contents-search-cancel" v-if="searchVisible"
            @click="hideSearchPage()">
            {{$t('book.cancel')}}
        </div>
    </div>
    <!-- 当前阅读此书的详情信息 -->
    <div class="slide-contents-book-wrapper" v-if="!searchVisible">
        <div class="slide-contents-book-img-wrapper">
            <img class="slide-contents-book-img" :src="cover">
        </div>
        <div class="slide-contents-book-info-wrapper">
            <div class="slide-contents-book-title">
                <span class="slide-contents-book-title-text">{{metadata.title}}</span>
            </div>
            <div class="slide-contents-book-author">
                <span class="slide-contents-book-author-text">{{metadata.creator}}</span>
            </div>
        </div>
        <div class="slide-contents-book-progress-wrapper">
            <div class="slide-contents-book-progress">
                <span class="progress">{{progress + '%'}}</span>
                <span class="progress-text">{{$t('book.haveRead2')}}</span>
            </div>
            <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
        </div>
    </div>
    <scroll class="slide-contents-list"
            :top="156"
            :bottom="48"
            ref="scroll"
            v-if="!searchVisible"
    >
    <div class="slide-content-item" v-for="(item, index) in navigation" :key="index">
      <span class="clide-content-item-label"
            :style="contentItem(item)"
            :class="{'selected': section === index}"
            @click="displsyContent(item.href)">
            {{item.label}}
      </span>
      <span class="clide-content-item-page">{{item.page}}</span>
    </div>
    </scroll>
    <scroll class="slide-search-list"
            :top="66"
            :bottom="48"
            v-show="searchVisible">
      <div class="slide-search-item"
            v-for="(item, index) in searchList"
            :key="index"
            v-html="item.excerpt"
            @click="displsyContent(item.cfi, true)"></div>
    </scroll>
</div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Scroll from '../common/Scroll.vue'
import { px2rem } from '../../utils/utils.js'
export default {
    mixins: [ebookMixin],
    components: {
      Scroll
    },
    data() {
        return {
            searchVisible: false,
            searchList: null,
            searchText: ''
        }
    },
    methods: {
      search() {
        // this.searchText是input输入的关键字
        if (this.searchText && this.searchText.length > 0) {
          this.doSearch(this.searchText).then(list => {
            this.searchList = list
            this.searchList.map(item => {
              item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
              return item
            })
          })
        }
      },

      // 关键字搜索
      doSearch(q) {
          return Promise.all(
          // section代表整个文本 section.load将文本传进去，获取到文本的所有信息
              this.currentBook.spine.spineItems.map(
                section => section.load(this.currentBook.load.bind(this.currentBook))
                .then(section.find.bind(section, q)).finally(section.unload.bind(section)))
          ).then(results => Promise.resolve([].concat.apply([], results)))
          // results返回是一个二维数组，包含关键字和不包含关键字的
          // concat.apply将俩个数组进行降维
      },
      displsyContent(target, highlight = false) {
        this.display(target, () => {
          this.hiddenTitleAndeMenu()
          if (highlight) {
            this.currentBook.rendition.annotations.highlight(target)
          }
        })
      },
      contentItem(item) {
        return {
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      },
      showSearchPage () {
          this.searchVisible = true
      },
      hideSearchPage () {
          this.searchVisible = false
          this.searchText = ''
          this.searchList = null
      }
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.ebook-slide-contents{
    width:100%;
    font-size: 0;
    .slide-contents-search-wrapper{
        display:flex;
        width:100%;
        height:px2rem(36);
        margin:px2rem(20) 0 px2rem(10) 0;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .slide-contents-search-input-wrapper{
            flex:1;
            @include center;
            .slide-contents-search-icon{
                flex:0 0 px2rem(28);
                font-size: px2rem(12);
                @include center;
            }
            .slide-contents-search-input{
                flex:1;
                width:100%;
                height:px2rem(32);
                font-size: px2rem(14);
                background: transparent;
                border:none;
                &:focus{
                    outline:none;
                }
            }
        }
        .slide-contents-search-cancel{
            flex:0 0 px2rem(50);
            font-size: px2rem(14);
            @include right;
        }
    }
    .slide-contents-book-wrapper{
        display:flex;
        width:100%;
        height:px2rem(90);
        padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
        box-sizing: border-box;
        .slide-contents-book-img-wrapper{
            flex:0 0 px2rem(45);
            .slide-contents-book-img{
                width:px2rem(45);
                height:px2rem(60);
            }
        }
        .slide-contents-book-info-wrapper{
            flex:1;
            padding: 0 px2rem(10);
            box-sizing: border-box;
            .slide-contents-book-title{
                font-size: px2rem(14);
                /* width:px2rem(153.75); */
                line-height: px2rem(16);
                @include left;
                .slide-contents-book-title-text{
                  @include ellipsis2(3);
                }
            }
            .slide-contents-book-author{
                font-size: px2rem(12);
                line-height: px2rem(14);
                /* width:px2rem(153.75); */
                margin-top: px2rem(5);
                @include left;
                .slide-contents-book-author-text{
                  @include ellipsis2(1);
                }
            }
        }
        .slide-contents-book-progress-wrapper{
            flex:0 0 px2rem(70);
            // 字体的垂直
            display:flex;
            flex-direction: column;
            justify-content: center;
            // align-items: flex-start;
            .slide-contents-book-progress{
                .progress{
                font-size: px2rem(14);
                }
                .progress-text{
                font-size: px2rem(12);
                }
            }
            .slide-contents-book-time{
                font-size: px2rem(12);
                margin-top: px2rem(5);
            }
        }
    }
    .slide-contents-list{
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-content-item{
        padding: px2rem(20) 0;
        box-sizing: border-box;
        display: flex;
        .clide-content-item-label{
          font-size: px2rem(14);
          line-height: px2rem(16);
          flex: 1;
          @include ellipsis;
          /* &.selected{
            color: black;
          } */
        }
        .clide-content-item-page{
          flex: 0 0 px2rem(30);
          font-size: px2rem(10);
          @include right;
        }
        .clide-content-item-page{}
      }
    }
    .slide-search-list{
      padding: 0 px2rem(15);
      box-sizing: border-box;
      width: 100%;
      .slide-search-item{
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: px2rem(20) 0;
      }
    }
}
</style>
