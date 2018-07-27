<template>
<div id="Test" class="mdui-m-y-1">
  <div id="list-complete-demo" class="demo">
    <button v-on:click="add">Add</button>
    <button v-on:click="remove">Remove</button>
    <transition-group name="list-complete" tag="p">
      <span
        v-for="item in items"
        v-bind:key="item"
        class="list-complete-item"
      >
        {{ item }}
      </span>
    </transition-group>

    <table class="mdui-table">
      <thead>
        <tr>
          <th>描述(text)</th>
        </tr>
      </thead>
      <transition-group
        tag="tbody"
        name="asd"
      >
        <tr v-for="item in items" :key="item" class="asd-item">
          <td><span>{{ item }}</span></td>
        </tr>
      </transition-group>
    </table>
  </div>
</div>
</template>
<script>
export default {
  name: 'Test',
  props: ['message_rate', 'qq_online', 'qq_info', 'version_info', 'ws_exec'],
  data () {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.unshift(this.randomIndex())
    },
    remove: function () {
      this.items.pop()
    }
  }
}
</script>
<style>
.list-complete-item {
  transition: all 5s;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
.list-complete-leave-active {
  position: absolute;
}

.asd-item {
  transition: all 5s;
  margin-right: 10px;
}
.asd-enter, .asd-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
.asd-leave-active {
  position: absolute;
}
</style>
