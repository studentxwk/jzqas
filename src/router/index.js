import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register2'
import ResetPassword from '@/components/ResetPassword'
import ContractMaker from '@/components/contract-maker'
import ContractEntry from '@/components/contract-entry'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/resetPassword',
      name: 'ResetPassword',
      component: ResetPassword
    },
    {
      path: '*',
      redirect: '/login'  // 重定向路由
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/contractMaker',
          name: 'contractMaker',
          component: ContractMaker
        },
        {
          path: '/ownerControl',
          name: 'ownerControl',
          component: resolve => require(['../components/owner-control.vue'], resolve)
        },
        {
          path: '/supplierControl',
          name: 'supplierControl',
          component: resolve => require(['../components/supplier-control.vue'], resolve)
        },
        {
          path: '/authorize',
          name: 'authorize',
          component: resolve => require(['../components/authorize.vue'], resolve)
        },
        {
          path: '/userCenter',
          name: 'userCenter',
          component: resolve => require(['../components/user-center.vue'], resolve)
        },
        {
          path: '/corpCenter',
          name: 'corpCenter',
          component: resolve => require(['../components/corp-center.vue'], resolve)
        },
        {
          path: '/ContractEntry',
          name: 'ContractEntry',
          component: resolve => require(['../components/contract-entry.vue'], resolve)
        },
        {
          path: '/ContractDetail',
          name: 'ContractDetail',
          component: resolve => require(['../components/contract-detail.vue'], resolve)
        },
        {
          path: '/ContractList',
          name: 'ContractList',
          component: resolve => require(['../components/contract-list.vue'], resolve)
        },
        {
          path: '/ContractManage',
          name: 'ContractManage',
          component: resolve => require(['../components/contract-manage.vue'], resolve)
        },
        {
          path: '/SettleManage',
          name: 'SettleManage',
          component: resolve => require(['../components/settle-manage.vue'], resolve)
        },
        {
          path: '/OpenManage',
          name: 'OpenManage',
          component: resolve => require(['../components/open-manage.vue'], resolve)
        },
        {
          path: '/ReceiveManage',
          name: 'ReceiveManage',
          component: resolve => require(['../components/receive-manage.vue'], resolve)
        },
        {
          path: '/SettleEdit',
          name: 'SettleEdit',
          component: resolve => require(['../components/settle-edit.vue'], resolve)
        },
        //重定向到开票编辑页面
        {
          path: '/OpenEdit',
          name: 'OpenEdit',
          component: resolve => require(['../components/open-edit2.vue'], resolve)
        },
        //重定向到开票编辑页面
        {
          path: '/OpenDetail',
          name: 'OpenDetail',
          component: resolve => require(['../components/open-detail.vue'], resolve)
        },
        //開票修改頁面
        {
          path: '/OpenMaker',
          name: 'OpenMaker',
          component: resolve => require(['../components/open-maker.vue'], resolve)
        },
        {
          path: '/ReceiveItem',
          name: 'ReceiveItem',
          component: resolve => require(['../components/receive-item.vue'], resolve)
        },
        {
          path: '/ChartManage',
          name: 'ChartManage',
          component: resolve => require(['../components/chart/chart-manage.vue'], resolve),
          children: [
            {
              path: 'Chart/:id',
              name: 'Chart',
              component: resolve => require(['../components/chart/chart.vue'], resolve)
            }
          ]
        },
        {
          path: '/SystemManage',
          name: 'SystemManage',
          component: resolve => require(['../components/system/system-manage.vue'], resolve),
          children: [
            {
              path: 'projectAuthLimit',
              name: 'projectAuthLimit',
              component: resolve => require(['../components/system/projectAuthLimit.vue'], resolve)
            },
            {
              path: 'systemUser',
              name: 'systemUser',
              component: resolve => require(['../components/system/systemUser.vue'], resolve)
            },
            {
              path: 'supplierApprove',
              name: 'supplierApprove',
              component: resolve => require(['../components/system/supplierApprove.vue'], resolve)
            },
            {
                path: 'SupplierDetail',
                name: 'SupplierDetail',
                component: resolve => require(['../components/supplier-detail.vue'], resolve)
            },
            {
              path: 'projectBill',
              name: 'projectBill',
              component: resolve => require(['../components/system/projectBill2.vue'], resolve)
            },
            {
              path:'addProBill',
              name:'addProBill',
              component: resolve => require(['../components/system/addProBill.vue'], resolve)
            }
          ]
        },
        // 跳转消息页面
        {
          path: '/Message',
          name: 'Message',
          component: resolve => require(['../components/message.vue'], resolve)
        }]
    }]
})
































