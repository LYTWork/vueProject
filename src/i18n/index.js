// 引入插件和语言包
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
var locale;

// 新打开的浏览器设置默认语言包
// 从本地存储中取，如果没有默认为中文，
// 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言

localStorage.getItem('locale') ? locale = localStorage.getItem('locale') : locale = 'zh';

// 注册i18n实例并引入语言文件
const i18n = new VueI18n({
  locale: locale,
  messages: {
    'zh': require('./languages/zh_cn'),
    'en': require('./languages/en_us')
  }
})

export default i18n