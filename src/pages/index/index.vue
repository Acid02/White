<template>
  <view class="white">
    <navbar :fixed="true" :title="!TitleDelay ? title : '对方正在输入...'" />

    <scroll-view
      class="content"
      :scroll-y="true"
      :scrollTop="scrollTop"
      :scroll-into-view="toView"
      :scroll-with-animation="true"
    >
      <view style="padding: 0 20rpx; box-sizing: border-box">
        <!-- 占位符 -->
        <view
          :style="{
            height: customBar + 10 + 'px',
          }"
        ></view>
        <!-- END -->
        <!-- <view class="Tips time">2021年9月6日 12:07</view> -->
        <!-- <view class="cervix cervixes">
        <view class="news"> 12点还叫睡得早？ 💐</view>
        <image class="Avatar" mode="aspectFill" src="../../static/admin.jpg" />
      </view>
      <view class="Tips withdraw">对方撤回了一条消息</view> -->

        <template v-for="(item, index) in information" :key="index">
          <!-- 消息类型 -->
          <view
            class="cervix"
            :class="[!item.jurisdiction && 'cervixes']"
            v-if="item.type == 'txt'"
          >
            <view class="news"> {{ item.content }} </view>
            <image
              class="Avatar"
              mode="aspectFill"
              :src="item.Avatar"
              :style="{
                animation:
                  lastIndex == index &&
                  'Clap 400ms cubic-bezier(.62,-0.91,.45,1.97);',
              }"
              @tap="onClap($event, item.jurisdiction, index)"
            />
          </view>
          <!-- 气泡提示 -->
          <view class="Tips withdraw" v-if="item.type == 'withdraw'">
            {{ item.content }}
          </view>
          <!-- 时间 -->
          <view class="Tips time" v-if="item.type == 'time'">
            {{ item.content }}
          </view>
        </template>

        <!-- <view class="cervix">
        <view class="news"> 你看看你，睡这么早起这么晚 </view>
        <image class="Avatar" mode="widthFix" src="../../static/admin.jpg" />
      </view> -->
        <!--
      <view class="cervix cervixes">
        <view class="news"> 12点还叫睡得早？ 💐{{ keyH }}</view>
        <image
          class="Avatar"
          mode="widthFix"
          src="../../static/admin.jpg"
        />
      </view>
      <view class="Tips time">2021年8月19日 11:07</view>
      <view class="Tips withdraw">你撤回了一条消息</view> -->
        <!-- 占位符 -->
        <view
          id="listBottom"
          style="clear: both"
          :style="{
            height: `calc(108rpx + env(safe-area-inset-bottom) + ${keyH}px)`,
          }"
        ></view>
        <!-- END -->
      </view>
    </scroll-view>
    <view
      class="footer"
      :style="[{ bottom: keyH + 'px' }, keyH == 0 && textStyle]"
    >
      <image
        src="../../static/voice.png"
        mode="heightFix"
        class="voice"
        @tap="voice"
      />
      <input
        type="text"
        class="text"
        v-model="InputVal"
        confirmType="send"
        :adjust-position="false"
        cursor-spacing="140"
        maxlength="120"
        :onFocus="onFocus"
        :onBlur="onBlur"
        :onConfirm="onConfirm"
      />
      <view class="sends" @tap="onConfirm">发送</view>
      <!-- <image
        src="../../static/send.png"
        mode="heightFix"
        class="send"
        @tap="onConfirm"
      /> -->
    </view>
  </view>
</template>

<script setup>
import navbar from "../../components/navbar/navbar.vue";
import informations from "../../utils/information";
import Taro from "@tarojs/taro";
import { ref, reactive, onMounted } from "vue";
import "./index.scss";
const keyH = ref(0);
const scrollTop = ref(0);
const toView = ref(null),
  InputVal = ref(""),
  title = ref("肖妍欣"),
  TitleDelay = ref(false),
  information = reactive(informations),
  textStyle = {
    height: "calc(108rpx + env(safe-area-inset-bottom))",
    "padding-bottom": "env(safe-area-inset-bottom)",
  };
//缓存来的数据
const { userA, userB } = Taro.getStorageSync("userObj");
if (userB.name) {
  title.value = userB.name;
}
// 第一次短消息
onMounted(() => {
  if (information.length == 0)
    setTimeout(() => {
      Message({ content: curentTime(), type: "time" });
      Message({ content: `${userA.name || ""}  我喜欢你`, type: "txt" });
    }, 500);

  setTimeout(() => {
    information[1].content = "对方撤回了一条消息";
    information[1].type = "withdraw";
    // Message({ content: "对方撤回了一条消息", type: "withdraw" });
  }, 1800);
});

// console.log(userA, userB);
// 焦点
const onFocus = (e) => {
  let { height } = e.detail;
  keyH.value = height;
  onBottom();
};

// 失去焦点
const onBlur = () => {
  keyH.value = 0;
  toView.value = null;
};
//怕一拍
const lastTime = ref(0),
  lastIndex = ref(null);
const onClap = (e, jurisdiction, index) => {
  if (lastTime.value != 0) {
    if (e.timeStamp - lastTime.value < 500) {
      Taro.vibrateLong();
      let txt = jurisdiction ? "自己" : ` "${title.value}" 的脸并亲了一口`;
      Message({
        content: `我拍了拍${txt}`,
        type: "withdraw",
      });
      lastIndex.value = index;
      setTimeout(() => {
        lastIndex.value = null;
      }, 400);
    }
  }
  lastTime.value = e.timeStamp;
};
// 发送消息
const isInputVal = ref(true);
const onConfirm = () => {
  if (!InputVal.value || !isInputVal.value) return;
  qingyunke({ msg: InputVal.value });
  //发送消息
  Message({
    content: InputVal.value,
    jurisdiction: true,
    Avatar: "../../static/admin.jpg",
    nickname: "02",
    type: "txt",
  });

  InputVal.value = "";
};
//播放音乐
const innerAudioContext = Taro.createInnerAudioContext();
innerAudioContext.src =
  "https://music.163.com/song/media/outer/url?id=1804412204.mp3";
const Isvoice = ref(true),
  txt = ref("好想爱这个世界啊！❤");
const voice = () => {
  if (Isvoice.value) {
    Isvoice.value = isInputVal.value = false;
    Taro.vibrateShort();
    Taro.playBackgroundAudio({
      dataUrl: "https://music.163.com/song/media/outer/url?id=1804412204.mp3",
      title: "好想爱这个世界啊（翻自 花花）",
      coverImgUrl:
        "https://p1.music.126.net/30xvjsSF_WqnGN1G763eHQ==/109951165542166250.jpg?param=90y90",
    });
    InputVal.value = "";
    for (let i = 0; i <= txt.value.length; i++) {
      setTimeout(() => {
        InputVal.value = txt.value.slice(0, i);
      }, i * 200);
    }
    setTimeout(() => {
      isInputVal.value = true;
      onConfirm();
    }, txt.value.length * 200 + 200);
  } else {
    // Taro.stopBackgroundAudio()
  }
};
Taro.onBackgroundAudioStop((callback) => {
  Isvoice.value = true;
});
// 机器人回复
const qingyunke = ({ msg = "" } = {}) => {
  TitleDelay.value = true;
  //关键字回复
  if (msg == txt.value) {
    setTimeout(() => {
      toView.value = null;
      Message({ content: "你说教堂的白鸽会不会亲吻田野的乌鸦.🤞" });
      TitleDelay.value = false;
    }, 2000);
    return;
  }

  Taro.request({
    url: "https://api.qingyunke.com/api.php?key=free&appid=0&", //仅为示例，并非真实的接口地址
    data: {
      msg,
    },
    header: {
      "content-type": "application/json", // 默认值
    },
    success: function (res) {
      toView.value = null;
      let { content } = res.data;
      if (userB.name) {
        content = content.replace(/菲菲/g, userB.name);
      }
      Message({ content });
      TitleDelay.value = false;
    },
  });
};

// 消息类型
const Message = ({
  content = "",
  jurisdiction = false,
  Avatar = "../../static/wx.jpg",
  nickname = "test",
  type = "txt",
} = {}) => {
  let obj = {
    content,
    jurisdiction,
    Avatar,
    nickname,
    type,
  };
  if (userA.Avatar) {
    if (jurisdiction) {
      obj.Avatar = userA.Avatar;
    } else {
      obj.Avatar = userB.Avatar;
    }
  }

  information.push(obj);
  onBottom();
};
//滚动到底部
const onBottom = () => {
  toView.value = null;
  setTimeout(() => {
    toView.value = "listBottom";
    setTimeout(() => {
      toView.value = null;
    }, 100);
  }, 0);
};
// 获取当前时间

function curentTime() {
  let now = new Date();

  let year = now.getFullYear(); //年
  let month = now.getMonth() + 1; //月
  let day = now.getDate(); //日

  let hh = now.getHours(); //时
  let mm = now.getMinutes(); //分
  let ss = now.getSeconds(); //分

  let clock = year + "年";

  // if (month < 10) clock += "0";

  clock += month + "月";

  // if (day < 10) clock += "0";

  clock += day + "日 ";

  if (hh < 10) clock += "0";

  clock += hh + ":";
  if (mm < 10) clock += "0";
  clock += mm + " ";

  // if (ss < 10) clock += "0";
  // clock += ss;
  return clock;
}
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