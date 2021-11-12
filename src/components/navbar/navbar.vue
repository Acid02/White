<template>
  <view class="uni_navbar" :style="{ position: !fixed ? 'relative' : 'fixed' }">
    <view
      class="default-navbar"
      :style="[
        {
          height: customBarH + 'px',
          'padding-top': statusBarH + 'px',
          color: titleTintColor,
        },
        bgColor,
      ]"
    >
      <view class="navleft" @tap="goBack">🎨</view>
      <view class="navcenter">{{ title }}</view>
      <view class="navright"></view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
export default {
  data() {
    return {
      statusBarH: this.statusBar,
      customBarH: this.customBar,
    };
  },
  props: {
    isBack: {
      type: [Boolean, String],
      default: true,
    },
    title: {
      type: String,
      default: "标题",
    },
    titleTintColor: {
      type: String,
      default: "#D3D2D1",
    },
    bgColor: {
      type: Object,
      default: {
        "background-color": "rgba(0,0,0,0.8)",
      },
    },
    center: {
      type: [Boolean, String],
      default: false,
    },
    search: {
      type: [Boolean, String],
      default: false,
    },
    searchRadius: {
      type: [Boolean, String],
      default: false,
    },
    fixed: {
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {
    style() {
      let _style = `height: ${this.customBarH}px;`;
      return _style;
    },
  },
  methods: {
    goBack() {
      Taro.navigateBack();
    },
  },
};
</script>

<style lang="scss">
.default-navbar {
  display: flex;
  align-items: center;
  padding: 0 40rpx;
  box-sizing: border-box;
  .navcenter {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: 400;
    line-height: 50rpx;
  }
  .navleft,
  .navright {
    flex-shrink: 0;
    width: 114rpx;
  }
}
.uni_navbar {
  z-index: 99;
  width: 100%;
}
</style>
