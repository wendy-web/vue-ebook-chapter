<template>
<transition name="fade">
    <div class='slide-content-wrapper' v-show="menuVisible && settingVisible === 3">
        <transition name="slide-right" v-if="settingVisible === 3">
            <div class="content">
                <div class="content-page-wrapper" v-if="bookAvailable">
                    <div class="content-page">
                        <!-- 动态组件 -->
                        <component :is="currentTab === 1 ? content : bookmark"></component>
                    </div>
                    <!-- tab按键 -->
                    <div class="content-page-tab">
                        <div class="content-page-tab-item"
                            :class="{'selected': currentTab === 1}"
                            @click="selectTab(1)">
                            {{$t('book.navigation')}}
                        </div>
                        <div class="content-page-tab-item"
                        :class="{'selected': currentTab === 2}"
                        @click="selectTab(2)">
                            {{$t('book.bookmark')}}
                        </div>
                    </div>
                </div>
                <!-- 图书还没加载完时，展示动画 -->
                <div class="content-empty" v-else>
                    <ebook-loading></ebook-loading>
                </div>
            </div>
        </transition>
        <div class="content-bg" @click="hiddenTitleAndeMenu()"></div>
    </div>
</transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import EbookSlideContents from './EbookSlideContents'
import EbookSlideBookMark from './EbookSlideBookMark'
import EbookLoading from './EbookLoading'
export default {
    mixins: [ebookMixin],
    components: {
        EbookLoading
    },
    data() {
        return {
            currentTab: 1,
            content: EbookSlideContents,
            bookmark: EbookSlideBookMark
        }
    },
    methods: {
        selectTab (tab) {
            this.currentTab = tab
        }
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.slide-content-wrapper{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index: 300;
    display:flex;
    .content{
        flex:0 0 85%;
        width:85%;
        height:100%;
        .content-page-wrapper{
            display:flex;
            flex-direction: column;
            width:100%;
            height:100%;
            .content-page{
                flex:1;
                widows: 100%;
                overflow:hidden;
            }
            .content-page-tab{
                flex:0 0 px2rem(48);
                width:100%;
                height:px2rem(48);
                display:flex;
                .content-page-tab-item{
                    flex:1;
                    font-size: px2rem(12);
                    @include center;
                }
            }
        }
        .content-empty{
            width:100%;
            height:100%;
            @include center;
        }
    }
    .content-bg{
        flex:0 0 15%;
        width:15%;
        height:100%;
    }
}
</style>