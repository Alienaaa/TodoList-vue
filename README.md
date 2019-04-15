Todoリスト
===
> ToDoリストやToDoを作成、管理、検索できるウェブサイトです。ユーザ登録、ログイン、ログアウト機能も実装しています。
## 概要
* **ソフト名**：ToDoリスト
* **バージョン**：β
* **製作者**：朱　文佳 (Alien)

## 使用した技術要素
### 言語：
* フロントエンド
  * `HTML`,`CSS`,`JavaScript`
* サーバサイド
  * `JavaScript`

### フレームワーク:
* フロントエンド
  * `Vue.js`
    * dependencies<br>
        ```
        "axios": "^0.18.0",　　　　　　// HTTP通信フレームワーク
        "element-ui": "^2.7.0",       // UI フレームワーク
        "lodash": "^4.17.11",         // 便利な関数をまとめて提供しているフレームワーク
        "moment": "^2.24.0",          //日付処理フレームワーク
        "node-sass": "^4.11.0",
        "sass": "^1.17.3",
        "sass-loader": "^7.1.0",
        "scss": "^0.2.4",
        "vue": "^2.5.2",
        "vue-router": "^3.0.1",　　　 //公式ルータフレームワーク
        ```     
* サーバサイド
  * `Node.js`
    * dependencies<br>
        ```
        "body-parser": "^1.18.3",    //POSTデータを処理するモジュール
        "express": "^4.16.4",        //Node.jsのための高速開発フレームワーク
        "mongoose": "^5.4.19"        //mongoDBを操作するためのライブラリ
        ```
### データベース
`mongoDB Atlas`<br>
https://cloud.mongodb.com/

### モジュール管理ツール
`npm`

### IDE
`VS code`

### テンプレート
* webpackに基づく

        |-- build                       // ビルドに関するディレクトリ
        |   |-- build.js
        |   |-- check-version.js
        |   |-- dev-client.js
        |   |-- dev-server.js
        |   |-- utils.js
        |   |-- webpack.base.conf.js
        |   |-- webpack.dev.conf.js
        |   |-- webpack.prod.conf.js
        |-- config                      // 開発環境に関するディレクトリ
        |   |-- dev.env.js
        |   |-- index.js                // ここではProxyTableを設定
        |   |-- prod.env.js
        |-- dist                        // ビルドしたときに生成先
        |   |-- static                  // 静的なソースを管理するディレクトリ
        |   |-- index.html              // エントリーポイント
        |-- node_modules
        |-- server                 　　　//サーバーを設定するディレクトリ
        |   |-- api.js                  //apiを管理するファイル
        |   |-- db.js　　　　　　　　　　  //データベースを設定するファイル
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
        |-- package.json                

## 全体の設計・構成
### 機能
* `ToDoリスト`一覧表示、新しい`ToDoリスト`を作成する

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/createTodolist.gif)

* `ToDo`一覧表示、新しい`ToDo`を作成して、`完了/未完了`の状態を変更する

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/createTodo.gif)

* 登録された`ToDo`や`ToDoリスト`について検索する

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/search.gif)

* **[独自]** ユーザ新規登録

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/Register.gif)

* **[独自]** ユーザログインして、自分に属する`ToDoリスト`や`ToDo`を作成する（状態変更、検索もできる）

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/Login.gif)

* **[独自]** ユーザログアウト、`public`状態を戻る

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/Logout.gif)

* **[独自]** `ToDo`や`ToDoリスト`を削除する

![image](https://github.com/Alienaaa/Todo-list/blob/master/ReadMe_img/deleteTodo%26Todolist.gif)

### データベースの設計

* `ユーザ`スキーマ設計

| 内容       | フィールド名  | データ型  |
|:---------:|:-----------:|:--------:|
| ユーザ名   | name        | String |
| パスワード | pass        | String   |


* `ToDo`スキーマ設計

| 内容       | フィールド名  | データ型  |
|:---------:|:-----------:|:--------:|
| TodoリストID | id         | Number |
| ToDoリスト名    | title        | String   |
| ToDo名     | TodoTitle | String     |
| 期限       | TodoDDL   | Date     |
| ToDo作成日 | TodoCreateData | Date  |
| 完了/未完了 | isDone | Boolean  |

* `ToDoリスト`スキーマ設計

| 内容       | フィールド名  | データ型  |
|:---------:|:-----------:|:--------:|
| TodoリストID | id         | Number |
| ToDoリスト名 | title        | String   |
| ToDoリスト作成日| listCreateData | Date   |
| ユーザ名       | user   | String     |　
| ToDoを格納する配列 | TodoItem | ToDoスキーマ  |
＊共有ToDoリストのユーザ名を`public`とする。

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
