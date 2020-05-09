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
        path: '/rentabilidad',
        name: 'rentabilidad',
        component: () => import('../views/rentabilidad/rentabilidad.vue'),
        meta:{
            auth:false,
            transitionName: 'slide'
        },
        children:[
            {
                path: ":reporte",
                name:"rentabilidad-reporte",
                component:() => import('../views/inventario/Inventario.vue'),
                meta:{
                    auth:true,
                    transitionName: 'slide'
                },
            }
        ]
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
                path: "ranking",
                name:"ranking",
                component:() => import('../views/ventas/ranking.vue'),
                meta:{
                    auth:true,
                    transitionName: 'slide'
                },
            },
            {
                path: "vendedores",
                name:"vendedores",
                component:() => import('../views/ventas/vendedores.vue'),
                meta:{
                    auth:true,
                    transitionName: 'slide'
                },
            },
            {
                path: "clientes",
                name:"clientes",
                component:() => import('../views/ventas/clientes.vue'),
                meta:{
                    auth:true,
                    transitionName: 'slide'
                },
            },
            {
                path: "rutas",
                name: "rutas",
                component: () => import('../views/ventas/rutas.vue'),
                meta: {
                    auth: true,
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
                path: ":nombre",
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
            {
                path: "ayuda",
                name: "ayuda",
                component: () => import('../views/auth/ayuda.vue'),
                meta: {
                    auth: true
                }
            },
            {
                path: "notificaciones",
                name: "notificaciones",
                component: () => import('../views/auth/notificaciones.vue'),
                meta: {
                    auth: true,
                    transitionName: 'slide'
                }
            },
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