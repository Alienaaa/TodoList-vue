<template>
  <div class="container">
    <div>
      <h1>{{getTitle()}}</h1>
      <h3 style="color:#666666">新しいToDoを作成する</h3>
      <el-form label-position="left" label-width="80px" class="input-form">
        <el-form-item label="ToDo名">
          <el-input type="text" v-model="TodoTitle"/>
        </el-form-item>

        <el-form-item label="期限">
          <el-date-picker
            v-model="TodoDDL"
            type="date"
            placeholder="Pick a day"
            class="datepicker">
          </el-date-picker>
          <el-button type="primary" class="addtodo-button" v-on:click="sendForm" icon="el-icon-plus">ToDoの追加</el-button>
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

    <div>
      <div v-if="list.TodoItem.length !== 0">
        <div v-for="(item,index) in list.TodoItem" v-bind:key="index"  class="todo-item">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>{{item.TodoTitle}}</span>
              <i class="el-icon-delete" style="float: right; cursor:pointer" autofocus="true" v-on:click="deleteTodoitem(item)"></i>
            </div>
            <el-button :type="item.isDone?'primary':'danger'" round v-on:click="changeButton(item)" style="float:right">{{item.isDone?'完了':'未完了'}}</el-button>
            <div class="text item">
              <p>期限：{{getDate(item.TodoDDL)}}</p>
              <p>作成日：{{getDate(item.TodoCreateData)}}</p>
            </div>
          </el-card>
        </div>
      </div>
      <div v-else>
        <el-alert title="登録されたToDoはございません" type="error"></el-alert>
      </div>
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
      lists: [],
      list: [],
      TodoItem: [],
      TodoTitle: '',
      TodoDDL: '',
      TodoCreateData: '',
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
    this.getAllTodoitem()
    console.log('list')
    console.log(this.list)
    // this.list = _.find(this.lists, {id: this.$route.query.id})
    // console.log(this.lists)
  },
  methods: {
    getTitle () {
      // this.list = this.lists[this.$route.query.id]
      return this.list.title
    },
    sendForm () {
      // var _this = this
      // this.list = this.lists[this.$route.query.id]
      // console.log(this.list.TodoItem)
      if (!this.list.TodoItem) {
        this.$set(this.list, 'TodoItem', [])
      }

      // エスケープ処理(不要)
      // v-textで出力なので、エスケープ処理は必要ない
      // this.TodoTitle = this.htmlEscape(this.TodoTitle)

      var checkTodo = false
      var checkDDL = false
      if (this.TodoTitle.length === 0) {
        // ToDo名は空の時
        // console.log(this.TodoTitle.length)
        this.isAlertShowNULL = true
      } else {
        this.isAlertShowNULL = false
        if (this.TodoTitle.length >= 31) {
          // ToDo名は３１文字以上の時
          this.isAlertShowOver = true
        } else {
          this.isAlertShowOver = false
        }
        if (this.isInArray(this.list, this.TodoTitle)) {
          // ToDo名はすでに存在している時
          this.isAlertShowSame = true
        } else {
          this.isAlertShowSame = false
        }
      }
      checkTodo = (!this.isAlertShowNULL) && (!this.isAlertShowOver) && (!this.isAlertShowSame)
      if (this.TodoDDL === '') {
        // 期限は空の時
        this.isAlertShowDDL2 = true
      } else {
        this.isAlertShowDDL2 = false
        var today = new Date()
        if (moment(this.TodoDDL).isBefore(today) || moment(this.TodoDDL).isSame(today)) {
          // 期限は作成日の前
          this.isAlertShowDDL = true
        } else {
          // 期限は作成日の後
          this.isAlertShowDDL = false
        }
      }
      console.log(this.$route.params.title)
      checkDDL = (!this.isAlertShowDDL2) && (!this.isAlertShowDDL)
      if (checkTodo && checkDDL) {
        var item = {
          user: this.$route.params.user,
          _id: this.list._id,
          title: this.$route.params.title,
          TodoTitle: this.TodoTitle,
          TodoDDL: this.TodoDDL,
          TodoCreateData: new Date(),
          isDone: false}
        console.log(item)
        // this.list.TodoItem.unshift(item)
        axios.post('/api/createTodoitem', item)
          .then(function (response) {
          // console.log('item')
            console.log(item)
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
        this.getAllTodoitem()
        this.getAllTodoitem()

        this.TodoDDL = ''
        this.TodoTitle = ''
        this.TodoCreateData = ''
      }
    },
    isInArray (list, keyword) {
      var TodoItem = list.TodoItem
      return _.find(TodoItem, {TodoTitle: keyword})
    },
    getDate (item) {
      return moment(item).format('LL')
    },
    changeButton (item) {
      // item.isDone = !item.isDone
      // console.log(item.isDone)
      var change = {
        _id: item._id,
        TodoTitle: item.TodoTitle,
        isDone: item.isDone,
        user: this.$route.params.user
      }
      axios.post('/api/changeIsdone', change)
        .then(function (response) {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      this.getAllTodoitem()
      this.getAllTodoitem()
    },
    htmlEscape (str) {
      if (!str) return
      return str.replace(/[<>&"'`]/g, function (match) {
        const escape = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#39;',
          '`': '&#x60;'
        }
        return escape[match]
      })
    },
    getAllTodoitem () {
      var _this = this
      // var item = {id: 0}
      console.log(_this.$route.meta)
      axios.get('/api/getallTodoitem', {
        params: {
          _id: _this.$route.params._id,
          user: _this.$route.params.user
        }
      })
        .then(function (response) {
          _this.list = response.data[0]
          // console.log('success')
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    deleteTodoitem (item) {
      var _this = this
      this.$confirm('本当に削除しますか？', '確認', {
        confirmButtonText: 'はい',
        cancelButtonText: 'いいえ',
        type: 'warning'
      }).then(() => {
        axios.post('/api/deleteTodoitem', {_id: item._id, user: this.$route.params.user, TodoTitle: item.TodoTitle})
          .then(function (response) {
            _this.$message({
              type: 'success',
              message: '削除成功!'
            })
            console.log(item.TodoTitle)
            _this.getAllTodoitem()
            _this.getAllTodoitem()
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: 'キャンセル済み'
        })
      })
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
.el-icon-delete {
  color:#F56C6C
}
.el-icon-delete:hover {
  color:rgb(250, 54, 54)
}
</style>
