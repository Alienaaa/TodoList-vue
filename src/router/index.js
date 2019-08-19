import Vue from 'vue'
import Router from 'vue-router'
import Search from '@/pages/Search'
// import Todo from '@/pages/Todo'
import Item from '@/pages/Item'
import Edit from '@/pages/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Item',
      component: Item
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/edit/:id',
      name: 'Edit',
      component: Edit
    }
  ]
})
