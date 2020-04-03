import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: () => import('../views/Home.vue'),
        meta:{
            auth:true,
        },
    },
    {
        path: '/Login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta:{
            auth:false,
            transitionName: 'slide'
        }
    },
    {
        path: "/forgot",
        name:"forgot",
        component:() => import('../views/Forgot.vue'),
        meta:{
            auth:false,
            transitionName: 'slide'
        }
    },
   // {
        //path: '/Ventas',
        //name: 'Ventas',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
       // component: () =>
         //   import(  //'../views/Ventas.vue')
    //},
    {
        path: '/Inventario',
        name: 'Inventario',
        component: () => import('../views/Inventario.vue'),
        meta:{
            auth:true,
            transitionName: 'slide'
        }
    },
    {
        path:'/Cuenta',
        name:'Cuenta',
        component: () => import('../views/Account.vue'),
        meta:{
            auth:true,
            transitionName: 'slide'
        },

        children:[
            {
                path: "Perfil",
                name: "Perfil",
                component: () => import('../views/Profile.vue'),
                meta: {
                    auth: true,
                    transitionName: 'slide'
                }
            },
            /*{
                path: "ayuda",
                name: "ayuda",
                component: Ayuda,
                meta: {
                    auth: true
                }
            },
            {
                path: "notificaciones",
                name: "notificaciones",
                component: Notificaciones,
                meta: {
                    auth: true
                }
            },*/
        ]
    },
]

const router = new VueRouter({
    routes,
    mode: "history",
    base: '/',
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

router.beforeEach((to,from,next) => {
    let user = store.state.user.loggedIn;

    if(to.meta.auth){
        if(user){
            next();
        }else{
            next({name: 'login'});
        }
    }else{
        next();
    }
});

export default router