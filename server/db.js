// import
const mongoose = require('mongoose')
// connect to DB
mongoose.connect('mongodb+srv://Alien:Alien@cluster0-0fva0.mongodb.net/TodoList', {useNewUrlParser: true}) // 地址跟第一步的地址对应。

// catch err

const db = mongoose.connection
db.once('error', () => console.log('Mongo connection error'))
db.once('open', () => console.log('Mongo connection successed'))

/** ************ Schema **************/

var userSchema = new mongoose.Schema({
  name: String,
  pass: String
})

var todoitemSchema = new mongoose.Schema({
  id: Number,
  title: String,
  TodoTitle: String,
  TodoDDL: Date,
  TodoCreateData: Date,
  isDone: Boolean
})
var todolistSchema = new mongoose.Schema({
  id: Number,
  title: String,
  listCreateData: Date,
  user: String,
  TodoItem: [todoitemSchema]
})

/** ************ Model **************/
var TodoList = mongoose.model('TodoList', todolistSchema)
var Todoitem = mongoose.model('Todoitem', todoitemSchema)
var User = mongoose.model('User', userSchema)

module.exports = {
  Todolist: TodoList,
  Todoitem: Todoitem,
  User: User
}
