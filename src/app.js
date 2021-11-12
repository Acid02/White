import { createApp } from 'vue'
import './app.scss'
import Taro from '@tarojs/taro'
const App = createApp({
  onShow(options) { },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
Taro.getSystemInfo({
  success: function (e) {
    App.config.globalProperties.statusBar = e.statusBarHeight
    if (e.platform == 'android') {
      App.config.globalProperties.customBar = e.statusBarHeight + 50
    } else {
      App.config.globalProperties.customBar = e.statusBarHeight + 45
    }
    let custom = Taro.getMenuButtonBoundingClientRect();
    App.config.globalProperties.customBar = custom.bottom + custom.top - e.statusBarHeight
  }
})
export default App
