import { createRouter, createWebHistory } from 'vue-router'
import baseRoutes from "@/router/routes";

let routes = baseRoutes;


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const dataUser = JSON.parse(localStorage.getItem('dataUser'))
  const noSession = dataUser === null || dataUser === undefined

  document.title = to.meta.title ? `NetControl | ${to.meta.title} ` : 'NetControl'

  // Super Admin
  if (to.matched.some(record => record.meta.authSuperAdmin)) {
    if (noSession || dataUser.role_name !== 'super admin') {
      // console.log("Redirecting to login from:", to.name);
      next({ name: 'login' });
    } else {
      next();
    }

    // Admin
  } else if (to.matched.some(record => record.meta.authAdmin)) {
    if (noSession || dataUser.role_name !== 'admin') {
      next({ name: 'login' });
    } else {
      next();
    }

    // Monitor
  }
  else if (to.name !== 'login' && to.matched.some(record => record.meta.authMonitor)) {
    if (noSession || dataUser.role_name !== 'monitoring') {
      next({ name: 'login' });
    } else {
      next();
    }

    // Client
  } else if (to.matched.some(record => record.meta.authClient)) {
    if (noSession || dataUser.role_name !== 'customer') {
      next({ name: 'login' });
    } else {
      next();
    }

    // Halaman Tamu
  } else if (to.matched.some(record => record.meta.guestPage)) {
    if (noSession) {
      next();
    } else {
      if (dataUser.role_name === 'monitoring') {
        next({ name: 'networkMonitor', params: { id: localStorage.getItem('idDefault') } })
      }
    }
  }
});

export default router
