Todoリスト
===
> ToDoリストやToDoを作成、管理、検索できるウェブサイトです。ユーザ登録、ログイン、ログアウト機能も実装しています。
## 概要
* ソフト名：ToDoリスト
* バージョン：β
* 製作者：朱　文佳 (Alien)

## 使用した技術要素
### 言語：
* フロントエンド
  * `HTML`,`CSS`,`JavaScript`
* サーバサイド
  * `JavaScript`

### フレームワーク:
* フロントエンド
  * vue.js
* サーバサイド
  * express
### モジュール管理ツール
npm
### IDE
VS code

### テンプレート
* webpackに基づく

        |-- build                       // 项目构建相关代码
        |   |-- build.js
        |   |-- check-version.js
        |   |-- dev-client.js
        |   |-- dev-server.js
        |   |-- utils.js
        |   |-- webpack.base.conf.js
        |   |-- webpack.dev.conf.js
        |   |-- webpack.prod.conf.js
        |-- config                      // 项目开发环境配置
        |   |-- dev.env.js
        |   |-- index.js                // ここではProxyTableを設定
        |   |-- prod.env.js
        |-- dist                        // ビルドしたときに生成先
        |   |-- static                  // 静的なソースを管理するディレクトリ
        |   |-- index.html              // エントリーポイント
        |-- node_modules
        |-- server                 　　　//サーバーを設定するディレクトリ
        |   |-- api.js                  //サーバーの起動を設定するファイル
        |   |-- db.js　　　　　　　　　　  //サーバーの起動を設定するファイル
        |   |-- index.js                //サーバーの起動を設定するファイル
        |   |-- node_modules
        |   |-- package.json
        |   |-- package-lock.json
        |-- src                         // フロントエンドのコードを管理するディレクトリ
        |   |-- assets                  // ソースを管理するディレクトリ
        |   |-- components              // componentを管理するディレクトリ
        |   |-- router                  // routerを管理するディレクトリ
        |   |-- pages                   // pagesを管理するディレクトリ
        |   |-- App.vue                 // Vue.jsのエントリーポイント
        |   |-- main.js                 // JavaScriptのエントリーポイント
        |-- .babelrc
        |-- .editorconfig
        |-- .eslintignore               // ESLintチェックしたくないもの設定
        |-- .eslistrc.js                // ESLint設定ファイル
        |-- index.html                  // プロジェクトのエントリーポイント
        |-- package.json                // 项目配置信息

## 構成と設計
### 機能
* `ToDoリスト`一覧表示、新しい`ToDoリスト`を作成する

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/createTodolist.gif)

* `ToDo`一覧表示、新しい`ToDo`を作成して、`完了/未完了`の状態を変更する

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/createTodo.gif)

* 登録された`ToDo`や`ToDoリスト`について検索する

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/search.gif)

* ユーザ新規登録

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/Register.gif)

* ユーザログインして、自分に属する`ToDoリスト`や`ToDo`を作成する（状態変更、検索もできる）

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/Login.gif)

* ユーザログアウト、`public`状態を戻る

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/Logout.gif)

* `ToDo`や`ToDoリスト`を削除する

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/deleteTodo%26Todolist.gif)


## 開発環境のセットアップ手順


# todo-list

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
