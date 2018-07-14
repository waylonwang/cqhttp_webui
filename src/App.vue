<template>
  <div id="app">
    <div class="mdui-appbar mdui-appbar-fixed">
      <div class="mdui-toolbar mdui-color-theme">
        <a href="javascript:;" class="mdui-btn mdui-btn-icon" @click="aaa"><i class="mdui-icon material-icons">menu</i></a>
        <a href="javascript:;" class="mdui-typo-headline">CQHttp Panel</a>
        <a href="javascript:;" class="mdui-typo-title">{{ this.$route.name }}</a>
        <div class="mdui-toolbar-spacer"></div>
        <a class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-text-lowercase">
          <span>QQ</span>
          <span>|</span>
          <span :class="[qq_online ? 'mdui-text-color-blue' : 'mdui-text-color-red']">{{ qq_online ? "O" : "X" }}</span>
        </a>
        <a class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-text-lowercase" @click="ws_init">
          <span>ws</span>
          <span>|</span>
          <span :class=' ws ? ( ws.readyState==1 ? "mdui-text-color-blue" : "mdui-text-color-red" ) : "mdui-text-color-red" '>{{ ws ? (ws.readyState==1 ? "O" : "X") : "X" }}</span>
        </a>
        
        <a href="https://github.com/ma6254/" target="view_window" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">help</i></a>
        <a href="javascript:;" class="mdui-btn mdui-btn-icon" @click="open_setting"><i class="mdui-icon material-icons">settings</i></a>
      </div>
    </div>

    <div class="mdui-drawer mdui-drawer-close mdui-color-grey-100" id="drawer" overlay=true>
      <ul class="mdui-list">
        <li class="mdui-list-item mdui-ripple" @click="jump('#')">
          <i class="mdui-list-item-icon mdui-icon material-icons">home</i>
          <div class="mdui-list-item-content">概览</div>
        </li>
      </ul>
    </div>

    <div class="mdui-container">
      <router-view :qq_online="qq_online" :qq_info="qq_info" :version_info="version_info" :ws_exec="ws_exec" :message_rate="message_rate"/>
    </div>

    <setting-panel ref="setting_panel" @onconfirm="setting_onconfirm" @oncancle="setting_oncancle" />
  </div>
</template>

<script>
import mdui from 'mdui'
mdui.mutation()

let e = {
  name: 'App',
  data() {
    return{
      timer_id: null,
      timer_id_reconnect: null,
      ws: null,
      ws_host: "ws://192.168.0.163:7980",
      ws_token: "12345",
      message_count: 0,
      message_rate: null,
      message_rate_count: 0,
      message_rate_interval: 20*1000,
      message_rate_timer_id: null,
      qq_online: null,
      qq_info: null,
      version_info: null,

      global_snackbar: null,
      
      setting_dialog: null,
      setting_ws: null,
      setting_ws_host: null,
      setting_ws_token: null,

      is_pattern_setting_ws_host: true,
    }
  },
  computed: {
  },
  mounted() {
    console.log("mounted")
    this.ws_init()
  },
  beforeDestroy() {
    console.log("beforeDestroy")
    if (this.ws)this.ws.close()
    this.destroy()
  },
  watch: {
  },
  methods: {
    aaa() {
      var drawer = new mdui.Drawer('#drawer')
      drawer.toggle()
    },
    jump(path) {
      window.location.href= path
    },
    open_setting() {
      //console.log('setting_open')
      this.$refs.setting_panel.open()
    },
    setting_oncancle() {
      if ((this.ws != null ) && (this.ws.readyState == 1)) {
        return
      }
      if (! this.check_cookie()) {
        if (this.global_snackbar) this.global_snackbar.close()
        this.global_snackbar = mdui.snackbar({message: '参数缺失，请设置参数', timeout: 0, closeOnOutsideClick: false, onOpened: ()=>{
          this.open_setting()
        }})
        return
      }
    },
    setting_onconfirm() {
      if(this.ws){
        this.ws.close()
        this.ws = null
      }
      this.destroy()
      this.ws_init()
    },
    check_cookie() {
      if (! this.$cookie.get('ws_host')) {
        return false
      }
      return true
    },
    async ws_init() {
      console.log("ws_init","start.")
      if (! this.check_cookie()) {
        this.global_snackbar = mdui.snackbar({message: '参数缺失，请设置参数', timeout: 0, closeOnOutsideClick: false, onOpened: ()=>{
          this.open_setting()
        }})
        return
      }
      this.ws_host = this.$cookie.get('ws_host')
      this.ws_token = this.$cookie.get('ws_token')
      if ((this.ws != null ) && (this.ws.readyState == 1)) {
        this.global_snackbar = mdui.snackbar({message: '重复连接'})
        return
      }
      this.ws_exec("get_status")
      .then((event) => {
        clearInterval(this.timer_id_reconnect)
        this.timer_id_reconnect = null
        
        this.timer_tick()
        this.refresh_login_info()
        this.refresh_version_info()
        this.ws = new WebSocket(this.ws_host + "/event/?access_token="+ this.ws_token)
        this.ws.onopen = this.ws_onopen
        this.ws.onmessage = this.ws_onmessage
        this.ws.onerror = this.ws_onerror
        this.ws.onclose = this.ws_onclose
      })
      .catch((event) => {
        if (event == "authorization failed") {
          console.log("ws_init_catch", event)
          this.global_snackbar = mdui.snackbar({message: 'Token无效' , timeout: 0, closeOnOutsideClick: false, buttonText: "x"})
          return
        }
        if (event == "connect failed") {
          console.log("ws_init_catch", event)
          if (this.global_snackbar) this.global_snackbar.close()
          this.global_snackbar = mdui.snackbar({message: '无法连接', timeout: 0})
          if (this.timer_id_reconnect) {
            clearInterval(this.timer_id_reconnect)
          }
          this.timer_id_reconnect = setTimeout(this.ws_init,5000)
          return
        }
        if (event.status) {
          console.log("ws_init_catch", event)
          return
        }
        console.log("ws_init_catch_unknow", event)
      })
    },
    ws_onopen(event) {
      console.log("ws_init", "success ")
      if(this.global_snackbar) this.global_snackbar.close()
      this.global_snackbar = mdui.snackbar({message: '连接成功', timeout: 1000})
      this.timer_id = setInterval(this.timer_tick, 30000)
      this.message_rate = 0
      this.message_rate_timer_id =  setInterval(() => {
        let new_rate = this.message_rate_count * ( 60000 / this.message_rate_interval )
        if (this.message_rate != new_rate){
          console.log("message_rate_update", new_rate)
        }
        this.message_rate = new_rate
        this.message_rate_count = 0
      }, this.message_rate_interval)
    },
    ws_onmessage(event) {
      if (event.data == "authorization failed") {
        //mdui.snackbar({message: 'token无效'});
        this.ws.close()
        return
      }
      this.message_rate_count +=1 ;
      //console.log("onmessage", event.data)
    },
    ws_onerror(event) {
      console.log("ws_onerror", event)
      this.destroy()
      this.timer_id_reconnect = setTimeout(this.ws_init,1000)
    },
    ws_onclose(event) {
      console.log("ws_onclose", event)
      this.destroy()
    },
    async ws_exec(action, params) {
      return new Promise((resolve, reject) => {
        let s_ws = new WebSocket(this.ws_host + "/api/?access_token=" + this.ws_token)
        let timerout_id = setTimeout(() => {
          s_ws.close()
          //console.log("s_ws timeout")
          //reject("timeout")
        }, 5000)
        s_ws.onerror = function(event) {
          clearInterval(timerout_id)
          //console.log("s_ws error", event)
          reject("connect failed")
          return
        }
        s_ws.onopen = function(event) {
          clearInterval(timerout_id)
          s_ws.send(JSON.stringify({
            action: action,
            params: params
          }))
        }
        s_ws.onmessage = (event) => {
          clearInterval(timerout_id)
          if (event.data == "authorization failed") {
            s_ws.close()
            reject(event.data)
            return
          }
          let result = JSON.parse(event.data)
          //console.log(result)
          if (result.status != "ok"){
            reject(result)
          }
          resolve(result)
        }
      })
    },
    destroy() {
      console.log("destroy")
      this.qq_online = null
      this.qq_info = null
      this.version_info = null
      if (this.timer_id){
        clearInterval(this.timer_id)
        this.timer_id = null
      }
      if (this.message_rate_timer_id){
        clearInterval(this.message_rate_timer_id)
        this.message_rate_timer_id = null
      }
      this.message_rate = null
      this.message_rate_count = 0
      this.message_rate_timer_id = null
      if (this.timer_id_reconnect)
        clearInterval(this.timer_id_reconnect)
        this.timer_id_reconnect = null
      if (this.global_snackbar) {
        this.global_snackbar.close()
      }
    },
    refresh_status() {
      let p = this.ws_exec("get_status")
      p.then((event) => {
        this.qq_online = event.data.online
        console.log("get_status", event)
      }).catch(() => {})
      return p
    },
    refresh_login_info() {
      let p = this.ws_exec("get_login_info")
      p.then((event) => {
        this.qq_info = event.data
        //console.log("get_login_info", event.data)
      }).catch(() => {})
      return p
    },
    refresh_version_info() {
      let p = this.ws_exec("get_version_info")
      p.then((event) => {
        this.version_info = event.data
      })
      return p
    },
    timer_tick() {
      this.refresh_status()
      .then((event) => {
        //console.log("timer_status_then", event)
      })
      .catch((event) => {
        console.log("timer_status_catch", event)
      })
    },
    // test func
    bbb() {
      console.log("Fuck.")
    }



  }
}
export default e
</script>

<style>
</style>
