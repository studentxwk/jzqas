<template>

  <div class="layout-content">
    <Row>
      <Col span="4">
      <Menu :active-name="activeName" width="auto" :open-names="openNames" @on-select="select">
        <Submenu v-for="(menu, index) in allMenu" :name="menu.name">
          <template slot="title">
            <Icon :type="menu.iconType"></Icon>
            {{menu.text}}
          </template>
          <MenuItem :name="item.name" v-for="item in menu.items">{{item.text}}</MenuItem>

        </Submenu>
      </Menu>
      </Col>
      <Col span="19">
      <div class="layout-content-main" >
        <div style="text-align: center;">
          <router-view></router-view>
        </div>

      </div>
      </Col>
    </Row>
  </div>

</template>
<script>
  import router from '../../router';
  export default {
    name: 'contract-manage',
    data () {
      return {
        openNames:[],
        activeName:'',
        allMenu: [
          {name:'ContractChart',text: '合同图表', iconType: 'android-document',items: [
              {name:'ContractMoney',text: '合同签订额'},
              {name:'ContractCount',text: '合同签订数'}
            ]
          },
          {name:'SettleChart',text: '结算图表', iconType: 'social-yen', items: [
            {name:'SettleMoney',text: '结算金额'}

          ]
          }
        ]
      }
    },
    methods: {
      select(name){
        console.log(name);
        this.$router.push({
          'path': '/ChartManage/Chart/'+ name,
        });
      }
    },
    created() {
      /*this.openNames = ['ContractChart'];
      this.activeName = 'ContractMnyYear';*/
    }
  }

</script>
<style scoped>
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 3% 0 0 8%;
  }
</style>