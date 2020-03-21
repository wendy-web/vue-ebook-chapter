import Vue from 'vue'
import VueI18N from 'vue-i18n'
// 导入的俩个中英文的文件 运用这个vue-i18n的插件
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localStorage'

Vue.use(VueI18N)

const messages = {
    en,
    cn
}
// 对local的语言进行保存
let locale = getLocale()
if (!locale) {
    locale = 'cn'
    saveLocale(locale)
}

const i18n = new VueI18N({
    locale,
    messages
})

export default i18n