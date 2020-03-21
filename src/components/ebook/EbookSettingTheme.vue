<template>
<transition name="slid-up">
    <div class='setting-wrapper' v-show="menuVisible && settingVisible === 1">
        <div class="setting-theme">
            <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
                <div class="preview" :style="{background: item.style.body.background}" :class="{'selected': item.name === defaultTheme}"></div>
                <div class="text" :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { saveTheme } from '../../utils/localStorage'
export default {
    mixins: [ebookMixin],
    data() {
        return {
            // 通过register注册主题
            // this.themes.register(name, styles)
            // 通过select来选择样式
            // this.themes.select(name)
        }
    },
    methods: {
        setTheme(index) {
            const theme = this.themeList[index]
            this.setDefaultTheme(theme.name).then(() => {
                this.currentBook.rendition.themes.select(this.defaultTheme)
                // 多次需要用到这个方法，在minxin中创建过，所以可以直接调用
                this.initGlobalStyle()
            })
            // 存储样式改变的设置
            saveTheme(this.fileName, theme.name)
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
    z-index: 101;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba($color: #000000, $alpha: .15);
    display:flex;
    flex-direction: column;
    .setting-theme{
        height:100%;
        display:flex;
        .setting-theme-item{
            flex:1;
            display:flex;
            flex-direction: column;
            padding: px2rem(5);
            box-sizing: border-box;
            .preview{
                flex:1;
                &.selected{
                    box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0 ,0, .1);
                }
            }
            .text{
                flex: 0 0 px2rem(20);
                font-size: px2rem(14);
                color:#999;
                @include center;
                &.selected{
                    color:#333;
                }
            }
        }
    }
}

</style>