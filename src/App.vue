<template>
  <div id="app">
    <el-menu
      :default-active="$route.path"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409EFF"
      router>
      <el-menu-item index="/" style="font-size:25px font-weight=bold padding-left=150px">TodoList</el-menu-item>
      <el-menu-item index="/search" class="search-menu" style="float:right">検索</el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
import Todo from './components/Todo.vue'

export default {
  name: 'App',
  components: {
    'todo': Todo
  }
}
</script>

<style>
.el-menu-item {
  font-size: 25px;
  padding-left: 130px;
  padding-right: 130px;
  border-bottom: 5px
}
</style>
