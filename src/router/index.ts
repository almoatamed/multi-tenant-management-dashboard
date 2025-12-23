import { user } from "@/state/user";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "",
            component: () => {
                return import("@/layouts/default");
            },
            children: [
                {
                    path: "",
                    component: () => {
                        return import("@/pages/user/services");
                    },
                    name: "Services",
                },
                {
                    path: "service/details/:id",
                    component: () => {
                        return import("@/pages/user/services/details");
                    },
                    name: "ServiceDetails",
                },

                {
                    path: "tenants",
                    component: () => {
                        return import("@/pages/user/tenants");
                    },
                    name: "Tenants",
                },

                {
                    path: "tenants/:id",
                    component: () => {
                        return import("@/pages/user/tenants/details");
                    },
                    name: "TenantDetails",
                },
            ],
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: "/login",
            name: "Login",
            component: () => import("@/pages/public/auth/login"),
            meta: {
                requiresVisitor: true,
            },
        },
    ],
});

router.beforeEach((to, from) => {
    const isAuthenticated = !!user.value?.token && !!user.value?.userInfo;
    const forceRedirect = (props: { path?: string; name: string }) => {
        if (from.name == props.name) {
            return false;
        }
        if (props.path) {
            return {
                path: props.path,
            };
        }
        return {
            name: props.name,
        };
    };

    console.log("routing...", {
        isAuthenticated,
        from: {
            path: from.path,
            name: from.name,
        },
        to: {
            path: to.path,
            name: to.name,
        },
    });

    if (
        !isAuthenticated &&
        to.matched.some((r) => {
            return r.meta?.requiresAuth;
        })
    ) {
        return forceRedirect({
            name: "Login",
        });
    }

    if (
        to.matched.some((r) => {
            return r.meta?.requiresVisitor;
        }) &&
        isAuthenticated
    ) {
        return forceRedirect({
            path: "/",
            name: "Home",
        });
    }

    return true;
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
    if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
        if (!localStorage.getItem("vuetify:dynamic-reload")) {
            console.log("Reloading page to fix dynamic import error");
            localStorage.setItem("vuetify:dynamic-reload", "true");
            location.assign(to.fullPath);
        } else {
            console.error("Dynamic import error, reloading page did not fix it", err);
        }
    } else {
        console.error(err);
    }
});

router.isReady().then(() => {
    localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
