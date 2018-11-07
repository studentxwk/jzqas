<template>
  <div class="contractManage layout-content">
    <div class="opt">
      <div class="optItem">
        <span class="lb">NC系统</span>
         <Select v-model="ncmodel" clearable filterable style="width:300px" >
               <Option v-for="item in nclist" :value="item.id" :key="item.id">{{ item.corpName }}</Option>
         </Select>
      </div>
      <div class="optItem">
        <span class="lb">合同类型</span>
        <Select v-model="contractTypemodel" clearable filterable style="width:200px">
            <Option v-for="item in contractTypelist" :value="item.templetCode" :key="item.templetCode">{{ item.templetName }}</Option>
        </Select>
      </div>
      <div class="optItem">
        <span class="lb">项目</span>
        <Select v-model="projectmodel" clearable filterable style="width:300px">
            <Option v-for="item in projectlist" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
        </Select>
      </div>
      <div class="optItem" >
        <Button type="success" @click="getList()">查询</Button>
      </div>
    </div>
    <div class="contractList">
      <div class="contractListOpt">
        <div class="contractListOptItem">
          <Button type="success" @click="modal1 = true" v-if="userType != 2">新增</Button>
        </div>
        <!--<div class="contractListOptItem">
          <Button type="primary" @click="commitnc">提交</Button>
        </div>-->
      </div>
      <Table border :columns="columns7" :data="contractList"></Table>
      <div style="margin: 10px;overflow: hidden">
        <p style="float: left;line-height: 32px;font-size: 14px;">
          当前展示 {{ listFrom }} 到 {{ listFrom + listTo }} 条，共 {{ listTotal }} 条
        </p>
        <div style="float: right;">
          <Page :total="listTotal" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <Modal
      v-model="modal1"
      title="新增"
      @on-ok="ok"
      width="400">
      <div class="dialogContainer">
        <div class="dialogConItem">
          <div class="lb">
            NC系统
          </div>
          <Select v-model="ncmodel1" style="width:300px" :label-in-value=true>
               <Option v-for="item in nclist1" :value="item.id" :key="item.id" :label="item.corpName" >{{ item.corpName }}</Option>
          </Select>
          <div class="clear"></div>
        </div>
        <div class="dialogConItem">
          <div class="lb">
            合同类型
          </div>
          <Select v-model="contractTypemodel1" style="width:300px">
                  <Option v-for="item in contractTypelist1" :value="item.templetCode" :key="item.templetCode">{{ item.templetName }}</Option>
          </Select>
          <div class="clear"></div>
        </div>
        <!--<div class="dialogConItem">
          <div class="lb">
            项目
          </div>
          <Select v-model="projectmodel1" style="width:300px">
                  <Option v-for="item in projectlist1" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
          </Select>
          <div class="clear"></div>
        </div>-->
        <div class="clear"></div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import router from '../router';
  import api from '../utils/api';
  import axios from 'axios';
  export default {
    data () {
      return {
        columns7: [
          {
            title: '项目',
            key: 'projectName'
          },
          {
            title: '合同名称',
            key: 'subcontractName'
          },
          {
            title: '合同类型',
            key: 'contracttypeName'
          },
          {
            title: '上次结算截止日期',
            key: 'dlastsettledate'
          },
          {
            title: '本次结算截止日期',
            key: 'dsettledate'
          },
          {
            title: '是否完工',
            key: 'bisfinished',
            render:(h,params) =>{
              if (params.row.bisfinished=="Y"){
                  return "是";
              };
              if (params.row.bisfinished=="N"){
                return "否";
              };
           }
          },
          {
            title: '操作',
            key: 'action',
            width: 180,
            align: 'center',
            render: (h, params) => {
            var status = params.row.status;
            if(0== status){
              return '已提交';
            }else{
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
                      this.edit(params)
                    }
                  }
                }, '修改'),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                      this.submit( params.row.id);
                }
                }
                }, '提交'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id)
                    }
                  }
                }, '删除')
              ]);
            }
            }
          }
        ],
        openSelected: [],  // 选中的行
        nclist: [],
        nclist1: [],
        contractTypelist: [],
        contractTypelist1: [],
        projectlist: [],
        projectlist1: [],
        modal1: false,
        ncmodel: '',
        ncmodel1: '',
        contractTypemodel: '',
        contractTypemodel1: '',
        projectmodel: '',
        projectmodel1: '',
        contractList: [],
        userType:'',
        listFrom: 0,  // 起始位置
        listTo: 10,  // 列表长度
        listTotal: 0  // 列表总条数
      }
    },
    methods: {
      getList () {  // 获取列表
        const url = api.getSettleListData(),
          data = {
            start: this.listFrom,
            length: 10,
            search: '',
            firstpartyId:this.ncmodel,
            contracttypeId:this.contractTypemodel,
            projectId:this.projectmodel
          };

        this.ajax.post(url, data, (data) => {
          console.log(data);
          this.contractList = data.data.list;
          this.listTotal = data.data.total;

          if (data.data.list.length < this.listTo) {
            this.listTo = data.data.list.length
          }
        });
      },
      changePage (n) {  // 切换分页，重载数据
        this.listTo = 10;
        this.listFrom = this.listTo * (n - 1);
        this.getList();
      },
      edit(params){
        router.push({
          path: "/SettleEdit",
          query: {templateCode: params.row.compactecode, settleId: params.row.id, isEdit: false,mark:1}
        });
      },
      getNClist () {
        const url = api.getRefUrl();
        var ncData = {
          openKey: 'nc_system',
          search: '',
        }
        this.ajax.post(url, ncData, (data) => {
        console.log(data);
        this.nclist = data.data;
        this.nclist1=data.data;
        });
      },
       getContractTypeList(){
         const url = api.getRefUrl();
         var typeData = {
           openKey: 'contract_type',
           search: '',
         }
         this.ajax.post(url, typeData, (data) => {
           console.log(data);
         this.contractTypelist = data.data;
         this.contractTypelist1 = data.data;
       });
       },
      getProjectList () {
        const url = api.getRefUrl();
        var proData = {
          openKey: 'pk_project',
          firstpartyId: this.firstpartyId,
          search: '',
        }
        this.ajax.post(url, proData, (data) => {
          console.log(data);
        this.projectlist = data.data;
        this.projectlist1 = data.data;
      });
      },
      ok () {
        if(this.contractTypemodel1 == null || this.contractTypemodel1 ==''){
          this.$Message.success('合同类型不可以为空！');
          return;
        }
        router.push({
          path: "/SettleEdit",
          query:{firstpartyIdmodel:this.ncmodel1,contracttypeId:this.contractTypemodel1,projectId:this.projectmodel1,mark:0}
        });
        },
      //提交到nc
      submit(id){
        const url = api.submitSettle(id);
        this.ajax.post(url, null, (data) => {
          console.log(data);
          if (data.error_code == 200) {
            this.getList();
            this.$Message.success('提交成功');
          }else{
            this.$Message.success('提交失败');
          }
        });

      },

      //删除
      remove(id){
        const url = api.deleteSettle(id);
        this.ajax.delete(url, null, (data) => {
          console.log(data);
          if (data.error_code == 200) {
            this.getList();
            this.$Message.success('删除成功');
          }
         });
      },

      getUserType(){
        const url = api.getUserType();
        this.ajax.post(url, null, (data) => {
          console.log(data);
          this.userType = data.data;
      });
      }

    },
    computed: {},
    created () {
      this.getList();
      this.getNClist();
      this.getContractTypeList();
      this.getProjectList();
      this.getUserType();
    }
  }

</script>
<style scoped lang="less">
  @import "../assets/css/contract-manage.less";
</style>
