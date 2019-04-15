import Vue from 'vue'
import Router from 'vue-router'
import Search from '@/pages/Search'
import Todo from '@/pages/Todo'
import Item from '@/pages/Item'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TodoList',
      component: Todo
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/item',
      name: 'Item',
      component: Item
    }
  ]
})
