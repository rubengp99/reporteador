import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/Inicio',
        name: 'Inicio',
        component: Home
    },
    {
        path: '/Ventas',
        name: 'Ventas',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import( /* webpackChunkName: "about" */ '../views/Ventas.vue')
    },
    {
        path: '/Inventario',
        name: 'Inventario',
        component: () => import('../views/Inventario.vue')

    }
]

const router = new VueRouter({
    routes,
    mode: "history",
    base: '/Report',
    linkActiveClass: 'router-link-active',
    linkExactActiveClass: 'router-link-exact-active',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    parseQuery: q => q,
    fallback: true,
})

export default router