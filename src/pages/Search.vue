<template>
  <div class="container">

    <!-- Search Input Form -->
    <el-form>
        <el-form-item class="search-form">
          <el-input v-model="searchText" class ="search-input"></el-input>
          <el-button type="primary" class="search-button" v-on:click="searchTodo(todoList,searchText)" icon="el-icon-search">検索</el-button>
        </el-form-item>
    </el-form>

    <!-- Search Result(Todo item) -->

      <div v-show="ifClickSearch">
        <el-alert class="alert-search" v-if="resultForTodo.length==0" type="error" :closable="false">対象のToDoは見つかりません</el-alert>
        <el-alert class="alert-search" v-else type="success" :closable="false">ToDoが{{this.numOfTodo}}件見つかりました</el-alert>
      </div>

    <div v-for="(item,index) in resultForTodo" v-bind:key="index"  class="todo-item">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{item.todoTitle}}</span>
          </div>
          <div class="todo-button" style="width:200px;float:right">
            <el-button type="success" round v-on:click="jumpToedit(item)" style="float:left">編集</el-button>
            <el-button :type="item.isDone?'primary':'danger'" round v-on:click="changeButton(item)" style="float:right">{{item.isDone?'完了':'未完了'}}</el-button>
          </div>
          <div class="text item" style="float:left">
            <p>期限：{{getDate(item.todoDDL)}}</p>
            <p>作成日：{{getDate(item.todoCreateData)}}</p>
          </div>
        </el-card>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import axios from 'axios'

export default {
  data () {
    return {
      searchText: '',
      ifClickSearch:false,
      numOfTodo:0,
      // numOfList:0,
      resultForTodo:[],
      // resultForTodoList:[],
      todoList: [],
      // username: '',
      isGettitle: false
    }
  },
  created () {
    // this.username = window.sessionStorage.user ? JSON.parse(window.sessionStorage.user).name : 'public'
  },
  methods: {
    searchTodo (lists, keyword) {
      var _this = this
      // var result_list = []
      var result_todo = []
      // console.log(_this.todoList[3].TodoItem)
      if (keyword) {

       console.log(this.searchText)

      axios.get('/api/searchTodoitem', {
        params: {
          keyword: this.searchText
          // user: _this.username
        }
      })
        .then(function (response) {
          _this.resultForTodo = response.data
          _this.numOfTodo = _this.resultForTodo.length
          // console.log('success')
          console.log(response.data)
          _this.ifClickSearch = true
        })
        .catch(function (error) {
          console.log(error)
        })
        // _this.resultForTodo = result_todo
        // _this.resultForTodoList = result_list


     }
    },
    jumpToedit (item) {
      // console.log(key)
      // console.log(item.id)
      // console.log(this.lists[item.id].title)
      // console.log(item._id)
      // var _this = this
      this.$router.push({
        name: 'Edit',
        params: {
          id: item.id
        }
      })
    },
    changeButton (item) {
      item.isDone = !item.isDone
      // console.log(item.isDone)
      var change = {
        // _id: item._id,
        // TodoTitle: item.TodoTitle,
        id: item.id,
        todoTitle: item.todoTitle,
        todoDDL: item.todoDDL,
        todoCreateData: item.todoCreateData,
        isDone: item.isDone
        // user: this.$route.params.user
      }
      axios.post('/api/changeIsdone', change)
        .then(function (response) {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      // this.getAllTodoitem()
      // this.getAllTodoitem()
    },
    getDate (item) {
      return moment(item).format('LL')
    },
    getTitle(item) {
      var _this = this
      console.log(item)
      // var result =  _.find(this.todoList, {id: item.id})
      var result = 'sss'+'hello'
      console.log(_this.isGettitle)
      axios.get('/api/getallTodoitem', {
        params: {
          _id: item._id,
          user: _this.username
        }
      })
        .then(function (response) {
          result = response.data[0].title
          // console.log('gettitle')
          // console.log(response.data[0])
          console.log(result)
          _this.isGettitle = true
          console.log(_this.isGettitle)
          return result
        })
        .catch(function (error) {
          console.log(error)
        })
      console.log(result)
      console.log(_this.isGettitle)

      // return result
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  width: 60%;
  padding-top:50px
}
.text {
  font-size: 10px;
  color:#a5a5a5
}
.search-button {
  float: right
}
.search-form {
  width: 100%;
  .search-input{
    width: 85%
  }
}
.alert-search {
  margin-bottom: 15px;
  margin-top: 15px
}
.todo-title:hover,.todolist-title:hover {
  color:#409EFF;
  cursor:pointer
}
</style>
