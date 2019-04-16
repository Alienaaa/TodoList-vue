<template>

  <div id="todo" class="container" v-cloak>
    <!-- header -->
    <div>
      <el-row>
        <el-col :span="14">
          <h2>{{getUsername()}}のTodoリスト</h2>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" class="user-log" v-show="isLogin === false" v-on:click="loginVisible = true" style="float:right">ログイン</el-button>
          <el-button type="text"  class="user-log" v-show="isLogin === true" v-on:click="userLogout" style="float:right">ログアウト</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- log in & register dialog -->
    <div>
      <!-- Log in -->
      <el-dialog title="ログイン" :visible.sync="loginVisible" center>
        <el-form :model="login">
          <el-form-item label="ユーザID" :label-width="formLabelWidth">
            <el-input v-model="login.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="パスワード" :label-width="formLabelWidth">
            <el-input v-model="login.pass" autocomplete="off" type="password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <div>
            <el-button v-on:click="loginVisible = false">キャンセル</el-button>
            <el-button type="primary" v-on:click="userLogin">ログイン</el-button>
          </div>
          <div>
            <span style="font-size:10px;color:#a5a5a5">まだ登録されていません？</span>
            <el-button type="text" v-on:click="clickChangeButton">新規登録</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- Register -->
      <transition name="el-fade-in-linear">
      <el-dialog title="ユーザ新規登録" :visible.sync="registerVisible" center>
        <el-form :model="register">
          <el-form-item label="ユーザID" :label-width="formLabelWidth">
            <el-input v-model="register.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="パスワード" :label-width="formLabelWidth">
            <el-input v-model="register.pass" autocomplete="off" type="password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <div>
            <el-button v-on:click="registerVisible = false">キャンセル</el-button>
            <el-button type="primary" v-on:click="userRegister">新規登録</el-button>
          </div>
          <div>
            <span style="font-size:10px;color:#a5a5a5">すでに登録されていますか？</span>
            <el-button type="text" v-on:click="loginVisible = true; registerVisible = false">ログイン</el-button>
          </div>
        </div>
      </el-dialog>
      </transition>
    </div>
    <!-- input form -->
    <div>
      <h3 style="color:#666666">新しいToDoを作成する</h3>
      <el-form class="container-form">
        <el-form-item class="addlist-form">
          <el-input v-model="titleText" placeholder="リスト名を入力ください" class ="addlist-input"></el-input>
          <el-button type="primary" class="addlist-button" v-on:click="sendForm" icon="el-icon-edit">リストの作成</el-button>
        </el-form-item>
      </el-form>
      <div class="alert-list">
        <el-alert v-show="isAlertShowListNULL" title="ToDo名を必ず入力してください" type="error" show-icon></el-alert>
        <el-alert v-show="isAlertShowListOver" title="ToDo名を３０字以内にしてください" type="error" show-icon></el-alert>
        <el-alert v-show="isAlertShowListSame" title="入力したToDo名はすでに存在しています" type="error" show-icon></el-alert>
      </div>
    </div>
    <!-- lists container -->
    <div>
      <transition name="el-fade-in-linear">
        <div v-if="createSuccess" style="padding-bottom:20px">
          <el-alert title="新しいToDoリストが作成されました" type="success" show-icon></el-alert>
        </div>
      </transition>
      <div v-if="lists.length === 0 && isGet">
        <el-alert title="登録されたToDoリストはございません" type="error"></el-alert>
      </div>
      <div v-else>
        <div v-for="(item,index) in sortBycreatedate" v-bind:key="index"  class="todo-list">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="todolist-title" v-on:click="jumpTolist(index,item)">{{item.title}}</span>
              <i class="el-icon-delete" style="float: right; cursor:pointer" autofocus="true" v-on:click="deleteTodolist(item)"></i>
            </div>
            <div class="text item" v-if="(approachingDDL(item) === -1)">
              <p>ToDoはございません</p>
            </div>
            <div v-else class="text item">
              <p>{{item.TodoItem.length}}個中{{isChecked(item).length}}個がチェック済み</p>
              <p v-if="(approachingDDL(item) === -2)">登録されたToDoは全てチェック済み</p>
              <p v-else >~{{getDate(approachingDDL(item))}}</p>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import axios from 'axios'
import { setTimeout } from 'timers'

export default {
  name: 'Todo',
  data () {
    // const lists = Store.fetch()
    return {
      lists: [],
      titleText: '',
      nextID: 0,
      listsSort: [],
      listCreateData: '',
      isAlertShowListOver: false,
      isAlertShowListNULL: false,
      isAlertShowListSame: false,
      loginVisible: false,
      registerVisible: false,
      username: '',
      login: {
        name: '',
        pass: ''
      },
      register: {
        name: '',
        pass: ''
      },
      createSuccess: false,
      formLabelWidth: '120px',
      isLogin: false,
      isGet: false
    }
  },
  created () {
    // var _this = this
    this.username = window.sessionStorage.user ? JSON.parse(window.sessionStorage.user).name : 'public'
    if (window.sessionStorage.user) {
      this.isLogin = true
    }
    this.$nextTick(() => {

    })
    this.getAllTodolist()
  },
  computed: {
    sortBycreatedate () {
      var _this = this

      var listsSort = _this.lists
      listsSort.sort(function (itemA, itemB) {
        if (itemA.TodoItem.length === 0) {
          var tempA = itemA.listCreateData
        } else {
          tempA = _this.getMostrecentdate(itemA.TodoItem)
        }
        if (itemB.TodoItem.length === 0) {
          var tempB = itemB.listCreateData
        } else {
          tempB = _this.getMostrecentdate(itemB.TodoItem)
        }

        if (moment(tempA).isAfter(tempB)) {
          // console.log('after')
          return -1
        } else if (moment(tempA).isSame(tempB)) {
          // console.log('same')
          return 0
        } else {
          // console.log('before')
          return 1
        }
      })
      // console.log(listsSort)
      // console.log(_this.lists)
      return listsSort
    }

  },
  methods: {
    sendForm () {
      var _this = this
      var checkList = false
      if (this.titleText.length === 0) {
        // ToDo名は空の時
        this.isAlertShowListNULL = true
      } else {
        this.isAlertShowListNULL = false
        if (this.titleText.length >= 31) {
          // ToDo名は３１文字以上の時
          this.isAlertShowListOver = true
        } else {
          this.isAlertShowListOver = false
        }
        if (this.isInArray(this.lists, this.titleText)) {
          // ToDo名はすでに存在している時
          this.isAlertShowListSame = true
        } else {
          this.isAlertShowListSame = false
        }
      }
      checkList = (!this.isAlertShowListNULL) && (!this.isAlertShowListOver) && (!this.isAlertShowListSame)

      // console.log(username)
      if (checkList) {
        var item = {
          id: this.nextID,
          title: this.titleText,
          listCreateData: new Date(),
          TodoItem: [],
          user: this.username}

        axios.post('/api/createTodolist', item)
          .then(function (response) {
            _this.createSuccess = true
            setTimeout(() => {
              _this.createSuccess = false
            }, 1000)
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
        this.getAllTodolist()
        this.getAllTodolist()
        this.titleText = ''
      }
    },
    isInArray (list, keyword) {
      return _.find(list, {title: keyword})
    },

    approachingDDL (item) {
      // var _this = this
      if (item.TodoItem.length !== 0) {
        var TodoItem = item.TodoItem
        var ApproachingDDL = moment('2030-01-01')
        // console.log(ApproachingDDL)
        // console.log(ApproachingDDL.isValid())
        for (var i = 0; i < TodoItem.length; i++) {
          if ((moment().isBefore(TodoItem[i].TodoDDL) || moment().isSame(TodoItem[i].TodoDDL)) && (TodoItem[i].isDone === false)) {
            if (moment(TodoItem[i].TodoDDL).isBefore(ApproachingDDL)) {
              ApproachingDDL = TodoItem[i].TodoDDL
            }
          }
        }
        if (ApproachingDDL.isSame(moment('2030-01-01'))) {
          return -2
        } else {
          console.log('0')
          return ApproachingDDL
        }
      } else {
        return -1
      }
    },
    getDate (item) {
      console.log(item)
      return moment(item).format('LL')
    },
    jumpTolist (key, item) {
      // console.log(key)
      // console.log(item.id)
      // console.log(this.lists[item.id].title)
      var _this = this
      console.log(item.title)
      this.$router.push({
        path: '/item',
        query: {
          id: item.id,
          user: _this.username,
          title: item.title
        }
      })
    },
    getMostrecentdate (item) {
      var result = item[0].TodoCreateData
      // console.log(item[0].TodoCreateData)
      /*
      for (var i = 0; i < item.length; i++) {
        if (moment(item[i].TodoCreateData).isAfter(result)) {
          console.log('yes')
          result = item[i].TodoCreateData
        }
      }
      // console.log(result)
      */
      return result
    },
    isChecked (list) {
      var TodoItem = list.TodoItem
      return TodoItem.filter(function (item) {
        if (item.isDone === true) {
          return item
        }
      })
    },
    getAllTodolist () {
      var _this = this
      axios.get('/api/getallTodolist', {params: {user: _this.username}})
        .then(function (response) {
          _this.lists = response.data
          _this.nextID = _this.lists.length
          _this.isGet = true
          console.log(response.data)
        })
        .catch(function (error) {
          console.log('request fail')
          console.log(error)
        })
    },
    msgFunc (status, msg) {
      this.$message({
        type: status,
        message: msg
      })
    },
    userLogin () {
      var _this = this
      if (!this.login.name) {
        this.msgFunc('warning', 'ユーザIDを入力してください')
        return
      }
      if (!this.login.pass) {
        this.msgFunc('warning', 'パスワードを入力してください')
        return
      }
      var user = {
        name: this.login.name,
        pass: this.login.pass
      }
      axios.get('/api/login', {params: user})
        .then(function (response) {
          if (response.data.status === 1000) {
            // success login
            var msg = response.data.msg
            _this.msgFunc('success', msg)

            var ses = window.sessionStorage
            _this.isLogin = true
            var d = JSON.stringify(user)
            ses.setItem('user', d)

            _this.username = window.sessionStorage.user ? JSON.parse(window.sessionStorage.user).name : 'public'
            // console.log(response.data.data)
            _this.getAllTodolist()
            _this.loginVisible = false
          } else {
            // console.log(response)
            var errmsg = response.data.msg
            _this.msgFunc('warning', errmsg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    userLogout () {
      window.sessionStorage.removeItem('user')
      this.isLogin = false
      this.username = window.sessionStorage.user ? JSON.parse(window.sessionStorage.user).name : 'public'
      this.getAllTodolist()
    },
    userRegister () {
      var _this = this
      if (!this.register.name) {
        this.msgFunc('warning', 'ユーザIDを入力してください')
        return
      }
      if (!this.register.pass) {
        this.msgFunc('warning', 'パスワードを入力してください')
        return
      }
      var user = {
        name: this.register.name,
        pass: this.register.pass
      }
      axios.post('/api/logup', user)
        .then(function (response) {
          if (response.data.status === 1000) {
            // success login
            var msg = response.data.msg
            _this.msgFunc('success', msg)
            // console.log(response.data.data)
            _this.registerVisible = false
            _this.loginVisible = true
          } else {
            // console.log(response)
            var errmsg = response.data.msg
            _this.msgFunc('warning', errmsg)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getUsername () {
      if (!window.sessionStorage.user) {
        // console.log('visitor')
        return 'public'
      } else {
        var data = JSON.parse(window.sessionStorage.user)
        var username = data.name
        // console.log(username)
        return username
      }
    },
    clickChangeButton () {
      var _this = this
      _this.loginVisible = false
      setTimeout(function () {
        _this.registerVisible = true
      }, 300)
    },
    deleteTodolist (item) {
      var _this = this
      this.$confirm('本当に削除しますか？', '確認', {
        confirmButtonText: 'はい',
        cancelButtonText: 'いいえ',
        type: 'warning'
      }).then(() => {
        axios.post('/api/deleteTodolist', {id: item.id, user: _this.username})
          .then(function (response) {
            _this.$message({
              type: 'success',
              message: '削除成功!'
            })
            _this.getAllTodolist()
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
.todo-input-form {
  .el-form--inline .el-form-item__content .el-input .el-input__inner .el-form-item {
    width: 200px
  }
}
.addlist-button {
  float: right;
  width: 150px
}

.container-form{
  display:flex
}
.addlist-form {
  width:100%;
  .addlist-input{
    width: 80%
  }
}
.todo-list {
  margin-bottom: 20px;
    .el-card__body {
      padding-bottom: 5px;
      padding-top: 5px
    }
}
.alert-list {
  margin-bottom: 20px
}

.el-icon-delete {
  color:#F56C6C
}
.el-icon-delete:hover {
  color:rgb(250, 54, 54)
}
.todolist-title:hover {
  color:#409EFF;
  cursor:pointer
}
.user-log {
  margin-top: 30px
}
[v-cloak]{ display:none}
</style>
