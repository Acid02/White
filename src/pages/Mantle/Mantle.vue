<template>
  <view class="user" style="color: #e91e63">
    <view>
      <view>对方信息：</view>
      <view class="useflex">
        姓名：<input
          type="text"
          v-model.trim="userObj.userB.name"
          placeholder="对方用户名"
        />
      </view>
      <view class="useflex">
        头像：<image
          :src="
            userObj.userB.Avatar ||
            'https://img2.baidu.com/it/u=1500591171,3473929485&fm=26&fmt=auto&gp=0.jpg'
          "
          mode="aspectFill"
          style="height: 40px; width: 40px"
          @tap="getPic('userB')"
        />
      </view>
    </view>
    <view style="margin-top: 40rpx; color: #4e58a2">
      <view>你的信息：</view>
      <view class="useflex">
        姓名：<input
          type="text"
          v-model.trim="userObj.userA.name"
          placeholder="自己用户名"
        />
      </view>
      <view class="useflex">
        头像：<image
          :src="
            userObj.userA.Avatar ||
            'https://img2.baidu.com/it/u=1500591171,3473929485&fm=26&fmt=auto&gp=0.jpg'
          "
          mode="aspectFill"
          style="height: 40px; width: 40px"
          @tap="getPic('userA')"
        />
      </view>
    </view>
    <button style="margin-top: 30rpx" type="primary" @tap="send">确认</button>
  </view>
</template>
<script setup>
import Taro from "@tarojs/taro";
import { reactive } from "vue";
//缓存来的数据
const userObjs = Taro.getStorageSync("userObj");
const userObj = reactive({
  userA: {
    name: "",
    Avatar: "",
  },
  userB: {
    name: "",
    Avatar: "",
  },
});
Object.assign(userObj, userObjs);
//提交
const send = () => {
  let { userA, userB } = userObj;
  if (userA.name && userB.name && userA.Avatar && userB.Avatar) {
    Taro.setStorageSync("userObj", userObj);
    Taro.navigateTo({
      url: "/pages/index/index",
    });
  } else {
    Taro.showToast({
      icon: "none",
      title: "请完善信息",
    });
  }
};
const getPic = (key) => {
  Taro.chooseImage({
    count: 1, // 默认9
    sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths;
      userObj[key].Avatar = tempFilePaths[0];
      //   console.log(userObj[key]);
    },
  });
};
</script>
<script>
export default {
  onShareAppMessage(res) {
    return {
      title: "嘻嘻",
      path: "/pages/Mantle/Mantle",
      imageUrl: "https://s-sh-1851-miku.oss.dogecdn.com/02/1045019.jpg",
    };
  },
};
</script>
<style >
.user {
  background: #fff;
  z-index: 99999;
  padding: 20rpx;
  box-sizing: border-box;
  font-size: 40rpx;
}
.useflex {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}
input {
  border: 1px solid #efefef;
  padding: 0 10rpx;
  box-sizing: border-box;
  height: 80rpx;
  /* color: #3f51b5; */
}
</style>