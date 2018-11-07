<template>
  <div class="contractManage layout-content">
    <div class="opt">
      <div class="optItem">
        <span class="lb">NC系统</span>
        <Select v-model="ncmodel" clearable filterable style="width:300px">
          <Option v-for="item in nclist" :value="item.id" :key="item.id">{{ item.corpName }}</Option>
        </Select>
      </div>
      <div class="optItem">
        <span class="lb">合同类型</span>
        <Select v-model="typemodel" clearable filterable style="width:200px">
          <Option v-for="item in typelist" :value="item.templetCode" :key="item.templetCode">{{ item.templetName }}
          </Option>
        </Select>
      </div>
      <div class="optItem">
        <span class="lb">项目</span>
        <Select v-model="projectmodel" clearable filterable style="width:300px">
          <Option v-for="item in projectlist" :value="item.projectId" :key="item.projectId">{{ item.projectName }}
          </Option>
        </Select>
      </div>
      <div class="optItem">
        <Button type="success" @click="getList()">查询</Button>
      </div>
    </div>
    <div class="contractList">
      <div class="contractListOpt">
        <div class="contractListOptItem">
          <Button type="success" @click="modal1 = true">新增</Button>
        </div>
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
      width="450"
      @on-ok="add">
      <div class="dialogContainer">
        <div class="dialogConItem">
          <div class="lb">
            NC系统
          </div>
          <Select v-model="ncmodel1" style="width:300px">
            <Option v-for="item in nclist1" :value="item.id" :key="item.id">{{ item.corpName }}</Option>
          </Select>
          <div class="clear"></div>
        </div>
        <div class="dialogConItem">
          <div class="lb">
            合同类型
          </div>
          <Select v-model="typemodel1" style="width:300px">
            <Option v-for="item in typelist1" :value="item.templetCode" :key="item.templetCode">{{ item.templetName }}
            </Option>
          </Select>
          <div class="clear"></div>
        </div>
        <!-- <div class="dialogConItem">
           <div class="lb">
             项目
           </div>
           <Select v-model="projectmodel1" style="width:300px">
             <Option v-for="item in projectlist1" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
           </Select>
           <div class="clear"></div>
         </div>
         <div class="clear"></div>-->
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
          /*{
           title: '合同编码',
           key: 'compactecode'
           },*/
          /*   {
           title: '主键id',
           key: 'id'
           },*/
          {
            title: '项目',
            key: 'projectName',
            width: 200,
            fixed: 'left'
          },
          {
            title: '合同名称',
            key: 'vname',
            width: 250
          },
          {
            title: '合同甲方',
            key: 'pk_first',
            width: 200
          },
          {
            title: '合同签订日期',
            key: 'dcontsigndate',
            width: 150,
            sortable: true
          },
          {
            title: '合同类型',
            key: 'pk_billtypecode',
            width: 150,
            render: (h, params) => {
              if (params.row.pk_billtypecode == "H5A1") {
                return "专业分包合同";
              }
              ;
              if (params.row.pk_billtypecode == "H5AI") {
                return "劳务分包合同";
              }
              ;
              if (params.row.pk_billtypecode == "H542") {
                return "其它支出合同";
              }
              ;
              if (params.row.pk_billtypecode == "Z2") {
                return "物资采购合同";
              }
            }
          },
          {
            title: '税率',
            key: 'ntaxrate',
            width: 80
          },
          {
            title: '合同签订金额',
            key: 'ncontsignmny',
            width: 180,
            sortable: true,
            filters: [
              {
                label: '大于1000',
                value: 1
              },
              {
                label: '小于1000',
                value: 2
              }
            ],
            filterMultiple: false,
            filterMethod (value, row) {
              if (value === 1) {
                return row.ncontsignmny > 1000;
              } else if (value === 2) {
                return row.ncontsignmny < 1000;
              }
            }
          },
          {
            title: '合同签订金额(含税)',
            key: 'ncontsigntaxmny',
            width: 180,
            sortable: true,
            filters: [
              {
                label: '大于1000',
                value: 1
              },
              {
                label: '小于1000',
                value: 2
              }
            ],
            filterMultiple: false,
            filterMethod (value, row) {
              if (value === 1) {
                return row.ncontsigntaxmny > 1000;
              } else if (value === 2) {
                return row.ncontsigntaxmny < 1000;
              }
            }
          },
          {
            title: '约定开始日期',
            key: 'dplanstartdate',
            width: 120
          },
          {
            title: '约定结束日期',
            key: 'dplanfinishdate',
            width: 120
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
              var optStatus =   params.row.opt_status;
              if (0 == optStatus) {
                return h('div', [
                  h('span', {
                    style: {
                      marginRight: '5px'
                    }
                  }, '已提交'),
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.detail(params)
                      }
                    }
                  }, '详情')])
              } else {
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
                        this.submit(params.row.id);
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
                        this.delete(params.row.id, params.row.vname);
                      }
                    }
                  }, '删除')
                ]);
              }


            }
          }
        ],
        modal1: false,
        nclist: [],
        ncmodel: '',
        typelist: [],
        typemodel: '',
        projectlist: [],
        projectmodel: '',
        projectlist1: [],
        projectmodel1: '',
        nclist1: [],
        ncmodel1: '',
        typelist1: [],
        typemodel1: '',
        contractList: [],
        listFrom: 0,  // 起始位置
        listTo: 10,  // 列表长度
        listTotal: 0  // 列表总条数
      }
    },
    methods: {
      delete(id, vname){
        this.$Modal.confirm({
          title: '警告',
          content: '<p>确定要删除合同【' + vname + '】？</p>',
          onOk: () => {
            const delUrl = api.delCompact() + '/' + id;
            this.ajax.get(delUrl, null, (data) => {
              if (data.error_code == 200) {
                this.$Message.success("删除成功");
                this.getList();
              } else {
                this.$Message.error(data.error_msg);
              }
            });
          }
        });
      },
      submit(compacteId){
        const submitUrl = api.contractSubmit() + '/' + compacteId;
        this.ajax.post(submitUrl, null, (data) => {
          if (data.error_code == 200) {
            this.$Message.success("提交成功");
            this.getList();
          } else {
            this.$Message.error(data.error_msg);
          }
        });
      },
      add(){
        if (this.ncmodel1 == null || this.ncmodel1 == '') {
          this.$Message.error('系统不能为空');
          return;
        }
        if (this.typemodel1 == null || this.typemodel1 == '') {
          this.$Message.error('合同类型不能为空');
          return;
        }
        router.push({
          path: "/contractEntry",
          query: {firstPartyId: this.ncmodel1, billCode: this.typemodel1, isEdit: false}
        });
      },
      getList () {  // 获取列表
        const url = api.getContractListData(),
          data = {
            start: this.listFrom,
            length: 10,
            firstpartyId: this.ncmodel,
            pk_billtypecode: this.typemodel,
            pk_project: this.projectmodel,
            search: ''
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
          path: "/contractEntry",
          //query: {templateCode: params.row.compactecode, contractId: params.row.id, isEdit: true}
          query: {
            firstPartyId: params.row.firstpartyId,
            billCode: params.row.pk_billtypecode,
            contractId: params.row.id,
            isEdit: true
          }
        });
      },
      detail(params){
        router.push({
          path: "/ContractDetail",
          //query: {templateCode: params.row.compactecode, contractId: params.row.id, isEdit: true}
          query: {
            firstPartyId: params.row.firstpartyId,
            billCode: params.row.pk_billtypecode,
            contractId: params.row.id,
            isEdit: true
          }
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
          this.nclist1 = data.data;
        });
      },
      getTypelist () {
        const url = api.getRefUrl();
        var typeData = {
          openKey: 'contract_type',
          search: '',
        }
        this.ajax.post(url, typeData, (data) => {
          console.log(data);
          this.typelist = data.data;
          this.typelist1 = data.data;
        });
      },
      getProjectlist () {
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
      }
    },
    computed: {},
    created () {
      this.getList();
      this.getNClist();
      this.getTypelist();
      this.getProjectlist();
    }
  }

</script>
<style scoped lang="less">
  @import "../assets/css/contract-manage.less";
</style>
