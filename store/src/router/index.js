import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from "element-plus";
const routers = [
    {
        path: "/demo",
        name: "demo",
        component: () => import("@/views/demo/demo.vue"),
        meta: {
            title: "demo",
        },
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/login/login.vue"),
        meta: {
            title: "登录",
        },
    },
    {
        path: "/",
        name: "home",
        component: () => import("@/views/home/home.vue"),
        children: [
            {
                path: "",
                name: "user",
                component: () => import("@/views/user/user.vue"),
                meta: {
                    title: "用户",
                    navPath: "/user",
                },
            },
            {
                path: "/user",
                name: "user",
                component: () => import("@/views/user/user.vue"),
                meta: {
                    title: "用户",
                    navPath: "/user",
                },
            },
            {
                path: "/userDetails",
                name: "userDetails",
                component: () => import("@/views/user/user-details.vue"),
                meta: {
                    title: "用户详情",
                    navPath: "/user",
                },
            },
            {
                path: "/image",
                name: "image",
                component: () => import("@/views/template/image/image.vue"),
                meta: {
                    title: "图片",
                    navPath: "/image",
                },
            },
            {
                path: "/imageDetails",
                name: "imageDetails",
                component: () => import("@/views/template/image/image-details.vue"),
                meta: {
                    title: "图片详情",
                    navPath: "/image",
                },
            },
        ],
    },
    {
        path: "/404",
        name: "notFound",
        component: () => import("@/views/not-found.vue"),
        meta: {
            title: "页面不存在",
        },
    },
    {
        path: "/:pathMatch(.*)*",
        name: "nonExistUrlRoute",
        redirect: { name: "notFound" },
    },
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routers,
});
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    let _user = localStorage.getItem("photo-mi-store-user");
    console.log(_user);
    if (_user) {
        const _user1 = JSON.parse(_user);
        if (_user1.user && _user1.user.authorities) {
            let _authorities = _user1.user.authorities || [];
            let per = to.meta.authorities;
            if (per && per.length > 0) {
                let isAuthorities = false;
                for (let i = 0; i < per.length; i++) {
                    if (_authorities.indexOf(per[i]) != -1) {
                        isAuthorities = true;
                        break;
                    }
                }
                if (isAuthorities) {
                    next();
                } else {
                    ElMessage.error("没有权限");
                    next("/");
                }
            } else {
                next();
            }
        } else {
            next();
        }
    } else {
        if (to.path == "/login" || to.path == "/" || to.path == "/404") {
            next();
        } else {
            ElMessage.error("请登录");
            next({ path: "/login" });
        }
    }
});
router.afterEach(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

export default router;
