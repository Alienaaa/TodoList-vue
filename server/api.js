// import
const db = require('./db')
const express = require('express')
const router = express.Router()

/** ************ API **************/

// create new Todolist
router.post('/api/createTodolist', (req, res) => {
  var newTodolist = new db.Todolist({
    // id: req.body.id,
    title: req.body.title,
    listCreateData: req.body.listCreateData,
    user: req.body.user,
    TodoItem: req.body.TodoItem
  })
  console.log(req.body)
  console.log(newTodolist)

  // save data into DB
  newTodolist.save((err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send(newTodolist)
    }
  })
})

// create new Todoitem
router.post('/api/createTodoitem', (req, res) => {
  console.log('title' + req.body.title)
  var newTodoitem = new db.Todoitem({
    _id: req.body._id,
    title: req.body.title,
    TodoTitle: req.body.TodoTitle,
    TodoDDL: req.body.TodoDDL,
    TodoCreateData: req.body.TodoCreateData,
    isDone: req.body.isDone
  })
  console.log(newTodoitem)
  var TodoCreateData = req.body.TodoCreateData

  // update todolist
  db.Todolist.update(
    {_id: req.body._id, user: req.body.user},
    {
      $push: {
        TodoItem: {
          $each: [newTodoitem],
          $sort: {TodoCreateData: -1}
        }
      }
    }, (err, data) => {
      if (err) {
        res.send(err)
      } else {
        res.json(data)
        console.log(data)
      }
    })
})

// Get all Todolist
router.get('/api/getallTodolist', (req, res) => {
  // find data by Model
  db.Todolist.find({user: req.query.user}, null, {sort: {_id: -1}}, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.json(data)
    }
  })
})

// Get all Todoitem
router.get('/api/getallTodoitem', (req, res) => {
  // find data by Model
  db.Todolist.find({_id: req.query._id, user: req.query.user}, (err, data) => {
    console.log(req.query)
    if (err) {
      res.send(err)
    } else {
      res.json(data)
      console.log(data)
      console.log(req.query._id)
    }
  })
})

// delete Todolist
router.post('/api/deleteTodolist', (req, res) => {
  console.log(req.body._id)
  // delete item
  db.Todolist.deleteOne({_id: req.body._id, user: req.body.user}, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send('delete succussfully')
    }
  })
})

// delete Todoitem
router.post('/api/deleteTodoitem', (req, res) => {
  db.Todolist.update(
    {_id: req.body._id, user: req.body.user},
    {
      $pull: {
        TodoItem: {
          TodoTitle: req.body.TodoTitle
        }
      }
    }, (err, data) => {
      if (err) {
        res.send(err)
      } else {
        res.json(data)
        console.log(data)
      }
    })
})

// search in Todolist
router.get('/api/searchTodolist', (req, res) => {
  // eslint-disable-next-line no-eval
  var keyword = eval('/' + req.query.keyword + '/i')
  db.Todolist.find({title: {$regex: keyword}, user: req.query.user}, null, {sort: {_id: -1}}, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.json(data)
    }
  })
})

// search in Todoitem
router.get('/api/searchTodoitem', (req, res) => {
  // user regex
  // eslint-disable-next-line no-eval
  var keyword = eval('/' + req.query.keyword + '/i')
  // eslint-disable-next-line no-undef
  db.Todolist.aggregate([
    {$unwind: '$TodoItem'},
    {$match: {'TodoItem.TodoTitle': {$regex: keyword}, user: req.query.user}},
    {$sort: {'TodoItem._id': -1}},
    {$project: {
      // id: '$TodoItem.id',
      title: '$TodoItem.title',
      TodoTitle: '$TodoItem.TodoTitle',
      TodoDDL: '$TodoItem.TodoDDL',
      TodoCreateData: '$TodoItem.TodoCreateData',
      isDone: '$TodoItem.isDone',
      _id: '$TodoItem._id'}}])
    .then((docs) => {
      console.log(docs)
      res.json(docs)
    }).catch((err) => {
      console.log(err)
    })
})

// change isDone in Todoitem
router.post('/api/changeIsdone', (req, res) => {
  // console.log(req.body.keyword)
  db.Todolist.update({_id: req.body._id, user: req.body.user, TodoItem: {$elemMatch: {TodoTitle: req.body.TodoTitle}}}, {$set: {'TodoItem.$.isDone': (!req.body.isDone)}}, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      console.log(req.body.TodoTitle)
      console.log('delete succussfully')
      res.json(data)
    }
  })
})

// log up
router.post('/api/logup', (req, res) => {
  var newUser = new db.User({
    name: req.body.name,
    pass: req.body.pass
  })
  console.log(newUser)
  db.User.find({name: req.body.name}, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      if (data.length > 0) {
        res.send({
          'status': 1001,
          'msg': 'このユーザ名はすでに登録されました。',
          'data': data
        })
      } else {
        // 保存数据newAccount数据进mongoDB
        newUser.save((err, data) => {
          if (err) {
            res.send(err)
          } else {
            res.send({
              'status': 1000,
              'msg': 'ユーザログアップ成功です。',
              'data': data
            })
          }
        })
      }
    }
  })
})

// log in
router.get('/api/login', (req, res) => {
  db.User.find({name: req.query.name}, (err, data) => {
    // console.log(req.query)
    if (err) {
      res.send(err)
    } else {
      if (data.length > 0) {
        db.User.find({pass: req.query.pass}, (err, datapass) => {
          if (err) {
            res.send(err)
          } else {
            if (datapass.length > 0) {
              res.json({
                'status': 1000,
                'msg': 'ユーザ認証成功です。',
                'data': datapass
              })
            } else {
              res.json({
                'status': 1001,
                'msg': 'パスワードの入力に誤りがあります。',
                'data': err
              })
            }
          }
        })
      } else {
        res.json({
          'status': 1002,
          'msg': 'ユーザ登録されてません。',
          'data': err
        })
      }
    }
  })
})

module.exports = router
