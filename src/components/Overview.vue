<template>
<div id="Overview" class="">
    <br />
    <div class="mdui-row">
      <div class="mdui-col-md-3 mdui-hidden-sm-down">
        <div class="mdui-card mdui-color-blue mdui-hoverable">
          <div class="mdui-card-media">
            <img><h1 class="mdui-text-right mdui-m-r-1 mdui-text-color-white-text mdui-typo-display-2"><br/>
              <span :class="[qq_online ? '' : 'mdui-text-color-red']">{{ qq_online ? "在线" : "离线" }}</span>
            </h1></img>
            <div class="mdui-card-media-covered mdui-card-media-covered-transparent mdui-card-media-covered-top">
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">QQ在线</div>
                <div class="mdui-card-primary-subtitle">Online</div>
              </div></div></div></div></div>
      <div class="mdui-col-md-3 mdui-hidden-sm-down">
        <div class="mdui-card mdui-color-cyan mdui-hoverable">
          <div class="mdui-card-media">
            <img class="mdui-typo"><h1 class="mdui-text-right mdui-m-r-1 mdui-text-color-white-text mdui-typo-display-2"><br/>
              <div class="mdui-row mdui-m-r-1">
                <div class="mdui-col-xs-10">
                  <div>
                    {{ message_rate != null? message_rate : "N/A"  }}
                  </div>
                </div>
                <div class="mdui-col-xs-2">
                  <div class="mdui-typo-subheading-opacity">次/60s</div>
                </div>
              </div>
            </h1></img>
            <div class="mdui-card-media-covered mdui-card-media-covered-transparent mdui-card-media-covered-top">
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">消息频率</div>
                <div class="mdui-card-primary-subtitle">Message Rate</div>
              </div></div></div></div></div>
      <div class="mdui-col-md-3">
        <div class="mdui-card mdui-color-green mdui-hoverable">
          <div class="mdui-card-media">
            <div class="mdui-row mdui-p-r-1 mdui-p-t-1">
              <div class="mdui-col-xs-9 mdui-clearfix">
               </div>
              <div class="mdui-col-xs-3">
                <img class="mdui-img-circle mdui-shadow-6 mdui-float-right" :class="qq_info ? '' : 'mdui-invisible' " :src='user_pic_link' style="height: 65px; width: 65px;" />
              </div>
            </div>
            <img><div class="mdui-text-right mdui-p-r-1 mdui-text-color-white-text">
              <h1 class="mdui-typo-headline">{{ qq_info ? qq_info.user_id : "N/A" }}</h1>
              <h1 class="mdui-typo-subheading-opacity" >{{ qq_info ? qq_info.nickname : "N/A" }}</h1>
            </div></img>
            <div class="mdui-card-media-covered mdui-card-media-covered-transparent mdui-card-media-covered-top">
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">登录号</div>
                <div class="mdui-card-primary-subtitle">User Info</div>
              </div></div></div></div></div>
      <div class="mdui-col-md-3 mdui-hidden-sm-down">
        <div class="mdui-card mdui-color-orange mdui-hoverable">
          <div class="mdui-card-media">
            <img class="mdui-typo"><h1 class="mdui-text-right mdui-m-r-1 mdui-text-color-white-text mdui-typo-display-2"><br/>
              <div class="mdui-row mdui-m-r-1">
                <div class="mdui-col-xs-8">
                  <div>
                    {{ version_info ? version_info.plugin_version : "N/A" }}
                  </div>
                </div>
                <div class="mdui-col-xs-4">
                  <div class="mdui-typo-display-1-opacity">{{ version_info ? "(b" +  version_info.plugin_build_number + ")" : "N/A"}}</div>
                </div>
              </div>
            </h1></img>
            <div class="mdui-card-media-covered mdui-card-media-covered-transparent mdui-card-media-covered-top">
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">插件版本</div>
                <div class="mdui-card-primary-subtitle">Version</div>
              </div></div></div></div>
      </div>
    </div>

    <h1 @click="test">test</h1>
    <button class="mdui-btn mdui-btn-raised" @click="clear_cookie">Clear Cookie</button>


</div>
</template>

<script>
import mdui from 'mdui'
export default {
  name: 'Overview',
  props: ['message_rate', 'qq_online', 'qq_info', 'version_info', 'ws_exec'],
  computed: {
    user_pic_link: function() {
      return this.qq_info ?  "http://q4.qlogo.cn/g?b=qq&s=0&nk=" + this.qq_info.user_id : null
    }
  },
  methods: {
    test() {
      this.ws_exec("send_private_msg", {
        user_id: 1172380450,
        message: this.user_pic_link
      }).then((event) => {
        console.log("msg_id", event.data.message_id)
      })
    },
    clear_cookie() {
      this.$cookie.delete("ws_host")
      this.$cookie.delete("ws_token")
    }
  }
}
</script>

<style>
</style>