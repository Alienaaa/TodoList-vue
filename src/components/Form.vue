<template>
 <div>
  <h1>{{username}}'s Todo List</h1>
    <form v-on:submit="sendForm" v-on:submit.prevent>
      <input type="text" v-model="titleText"/>
      <input type="submit" value='add' />
    </form>
  </div>
</template>

<script>
// import Store from '../Store.js'
/* eslint-disable */
export default {
  props: {
    username: {
      type: String,
      default: 'Unnamed'
    }
  },

  data () {
    return {
      titleText: ""
    }
  },

  methods: {
    sendForm () {
      if (this.titleText.length > 0) {
        const title = this.titleText;
        this.$emit("create-list", {
          title
        })
        this.titleText = ""
      }
    }
  }
}
</script>
