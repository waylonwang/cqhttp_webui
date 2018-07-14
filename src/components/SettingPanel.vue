<template>
  <div id="SettingPanel">
    <div class="mdui-dialog" id="setting-dialog" ref="setting_dialog">
      <div class="mdui-dialog-title">
        <span href="javascript:;" class="mdui-typo-headline"><i class="mdui-icon material-icons">settings</i>设置</span>
      </div>
      <div class="mdui-dialog-content">
        <div class="mdui-textfield mdui-textfield-floating-label" id="stting_ws_host">
          <label class="mdui-textfield-label">HTTP API插件ws监听地址</label>
          <input class="mdui-textfield-input" v-model="ws_host" name="ws_host" type="url" ref="ws_host" pattern="(ws|wss):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?" required/>
          <div class="mdui-textfield-error">请输入一个正确的websocket链接</div>
          <div class="mdui-textfield-helper">例: ws://127.0.0.1:7980</div>
        </div>
        <div class="mdui-textfield mdui-textfield-floating-label" id="stting_ws_token">
          <label class="mdui-textfield-label">accessToken</label>
          <input class="mdui-textfield-input" type="text" name="ws_token" v-model="ws_token"/>
          <div class="mdui-textfield-helper">如无,则不填或者打个空格</div>
        </div>
        <h3><strong>
          PS：以上参数的详细意义请查询插件的
          <a href="https://cqhttp.cc/docs/4.2/#/Configuration?id=%E9%85%8D%E7%BD%AE%E9%A1%B9" target="view_window">官方文档</a>
          或者
          <a href="https://github.com/richardchien/coolq-http-api/" target="view_window">项目主页</a>
        </strong></h3>
      </div>
      <div class="mdui-dialog-actions">
        <div class="mdui-row-xs-3">
          <div class="mdui-col">
            <button class="mdui-btn mdui-btn-block mdui-color-grey mdui-ripple mdui-btn-raised" mdui-dialog-close>取消</button>
          </div>
          <div class="mdui-col">
            <button class="mdui-btn mdui-btn-block mdui-color-theme mdui-btn-raised" @click="test">测试</button>
          </div>
          <div class="mdui-col">
            <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple mdui-btn-raised mdui-text-lowercase" mdui-dialog-confirm>确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mdui from 'mdui'
export default {
  name: 'SettingPanel',
  data () {
    return {
      ws: null,
      ws_host: null,
      ws_token: null,
      setting_dialog: null,
      is_pattern_ws_host: true
    }
  },
  mounted () {
    this.setting_dialog = new mdui.Dialog('#setting-dialog', {overlay: true, modal: true, history: false, closeOnEsc: false, closeOnConfirm: false})
    let dialog = document.getElementById('setting-dialog')

    dialog.addEventListener('confirm.mdui.dialog', this.onconfirm)
    dialog.addEventListener('closed.mdui.dialog', this.onclosed)
    dialog.addEventListener('opened.mdui.dialog', this.opened)
  },
  watch: {
    ws_host: function (NewValue, OldValue) {
      this.is_pattern_ws_host = this.$refs.ws_host.checkValidity()
    }
  },
  computed: {
  },
  methods: {
    open () {
      this.ws_host = this.$cookie.get('ws_host')
      this.ws_token = this.$cookie.get('ws_token')
      this.setting_dialog.open()
    },
    test () {
    },
    onconfirm (event) {
      let inst = event._detail.inst
      // console.log('setting_confirm', {ws_host: this.ws_host,ws_token: this.ws_token,})
      if (!this.$refs.ws_host.checkValidity()) {
        return
      }
      // this.$cookie.delete('ws_host')
      this.$cookie.set('ws_host', this.ws_host, 1)
      // this.$cookie.delete('ws_token')
      this.$cookie.set('ws_token', this.ws_token, 1)

      // this.$router.go(0) //刷新页面
      inst.close()
      this.$emit('onconfirm')
    },
    onclosed (event) {
      // console.log('setting_closed')
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }

      this.$emit('oncancle')
    },
    opened (event) {
      mdui.mutation('#stting_ws_host')
      mdui.mutation('#stting_ws_token')
      this.setting_dialog.handleUpdate()
      this.$emit('onopen')
    }
  }
}
</script>
