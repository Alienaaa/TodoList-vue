<template>
<div class="container">
  <div>
      <h1></h1>
      <h3 style="color:#666666">ToDoの内容を変更します</h3>
      <el-form label-position="left" label-width="80px" class="input-form">
        <el-form-item label="ToDo名">
          <el-input type="text" v-model="todoTitle" placeholder="todoTitle"/>
        </el-form-item>

        <el-form-item label="期限">
          <el-date-picker
            v-model="todoDDL"
            type="date"
            placeholder="todoDDL"
            class="datepicker">
          </el-date-picker>
          <el-button type="primary" class="addtodo-button" v-on:click="editTodo" icon="el-icon-refresh">更新</el-button>
        </el-form-item>

        <div class="alert-todo">
        <el-alert class="alert-todo-inner" v-show="isAlertShowDDL" title="期限は作成日の後にしてください" type="error" show-icon></el-alert>
        <el-alert class="alert-todo-inner" v-show="isAlertShowDDL2" title="期限を選択してください" type="error" show-icon></el-alert>
        <el-alert class="alert-todo-inner" v-show="isAlertShowNULL" title="ToDo名を必ず入力してください" type="error" show-icon></el-alert>
        <el-alert class="alert-todo-inner" v-show="isAlertShowOver" title="ToDo名を３０字以内にしてください" type="error" show-icon></el-alert>
        <el-alert class="alert-todo-inner" v-show="isAlertShowSame" title="入力したToDo名はすでに存在しています" type="error" show-icon></el-alert>
        </div>

      </el-form>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import axios from 'axios'

export default {
  data () {
    return {
      list: [],
      todoTitle: '',
      todoDDL: '',
      todoCreateData: '',
      isAlertShowDDL: false,
      isAlertShowDDL2: false,
      isAlertShowNULL: false,
      isAlertShowOver: false,
      isAlertShowSame: false,
      buttonType: 'danger',
      buttonText: '未完了',
      type: ''

    }
  },
  created () {
    this.getTodoItem()
  },
  methods: {
    getTodoItem () {
      var _this = this

      axios.get('/api/getTodoitem', {params: {id: _this.$route.params.id}})
        .then(function (response) {
          _this.list = response.data
          // console.log('success')
          console.log(_this.list.todoTitle)
          _this.todoTitle = _this.list.todoTitle
          _this.todoDDL = _this.list.todoDDL
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    editTodo () {
      var _this = this
      // エスケープ処理(不要)
      // v-textで出力なので、エスケープ処理は必要ない
      // this.TodoTitle = this.htmlEscape(this.TodoTitle)

      var checkTodo = false
      var checkDDL = false
      if (this.todoTitle.length === 0) {
        // ToDo名は空の時
        // console.log(this.todoTitle.length)
        this.isAlertShowNULL = true
      } else {
        this.isAlertShowNULL = false
        if (this.todoTitle.length >= 31) {
          // ToDo名は３１文字以上の時
          this.isAlertShowOver = true
        } else {
          this.isAlertShowOver = false
        }
        if (this.isInArray(this.list, this.todoTitle)) {
          // ToDo名はすでに存在している時
          this.isAlertShowSame = true
        } else {
          this.isAlertShowSame = false
        }
      }
      checkTodo = (!this.isAlertShowNULL) && (!this.isAlertShowOver) && (!this.isAlertShowSame)
      if (this.todoDDL === '') {
        // 期限は空の時
        this.isAlertShowDDL2 = true
      } else {
        this.isAlertShowDDL2 = false
        var today = new Date()
        if (moment(this.todoDDL).isBefore(today) || moment(this.todoDDL).isSame(today)) {
          // 期限は作成日の前
          this.isAlertShowDDL = true
        } else {
          // 期限は作成日の後
          this.isAlertShowDDL = false
        }
      }
      // console.log(this.$route.params.title)
      checkDDL = (!this.isAlertShowDDL2) && (!this.isAlertShowDDL)

      if (checkTodo && checkDDL) {
        var change = {

          id: _this.$route.params.id,
          todoTitle: _this.todoTitle,
          todoDDL: _this.todoDDL,
          todoCreateData: new Date(),
          isDone: _this.list.isDone
        }
        // console.log(item)
        // this.list.TodoItem.unshift(item)
        axios.post('/api/editTodoitem', change)
          .then(function (response) {
          // console.log('item')
            // console.log(item)
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
        _this.getTodoItem()
        _this.getTodoItem()

        _this.todoDDL = ''
        _this.todoTitle = ''
        _this.todoCreateData = ''

        // jump to homepage
        this.$router.push({name: 'Item'})
      }
    },
    isInArray (list, keyword) {
      // var TodoItem = list.TodoItem
      return _.find(list, {todoTitle: keyword})
    }
  }

}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  width: 70%
}
.text {
  font-size: 10px;
  color:#a5a5a5
}
.todo-item {
  margin-bottom: 20px;
    .el-card__body {
      padding-bottom: 5px;
      padding-top: 5px
    }
}
.item {
    margin-bottom: 0px;
  }
.input-form {
  width: 70%
}
.addtodo-button {
  float: right
}
.container {
  .el-date-editor {
    width: 70%
  }
}
.alert-list {
  margin-bottom: 20px
}
.alert-todo-inner {
  margin-bottom:10px
}
</style>
