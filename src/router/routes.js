import LoginView from '@/views/Auth/LoginView.vue'
import DashboardAdminView from '@/views/Admin/DashboardAdminView.vue'
import ManagementUserView from '@/views/Admin/ManagementUserView.vue'
import ListDeviceView from '@/views/Admin/ListDeviceView.vue'
import DetailDeviceClientView from '@/views/Client/DetailDeviceClientView.vue'
import NetworkView from '@/views/Client/NetworkView.vue'

import LayoutSuperAdmin from '@/components/Layout/LayoutSuperAdmin.vue'
import LayoutAdmin from '@/components/Layout/LayoutAdmin.vue'
import LayoutCustomer from '@/components/Layout/LayoutCustomer.vue'
import LayoutMonitoring from '@/components/Layout/LayoutMonitoring.vue'
import LayoutBlank from '@/components/Layout/BlankLayout.vue'

import NotFoundView from '@/views/NotFoundView.vue'
import SessionView from '@/views/Admin/SessionView.vue'
import AssignmentView from '@/views/Admin/AssignmentView.vue'
import NewDeviceView from '@/views/Admin/NewDeviceView.vue'

export default [
  {
    path: '/',
    redirect: { name: 'dashboard-superadmin' },
    meta: {
      authSuperAdmin: true,
      title: 'dashboard'
    },
    component: LayoutSuperAdmin,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard-superadmin',
        meta: {
          title: 'dashboard',
          breadcrumb: 'dashboard',
          icon: 'house'
        },
        component: DashboardAdminView
      },
      {
        path: 'management/users',
        name: 'management',
        meta: {
          title: 'user',
          breadcrumb: 'management user',
          icon: 'user'
        },
        component: ManagementUserView
      },
      {
        path: 'setting/session',
        name: 'session',
        meta: {
          title: 'session',
          breadcrumb: 'management session',
          icon: 'gears'
        },
        component: SessionView
      },
      {
        path: 'devices/list',
        name: 'list-device',
        meta: {
          title: 'devices',
          breadcrumb: 'list device',
          icon: 'server'
        },
        component: ListDeviceView
      },
      {
        path: 'devices/assignment',
        name: 'assignment',
        meta: {
          title: 'devices',
          breadcrumb: 'assignment devices',
          icon: 'server'
        },
        component: AssignmentView
      },
      {
        path: 'devices/new-devices',
        name: 'new-devices',
        meta: {
          title: 'devices',
          breadcrumb: 'new devices',
          icon: 'server'
        },
        component: NewDeviceView
      },
      {
        path: 'network-device/:id',
        name: 'device-network',
        meta: {
          title: 'device-network',
          breadcrumb: 'device network',
          icon: 'server'
        },
        component: NetworkView
      },
      {
        path: 'super-admin/device/:id',
        name: 'detail-devices-superadmin',
        meta: {
          title: 'device',
          breadcrumb: 'detail device',
          icon: 'house'
        },
        component: DetailDeviceClientView
      }
    ]
  },
  // admin
  {
    path: '/admin',
    meta: {
      authAdmin: true,
      title: 'dashboard'
    },
    redirect: { name: 'dashboard-admin' },
    component: LayoutAdmin,
    children: [
      {
        path: '/admin/dashboard',
        name: 'dashboard-admin',
        meta: {
          title: 'dashboard',
          breadcrumb: 'dashboard',
          icon: 'house'
        },
        component: DashboardAdminView
      },
      {
        path: '/admin/network/:id',
        name: 'network-admin',
        meta: {
          networkName: null,
          title: 'network',
          breadcrumb: 'network',
          icon: 'house'
        },
        component: NetworkView
      },
      {
        path: '/admin/device/:id',
        name: 'detail-devices-admin',
        meta: {
          title: 'device',
          breadcrumb: 'detail device',
          icon: 'house'
        },
        component: DetailDeviceClientView
      }
    ]
  },
  // monitoring
  {
    path: '/monitor',
    redirect: { name: 'networkMonitor' },
    meta: {
      authMonitor: true,
      title: 'network'
    },
    component: LayoutMonitoring,
    children: [
      {
        path: '/monitor/network/:id',
        name: 'networkMonitor',
        meta: {
          title: 'network',
          breadcrumb: 'network',
          icon: 'house'
        },
        component: NetworkView
      },
      {
        path: '/monitor/device/:id',
        name: 'detail-devices-monitor',
        meta: {
          title: 'device',
          breadcrumb: 'detail device',
          icon: 'house'
        },
        component: DetailDeviceClientView
      }
    ]
  },
  // client
  {
    path: '/client',
    redirect: { name: 'networkClient' },
    meta: {
      authClient: true,
      title: 'network'
    },
    component: LayoutCustomer,
    children: [
      {
        path: '/network/:id',
        name: 'networkClient',
        meta: {
          title: 'network',
          breadcrumb: 'network',
          icon: 'house'
        },
        component: NetworkView
      },
      {
        path: '/device/:id',
        name: 'detail-devices-customer',
        meta: {
          title: 'device',
          breadcrumb: 'detail device',
          icon: 'house'
        },
        component: DetailDeviceClientView
      }
    ]
  },
  // error
  {
    path: '/blank',
    component: LayoutBlank,
    children: [
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        meta: {
          authClient: true,
          title: 'Not Found'
        },
        component: NotFoundView
      },
      {
        path: '/:pathMatch(.*)*',
        meta: {
          authSuperAdmin: true
        },
        component: NotFoundView
      },
      {
        path: '/',
        name: 'login',
        meta: {
          guestPage: true,
          title: 'login'
        },
        component: LoginView
      }
    ]
  }
]
