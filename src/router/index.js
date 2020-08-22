import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/Home.vue'
import Support from '../views/Support.vue'
import Results from '../views/Results.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Admin from '../views/Admin.vue'
import Accommodation from '../views/Accommodation.vue'
import Messages from '../views/Messages.vue'
import NMessage from '../views/NewMessage.vue'
import EditProfile from '../views/EditProfile.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/support',
      name: 'Support',
      component: Support
    },
    {
        path: '/results',
        name: 'Results',
        component: Results
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages
    },
    {
      path: '/newmessage',
      name: 'New Message',
      component: NMessage
    },
    {
      path: '/editprofile',
      name: 'Edit Profile',
      component: EditProfile
    },
    {
        path: '/accommodation',
        name: 'Accommodation',
        component: Accommodation
    }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
