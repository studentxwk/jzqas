<template>
  <div class="contractManage layout-content" style="padding:0;">
    <div class="contractList">
      <div class="contractListOpt" style="line-height: normal;">
        <div class="contractListOptItem">
          <Button type="success" @click="add()">新增</Button>
          <span class="lb" style="margin:0 5px 0 10px">NC系统</span>
          <Select v-model="search.firstpartyId" clearable filterable style="width:200px">
            <Option v-for="item in nclist" :value="item.id" :key="item.id">{{ item.corpName }}</Option>
          </Select>
          <span style="margin:0 5px 0 10px">关键词</span>
          <span><Input v-model="search.projectName" icon="ios-search" placeholder="输入用户名或昵称..."
                       style="width:300px;"></Input></span>
          <span><Button type="success" @click="getProjectList()">查询</Button></span>
        </div>
      </div>
      <Table border :columns="columns7" :data="projectList"></Table>
      <div style="margin: 10px;overflow: hidden">
        <p style="float: left;line-height: 32px;font-size: 14px;">
          当前展示 {{ listFrom }} 到 {{ listFrom + listTo }} 条，共 {{ listTotal }} 条
        </p>
        <div style="float: right;">
          <Page :total="listTotal" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../../router';
  import api from '../../utils/api';
  import axios from 'axios';

  export default {
    data() {
      return {
        entrance: false,
        columns7: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openEntrance(params)
                    }
                  }
                }, '修改')
              ]);
            }
          }
        ],
        search: {'firstpartyId': '', 'projectName': ''},
        limitNum: '',
        beginDate: '',
        endDate: '',
        projectList: [],
        nclist: [],
        listFrom: 0,  // 起始位置
        listTo: 10,  // 列表长度
        listTotal: 0  // 列表总条数
      }
    },
    methods: {
      getNClist() {
        const url = api.getAllFpList();
        var ncData = {
          openKey: 'nc_system',
          search: '',
        }
        this.ajax.get(url, ncData, (data) => {
          console.log(data);
          this.nclist = data.data;
        });
      },
      getProjectList() {
        const Url = api.getAllProject();
        var Data = {
          start: this.listFrom,
          length: 10,
          firstpartyId: this.search.firstpartyId,
          projectName: this.search.projectName,
        };
        this.ajax.post(Url, Data, (data) => {
          this.projectList = data.data.list;
          this.listTotal = data.data.total;
          if (data.data.length < this.listTo) {
            this.listTo = data.data.length;
          }
        });
      },
      changePage (n) {  // 切换分页，重载数据
        this.listTo = 10;
        this.listFrom = this.listTo * (n - 1);
        this.getProjectList();
      },
      openEntrance(params) {
        var id = params.row.id;
        this.$router.push({
          'path': '/SystemManage/addProBill',
          'query': {'id': id}
        });
      },
      closeEntrance() {
        this.entrance = false;
      },
      add() {
        this.$router.push({
          'path': '/SystemManage/addProBill'
        });
      }
    },
    computed: {},
    created() {
      this.getNClist();
      this.getProjectList();
    }
  }
</script>
<style scoped lang="less">
  @import "../../assets/css/contract-manage.less";
  @import "../../assets/css/control.css";
</style>
