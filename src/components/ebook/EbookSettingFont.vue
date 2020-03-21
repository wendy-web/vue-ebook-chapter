<template>
<transition name="slid-up">
    <div class='setting-wrapper' v-show="menuVisible && settingVisible === 0">
        <!-- 字体大小的设置 -->
        <div class="setting-font-size">
            <div class="preview" :style="{fontSize:fontSizeList[0].fontSize + 'px'}">A</div>

            <div class="select">
                <div class="select-wrapper" v-for="(item, index) in fontSizeList" :key="index" @click="setfontSize(item.fontSize)">
                    <div class="line"></div>
                    <div class="point-wrapper">
                        <div class="point" v-show="defaultFontSize === item.fontSize">
                            <div class="small-point"></div>
                        </div>
                    </div>
                    <div class="line"></div>
                </div>
            </div>
            <div class="preview" :style="{fontSize:fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
        </div>
        <!-- 字体的样式设置 -->
        <div class="setting-font-family" @click="showFontFamilyPopup">
            <div class="setting-font-family-text">
                <span>{{defaultFontFamily}}</span>
            </div>
             <div class="setting-font-family-icon">
                <span class="icon-forward"></span>
            </div>
        </div>
    </div>
</transition>

</template>

<script>
import { FONT_SIZE_LIST } from '../../utils/book'
import { ebookMixin } from '../../utils/mixin'
import { saveFontSize } from '../../utils/localStorage'
export default {
    mixins: [ebookMixin],
    data () {
        return {
            fontSizeList: FONT_SIZE_LIST
        }
    },
    methods: {
        setfontSize (fontSize) {
            // 更改默认样式来更改字体的样式大小的小球显示
            this.setDefaultFontSize(fontSize)
            // 通过rendition.themes.fontSize来更改book的字体样式
            this.currentBook.rendition.themes.fontSize(fontSize)

            saveFontSize(this.fileName, fontSize)
        },
        showFontFamilyPopup () {
            this.setFontFamilyVisible(true)
        }
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.setting-wrapper{
    position: absolute;
    bottom: px2rem(48);
    left:0;
    width:100%;
    height:px2rem(90);
    background: white;
    z-index: 160;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba($color: #000000, $alpha: .15);
    display:flex;
    flex-direction: column;
    .setting-font-size{
        display: flex;
        height: 100%;
        flex:2;
        .preview{
            flex:0 0 px2rem(40);
            @include center;
        }
        .select{
            display:flex;
            flex:1;
            .select-wrapper{
                flex:1;
                display:flex;
                align-items: center;
                // 通过选择找到第一根和最后一根横线，并隐藏它
                &:first-child{
                    .line{
                        &:first-child{
                            border-top:none;
                        }
                    }
                }
                &:last-child{
                    .line{
                        &:last-child{
                            border-top:none;
                        }
                    }
                }
                .line{
                    flex:1;
                    height:0;
                    border-top:px2rem(1) solid #ccc;
                }
                .point-wrapper{
                    flex:0 0 0;
                    width:0;
                    height:px2rem(7);
                    border-left:px2rem(1) solid #ccc;
                    position: relative;
                    .point{
                        position: absolute;
                        top:px2rem(-8);
                        left:px2rem(-10);
                        width:px2rem(20);
                        height:px2rem(20);
                        border-radius: 50%;
                        background: white;
                        border:px2rem(1) solid #ccc;
                        box-shadow: 0 px2rem(4) px2rem(4) rgba($color: #000000, $alpha: .15);
                        @include center;
                        .small-point{
                            width:px2rem(5);
                            height:px2rem(5);
                            border-radius: 50%;
                            background: black;
                        }
                    }
                }
            }
        }
    }
    .setting-font-family{
        flex:1;
        font-size: px2rem(14);
        @include center;
        .setting-font-family-text{
            @include center;
        }
        .setting-font-family-icon{
            @include center;
        }
    }
}
</style>