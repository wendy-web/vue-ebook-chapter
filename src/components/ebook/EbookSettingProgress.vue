<template>
<transition name="slid-up">
    <div class='setting-wrapper' v-show="menuVisible && settingVisible === 2">
        <div class="setting-progress">
            <div class="read-time-wrapper">
                <span class="read-time-text">{{getReadTimeText()}}</span>
                <span class="icon-forward"></span>
            </div>
            <div class="progress-wrapper">
                <div class="progress-icon-wrapper">
                    <span class="icon-back" @click="preSection()"></span>
                </div>
                <!-- $event.target.valur是当前input的值 -->
                <input class="progress" type="range"
                    max="100"
                    min="0"
                    step="1"
                    @change="onProgressChange($event.target.value)"
                    @input="onProgressInpput($event.target.value)"
                    :value="progress"
                    :disabled="!bookAvailable"
                    ref="progress"
                >
                <div class="progress-icon-wrapper">
                    <span class="icon-forward" @click="nextSection()"></span>
                </div>
            </div>
            <div class="text-wrapper">
                <span class="progress-secyion-text">{{getSectionName}}</span>
                <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
export default {
    mixins: [ebookMixin],
    methods: {
        // 改变执行的函数
        onProgressChange(progress) {
            this.setProgress(progress).then(() => {
                this.displayProgress()
                this.updataProgressBG()
            })
        },
        // 拖动过程中执行的函数
        onProgressInpput(progress) {
            this.setProgress(progress).then(() => {
                this.updataProgressBG()
            })
        },
        displayProgress() {
            const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
            // console.log(cfi)
            // cfi是获取当前阅读的百分百，并吧它传下去，通过renditon定位到该进度
            this.display(cfi)
        },
        updataProgressBG() {
            this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
        },
        // 切换上一章节的内容
        nextSection() {
            // this.currentBook.spine.lengt是这本书的章节内容
            if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
                this.setSection(this.section + 1).then(() => {
                    this.displaySection()
                })
            }
        },
        // 切换下一章节的内容
        preSection() {
            if (this.section > 0 && this.bookAvailable) {
                this.setSection(this.section - 1).then(() => {
                    this.displaySection()
                })
            }
        },
        // 章节跳转
        displaySection() {
            const sectionInfo = this.currentBook.section(this.section)
            if (sectionInfo && sectionInfo.href) {
                this.display(sectionInfo.href)
            }
        }
    },
    updated() {
        this.updataProgressBG()
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
    .setting-progress{
        position: relative;
        width:100%;
        height:100%;
        .read-time-wrapper{
            position: absol;
            top:0;
            left:0;
            width:100%;
            height:px2rem(40);
            font-size: px2rem(12);
            @include center;
        }
        .progress-wrapper{
            width:100%;
            @include center;
            padding: 0 px2rem(15);
            box-sizing: border-box;
            .progress-icon-wrapper{
                font-size:px2rem(12);
            }
            .progress{
                width:100%;
                -webkit-appearance: none;//覆盖默认样式
                height:px2rem(2);
                // background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
                // background-size: 0 100%!important;
                margin:0 px2rem(10);
                &.focus{
                    outline:none;
                }
                // 滑块滑动的位置
                &::-webkit-slider-thumb{
                    -webkit-appearance: none;
                    height:px2rem(20);
                    width:px2rem(20);
                    border-radius: 50%;
                    background:white;
                    box-shadow: 0 4px 4px 0 rgba($color: #000000, $alpha: .15);
                    border:px2rem(1) solid #ddd;
                }
            }
        }
        .text-wrapper{
            position: absolute;
            left:0;
            bottom:px2rem(10);
            width:100%;
            color:#333;
            font-size: px2rem(12);
            // text-align: center;
            @include center;
            padding: 0 px2rem(15);
            box-sizing: border-box;
            .progress-secyion-text{
               @include ellipsis;
            }
        }
    }
}
</style>
