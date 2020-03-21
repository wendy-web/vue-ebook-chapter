<template>
<div>
    <transition name="slide-up">
        <!-- 添加其class属性，当ifSettingShow为true时，class生效，以此来隐藏某个css属性 -->
        <div class='menu-wrapper' :class="{'hide-box-shadow':settingVisible >= 0}" v-show="menuVisible">
            <div class="icon-wrapper">
                <span class="icon-menu" @click="showSetting(3)"></span>
            </div>
            <div class="icon-wrapper">
                <span class="icon-progress" @click="showSetting(2)"></span>
            </div>
            <div class="icon-wrapper">
                <span class="icon-bright" @click="showSetting(1)"></span>
            </div>
            <div class="icon-wrapper">
                <span class="icon-a" @click="showSetting(0)">A</span>
            </div>
        </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
</div>
</template>

<script>
import EbookSettingFont from './EbookSettingFont'
import EbookSettingFontPopup from './EbookSettingFontPopup'
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingProgress from './EbookSettingProgress'
import EbookSlide from './EbookSlide'

import { ebookMixin } from '../../utils/mixin'
export default {
    mixins: [ebookMixin],
    components: {
        EbookSettingFont,
        EbookSettingFontPopup,
        EbookSettingTheme,
        EbookSettingProgress,
        EbookSlide
    },
    methods: {
        // 点击展示不同的设置面板
        showSetting (key) {
            this.setSettingVisible(key)
        }
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.menu-wrapper{
    position: absolute;
    bottom: 0;
    left:0;
    z-index: 200;
    width:100%;
    height:px2rem(48);
    background: white;
    display: flex;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba($color: #000000, $alpha: .15);
    font-size: px2rem(20);
    &.hide-box-shadow{
        box-shadow: none;
    }
    .icon-wrapper{
        flex:1;
        @include center;
        .icon-progress{
            font-size: px2rem(24);
        }
        .icon-bright{
            font-size: px2rem(22);
        }
    }
}
</style>