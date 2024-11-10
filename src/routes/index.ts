import { Router } from "vue-router";
import { RouteRecordRaw } from "vue-router";
export const routes: RouteRecordRaw[] = [
  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("@/pages/admin/LoginAdmin.vue"),
  },
  {
    path: "/admin/dasboard",
    component: () => import("@/layouts/Admin.vue"),
    redirect: () => {
      return { name: '/admin/dasboard' }
    },
    children: [
      {
        path: "/admin/dasboard",
        name: "admin-dashboard",
        component: () => import("@/pages/admin/DashboardAdmin.vue"),
        meta: {
          needAdmin: true
        }
      },
      {
        path: "/admin/room-type",
        name: "admin-room-type",
        component: () => import("@/pages/admin/RoomTypeAdmin.vue"),
        meta: {
          needAdmin: true
        }
      },
      {
        path: "/admin/room",
        name: "admin-room",
        component: () => import("@/pages/admin/RoomAdmin.vue"),
        meta: {
          needAdmin: true
        }
      },
      {
        path: "/admin/booking",
        name: "admin-booking",
        component: () => import("@/pages/admin/BookingAdmin.vue"),
        meta: {
          needAdmin: true
        }
      },
      {
        path: "/admin/inbox",
        name: "admin-inbox",
        component: () => import("@/pages/admin/InboxAdmin.vue"),
        meta: {
          needAdmin: true
        }
      },
      {
        path: "/admin/reservation",
        name: "admin-reservation",
        component: () => import("@/pages/admin/ReservationAdmin.vue"),
        meta: {
          needAdmin: true
        }
      },
    ]
  },
  {
    path: "/",
    component: () => import("@/layouts/User.vue"),
    redirect: () => {
      return { name: 'home' }
    },
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/pages/Home.vue"),
      },
      {
        path: "/user/register",
        name: "user-register",
        component: () => import("@/pages/user/Register.vue"),
      },
      {
        path: "/user/login",
        name: "user-login",
        component: () => import("@/pages/user/Login.vue"),
      },
      {
        path: "/user/dashboard",
        name: "user-dashboard",
        component: () => import("@/pages/user/DashboardUser.vue"),
        meta: {
          needAuth: true
        }
      },
      {
        path: "/user/keluhan",
        name: "user-keluhan",
        component: () => import("@/pages/user/KeluhanUser.vue"),
        meta: {
          needAuth: true
        }
      },
    ]
  },
];

export const initMiddleware = (router: Router) => {
  router.beforeEach((to, _, next) => {
    const authStore = useAuthStore();
  
    if (to.meta.needAuth) {
      if (authStore.token) {
        next(); // User is authenticated, allow navigation
      } else {
        next({ name: 'user-login' }); // Redirect to login
      }
      return; // Stop further execution after redirection or next() call
    }
  
    // If no auth requirement, proceed normally
    next();
  });
  router.beforeEach((to, _, next) => {
    const authStore = useAuthStore();
    if (to.meta.needAdmin) {
      if (authStore.tokenAdmin) {
        next(); // proceed to the route
      } else {
        next({ name: 'admin-login' }); // redirect to admin-login
      }
      return; // stop further execution
    }
    next(); // proceed for non-admin routes
  });
  router.afterEach(() => {
    window.scrollTo(0, 0)
  })
}
