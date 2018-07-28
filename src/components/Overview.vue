<template>
<div id="Overview">
    <div class="mdui-row" ref="headbar">
      <div class="mdui-col-xs-12 mdui-col-md-3 mdui-hidden-sm-down">
        <div class="mdui-card mdui-color-blue mdui-hoverable">
          <div class="mdui-card-media" :style="{height: headbar_height}">
            <img><h1 class="mdui-text-right mdui-text-color-white-text headbar">
              <span class="mdui-typo-display-2" :class="[qq_online ? '' : 'mdui-text-color-red']">{{ qq_online ? "在线" : "离线" }}</span>
            </h1></img>
            <div class="mdui-card-media-covered mdui-card-media-covered-transparent mdui-card-media-covered-top">
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">QQ在线</div>
                <div class="mdui-card-primary-subtitle">Online</div>
              </div></div></div></div></div>
      <div class="mdui-col-xs-12 mdui-col-md-3">
        <div class="mdui-card mdui-color-cyan mdui-hoverable">
          <div class="mdui-card-media" :style="{height: headbar_height}">
            <img><h1 class="mdui-text-right mdui-text-color-white-text headbar">
                <span class="mdui-typo-display-2 mdui-text-right">
                  {{ message_rate !== null? message_rate : null }}
                </span>
                <span class="mdui-typo-subheading-opacity">
                  {{ message_rate !== null ? '次/60s' : null }}
                </span>
            </h1></img>
            <div class="mdui-card-media-covered mdui-card-media-covered-transparent mdui-card-media-covered-top">
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">消息频率</div>
                <div class="mdui-card-primary-subtitle">Message Rate</div>
              </div></div></div></div></div>
      <div class="mdui-col-xs-12 mdui-col-md-3">
        <div class="mdui-card mdui-color-green mdui-hoverable">
          <div class="mdui-card-media" :style="{height: headbar_height}">
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
      <div class="mdui-col-xs-12 mdui-col-md-3 mdui-hidden-sm-down">
        <div class="mdui-card mdui-color-orange mdui-hoverable">
          <div class="mdui-card-media" :style="{height: headbar_height}">
            <img><h1 class="headbar">
                <span class="mdui-text-color-white-text mdui-toolbar-spacer mdui-typo-display-2 mdui-text-right">
                    {{ version_info ? version_info.plugin_version : null }}
                </span>
                <span class="mdui-typo-title-opacity mdui-text-color-black-icon">{{ version_info ? 'b(' +version_info.plugin_build_number + ')' : null }}</span>
            </h1></img>
            <div class="mdui-card-media-covered mdui-card-media-covered-transparent mdui-card-media-covered-top">
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">插件版本</div>
                <div class="mdui-card-primary-subtitle">Version</div>
              </div></div></div></div>
      </div>
    </div>
    <div class="mdui-table-fluid mdui-m-y-1">
      <table class="mdui-table" id="msg_log">
        <thead>
          <tr>
            <th>时间(time)</th>
            <th class="mdui-table-col-numeric">相关信息(tags)</th>
            <th>描述(text) 总共: {{ reversedTableData.length }} 条</th>
          </tr>
        </thead>
        <transition-group
          tag="tbody"
          name="table-row"
          enter-active-class="bounceInLeft"
          leave-active-class="bounceOutRight"
        >
          <tr v-for="data in reversedTableData" :key="data.id">
            <td>{{ data.time | moment("gggg.MM.D HH:mm:ss") }}</td>
            <td class="mdui-table-col-numeric">
              <div >
                <v-chip class="mdui-color-grey-300 mdui-hoverable mdui-shadow-4" v-for="i in data.info" :key="i.hash">
                  <v-avatar v-if="i.icon_pic_link">
                    <img :src="i.icon_pic_link" alt="trevor">
                  </v-avatar>
                    {{ i.text }}
                </v-chip>
              </div>
            </td>
            <td><span v-for="i in data.message" :key="i.hash">
              <span v-if="i.func === null" v-html="replaceBr(i.text)"></span>
              <span v-else-if="i.func === 'face'" class="mdui-text-color-orange" style="text-decoration:underline;">
                {{ '[表情:' + $cqcode.FaceCode[i.opts['id']] + ']' }}
              </span>
              <span v-else-if="i.func === 'at'" class="mdui-text-color-red" style="text-decoration:underline;">
                {{ '[@' + i.opts['qq'] + ']' }}
              </span>
              <span v-else-if="i.func === 'shake'" class="mdui-text-color-red" style="text-decoration:underline;">{{ ' 抖动 ' }}</span>
              <img v-else-if="i.func === 'image'" referrerpolicy="no-referrer" :src="i.opts['url']" style="height: 150px;width: auto;"/>
              <a v-else-if="i.func === 'share'" :href="i.opts['url']" target="view_window">{{ '[' + i.opts['title'] + ']' }}</a>
              <span v-else-if="i.func === 'dice'" class="mdui-text-color-green-500" style="text-decoration:underline;">{{ '[掷骰子:' + i.opts['type'] + ']' }}</span>
              <span v-else-if="i.func === 'rps'" class="mdui-text-color-green-500" style="text-decoration:underline;">{{ '[猜拳:' + (i.opts['type'] === '1' ? '石头' : i.opts['type'] === '2' ? '剪刀' : i.opts['type'] === '3' ? '布' : 'unknow' ) + ']' }}</span>
              <div v-else-if="i.func === 'sign'" class="mdui-card"  style="height: auto;width: 150px;">
                <div class="mdui-card-media">
                  <img :src="i.opts['image']"/>
                  <div class="mdui-card-media-covered mdui-card-media-covered-gradient">
                    <div class="mdui-card-primary">
                      <div class="mdui-card-primary-subtitle">{{ i.opts['title'] }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <vue-json-pretty v-else :data="i" deep="1" showLength="true"></vue-json-pretty>
            </span></td>
          </tr>
          <tr key="last">
            <td />
            <td />
            <td v-if="reversedTableData.length === 0">没有数据</td>
            <td v-else>{{ '已经到底了,总共' + reversedTableData.length + '条' }}</td>
          </tr>
        </transition-group>
      </table>
    </div>
</div>
</template>

<script>
import mdui from 'mdui'
export default {
  name: 'Overview',
  props: ['message_rate', 'qq_online', 'qq_info', 'version_info', 'ws_exec'],
  computed: {
    user_pic_link: function () {
      return this.qq_info ? 'http://q4.qlogo.cn/g?b=qq&s=140&nk=' + this.qq_info.user_id : null
    },
    reversedTableData: function () {
      return this.tableData.concat().reverse()
    }
  },
  data () {
    return {
      max_msg_log: 10,
      headbar_height: null,
      tableData: []
    }
  },
  updated () {
  },
  mounted () {
    this.$parent.$on('ws_onmessage', (event) => {
      // console.log('onmessage', event)
      this.msg_log(event)
    })
    this.headbar_height = this.get_headbar_height()
  },
  methods: {
    test (text) {
      this.ws_exec('send_private_msg', {
        user_id: 1172380450,
        message: text
      }).then((event) => {
        console.log('msg_id', event.data.message_id)
      })
    },
    replaceBr (text) {
      return text.replace(/\n/g, '<br />')
    },
    get_headbar_height: function () {
      if (this.$refs.headbar) {
        return this.$refs.headbar.offsetHeight + 'px'
      }
      return 'auto'
    },
    clear_cookie () {
      this.$cookie.delete('ws_host')
      this.$cookie.delete('ws_token')
    },
    format_tooltip (content) {
      return {
        content: content
      }
    },
    format_info_group (groupID) {
      return {
        text: '群:' + groupID,
        icon_pic_link: 'https://p.qlogo.cn/gh/' + groupID + '/' + groupID + '/140'
      }
    },
    format_info_user (userID, userType) {
      return {
        text: '' + userType + '(QQ:' + userID + ')',
        icon_pic_link: 'http://q4.qlogo.cn/g?b=qq&s=140&nk=' + userID
      }
    },
    msg_log (event) {
      let ret = {
        time: event.time,
        info: [],
        message: [],
        id: event.id
      }
      // console.log('message', event)
      while (this.tableData.length >= this.max_msg_log) {
        this.tableData.shift()
      }
      // 消息
      if (event.post_type === 'message') {
        ret.message = this.$cqcode.Parse(event.message)
        // console.log('message', ret.message)
        ret.info.push({text: '消息(id:' + event.message_id + ')'})
        this.$cqcode.Parse(event.message)
        if (event.message_type === 'private') {
          ret.info.push(this.format_info_user(event.user_id, '私聊消息'))
        } else if (event.message_type === 'group') {
          ret.info.push(this.format_info_group(event.group_id))
          if (event.sub_type === 'normal') {
            ret.info.push(this.format_info_user(event.user_id, '群消息'))
          } else if (event.sub_type === 'anonymous') {
            ret.info.push({text: '群匿名消息: ' + event.anonymous.name})
          } else if (event.sub_type === 'notice') {
            ret.info.push({text: '群通知'})
          }
        } else if (event.message_type === 'discuss') {
          ret.info.push({text: '讨论组:' + event.discuss_id})
        }
      } else if (event.post_type === 'notice') {
        ret.info.push({text: '通知'})
        // 通知
        if (event.notice_type === 'group_upload') {
          ret.info.push({text: '群文件上传'})
          ret.info.push(this.format_info_group(event.group_id))
          ret.info.push(this.format_info_user(event.user_id, '上传者'))
          ret.message.push({
            func: null,
            text: '文件名: "' + event.file.name + '", 大小: ' + event.file.size + 'byte'
          })
        } else if (event.notice_type === 'group_admin') {
          ret.info.push(this.format_info_group(event.group_id))
          if (event.sub_type === 'set') {
            ret.info.push(this.format_info_user(event.user_id, '设置管理员'))
          } else if (event.sub_type === 'unset') {
            ret.info.push(this.format_info_user(event.user_id, '取消管理员'))
          }
        } else if (event.notice_type === 'group_decrease') {
          ret.info.push(this.format_info_group(event.group_id))
          if (event.sub_type === 'leave') {
            ret.info.push(this.format_info_user(event.user_id, '退群'))
          } else if (event.sub_type === 'kick') {
            ret.info.push(this.format_info_user(event.user_id, '该人被踢出'))
            ret.info.push(this.format_info_user(event.operator_id, '操作者'))
          } else if (event.sub_type === 'kick_me') {
            ret.info.push(this.format_info_user(event.user_id, '登录号被踢'))
            ret.info.push(this.format_info_user(event.operator_id, '操作者'))
          }
        } else if (event.notice_type === 'group_increase') {
          ret.info.push(this.format_info_group(event.group_id))
          if (event.sub_type === 'approve') {
            ret.info.push(this.format_info_user(event.user_id, '进群'))
          } else if (event.sub_type === 'invite') {
            ret.info.push(this.format_info_user(event.user_id, '邀请入群'))
          }
          ret.info.push(this.format_info_user(event.operator_id, '操作者'))
        } else if (event.notice_type === 'friend_add') {
          ret.info.push(this.format_info_user(event.user_id, '好友已添加'))
        }
      } else if (event.post_type === 'request') {
        // 请求
        ret.info.push({text: '请求'})
        if (event.request_type === 'friend') {
          ret.info.push(this.format_info_user(event.user_id, '请求加好友'))
          ret.message.push({func: null, text: event.comment})
        } else if (event.request_type === 'group') {
          ret.info.push(this.format_info_group(event.group_id))
          if (event.sub_type === 'add') {
            ret.info.push(this.format_info_user(event.user_id, '请求加群'))
          } else if (event.sub_type === 'invite') {
            ret.info.push(this.format_info_user(event.user_id, '邀请登录号入群'))
          }
          ret.message.push({func: null, text: event.comment})
        }
      }
      mdui.updateTables('#msg_log')
      this.tableData.push(ret)
    }
  }
}
</script>
<style>
.headbar {
  margin: auto;
  position: absolute;
  bottom: 16px;
  right: 8px;
}
.mdui-col-md-3, .mdui-col-xs-12 {
  margin-top: 8px;
}
</style>
