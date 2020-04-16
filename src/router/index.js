import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: () => import('../views/dashboard/Home.vue'),
        meta:{
            auth:true,
        },
    },
    {
        path: '/Login',
        name: 'login',
        component: () => import('../views/auth/Login.vue'),
        meta:{
            auth:false,
            transitionName: 'slide'
        }
    },
    {
        path: "/forgot",
        name:"forgot",
        component:() => import('../views/auth/Forgot.vue'),
        meta:{
            auth:false,
            transitionName: 'slide'
        }
    },
    {
        path: "/ventas",
        name:"ventas",
        component:() => import('../views/ventas/Ventas.vue'),
        meta:{
            auth:true,
            transitionName: 'slide'
        },
        children:[
            {
                path: "/ventas/ranking",
                name:"ranking",
                component:() => import('../views/ventas/ranking.vue'),
                meta:{
                    auth:true,
                    transitionName: 'slide'
                },
            }
        ]
    },
    {
        path: '/Inventario',
        name: 'Inventario',
        component: () => import('../views/inventario/Inventario.vue'),
        meta:{
            auth:true,
            transitionName: 'slide'
        },
        children:[
            {
                path: "/Inventario/:nombre",
                name:"concepto",
                component:() => import('../views/inventario/Inventario.vue'),
                meta:{
                    auth:true,
                    transitionName: 'slide'
                },
            }
        ]
    },
    {
        path:'/Cuenta',
        name:'Cuenta',
        component: () => import('../views/auth/Account.vue'),
        meta:{
            auth:true,
            transitionName: 'slide'
        },

        children:[
            {
                path: "Perfil",
                name: "Perfil",
                component: () => import('../views/auth/Profile.vue'),
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
    base: '/reporteador/',
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