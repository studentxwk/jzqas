<template>

  <div class="layout-content">
    <Row>
      <i-col span="5">
        <Menu :active-name="activeName" width="auto" :open-names="openNames" @on-select="select">
          <Submenu v-for="(menu, index) in allMenu" :name="menu.name">
            <template slot="title">
              <Icon :type="menu.iconType"></Icon>
              {{menu.text}}
            </template>
            <MenuItem :name="item.name" v-for="item in menu.items">{{item.text}}</MenuItem>
          </Submenu>
        </Menu>
      </i-col>
      <i-col span="19">
        <div class="layout-content-main" >
          <div style="text-align: center;">
            <router-view></router-view>
          </div>
        </div>
      </i-col>
    </Row>
  </div>

</template>
<script>
  import router from '../../router';
  export default {
    name: 'system-manage',
    data () {
      return {
        openNames:['UserManage'],
        activeName:'systemUser',
        allMenu: [
          {name:'UserManage',text: '用户管理', iconType: 'person', items: [
            {name:'systemUser',text: '管理员'},
            {name:'supplierApprove',text: '供应商审批'}

          ]
          },
          {name:'SystemProjectManage',text: '计费控制', iconType: 'social-yen',items: [
              {name:'projectAuthLimit',text: '项目授权'},
              {name:'projectBill',text: '项目计费'}
            ]
          }

        ]
      }
    },
    methods: {
      select(name){
        this.$router.push({
          'path': '/SystemManage/'+ name
        });
      }
    },
    created() {
        this.$router.push({
            'path': '/SystemManage/systemUser'
        });
    }
  }

</script>
<style scoped>
  .layout-content{
    min-height: 200px;
  }
</style>