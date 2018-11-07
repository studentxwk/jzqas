<template>
  <div class="contractManage layout-content" style="padding:0;">
    <div class="contractList">
      <div class="contractListOpt" style="line-height: normal;">
        <div class="contractListOptItem">
          <Button type="success" @click="modal1 = true">新增</Button>
          <span><Input v-model="queryVendor" icon="ios-search"   placeholder="输入用户名或昵称..." style="width:300px;"></Input></span>
          <span><Button type="success" @click="getList()">查询</Button></span>
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
            <div class="inputs-wrap">
                <div class="relative">
                    <span class="input-name">NC系统</span>
                    <Select v-model="ncmodel1" style="width:300px">
                        <Option v-for="item in nclist" :value="item.id" :key="item.id">{{ item.corpName }}</Option>
                    </Select>
                </div>
            </div>

          <div class="clear"></div>
        </div>
        <div class="dialogConItem">
            <div class="inputs-wrap">
                <div class="relative">
                    <span class="input-name">授权项目数</span>
                    <Input type="text" v-model="limitNum" style="width: 300px" placeholder="输入授权项目数"></Input>
                </div>
            </div>
          <div class="clear"></div>
        </div>
      </div>
    </Modal>
      <Modal
              v-model="modal2"
              title="修改"
              width="450"
              @on-ok="mod">
          <div class="dialogContainer">
              <div class="dialogConItem">
                  <div class="inputs-wrap">
                      <div class="relative">
                          <span class="input-name">授权项目数</span>
                          <Input type="text" v-model="limitNum1" style="width: 300px" placeholder="输入授权项目数"></Input>
                      </div>
                  </div>
                  <div class="clear"></div>
              </div>
          </div>
      </Modal>
  </div>
</template>
<script>
    import router from '../../router';
    import api from '../../utils/api';
    import axios from 'axios';
    export default {
        data () {
            return {
                columns7: [
                    {
                        title: '甲方名称',
                        align: 'center',
                        key: 'firstpartyName'
                    },
                    {
                        title: '授权项目数',
                        align: 'center',
                        key: 'limitNum'
                    },
                    {
                        title: '已使用授权项目数',
                        align: 'center',
                        key: 'usedLimit'
                    },
                    {
                        title: '授权时间',
                        align: 'center',
                        key: 'updateTime'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            var optStatus = params.row.opt_status;
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
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.delete( params.row.id,params.row.firstpartyName);
                                            }
                                        }
                                    }, '删除')
                                ]);

                        }
                    }
                ],
                modal1: false,
                modal2: false,
//                checkNum: false,
                nclist: [],
                limitNum:'',
                limitNum1:'',
                ncmodel1: '',
                limitId:'',
                errorNumTip: '',
                contractList: [],
                listFrom: 0,  // 起始位置
                listTo: 10,  // 列表长度
                listTotal: 0  // 列表总条数
            }
        },
        methods: {
            delete(id,firstpartyName){
                this.$Modal.confirm({
                    title: '警告',
                    content: '<p>确定要删除【'+firstpartyName+'】的授权信息？</p>',
                    onOk: () => {
                        const delUrl = api.delProjectLimit()+'/'+id;
                        this.ajax.get(delUrl,null,(data) => {
                            if (data.error_code == 200) {
                                this.$Message.success("删除成功");
                                this.getList();
                            }else{
                                this.$Message.error(data.error_msg);
                            }
                        });
                    }
                });
            },
            edit(params){
                this.modal2 = true;
                this.limitNum1 = params.row.limitNum;
                this.limitId = params.row.id;
            },
            getList () {  // 获取列表
                const url = api.getProjectLimitsList(),
                    data = {
                        start: this.listFrom,
                        length: 10,
                        firstpartyId: this.ncmodel,
                        pk_billtypecode: this.typemodel,
                        pk_project: this.projectmodel,
                        search: ''
                    };

                this.ajax.get(url, data, (data) => {
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
//            checkNum(name) {
//                if( /^[\s]{0,}$/.test(this[name]) ) {
//                    this.checkNum = true;
//                    this.errorNumTip = '不能为空！';
//                } else {
//                    this.checkNum = false;
//                }
//            },
            add(){
                if(this.ncmodel1 == null || this.ncmodel1 == '') {
                    this.$Message.error('系统不能为空');
                    return;
                }
                if(this.limitNum == null || this.limitNum == ''){
                    this.$Message.error('授权项目数不能为空');
                    return;
                }
                const url = api.saveLimitNum(),
                    data = {
                        firstpartyId: this.ncmodel1,
                        limitNum: this.limitNum,
                    };

                this.ajax.post(url, data, (data) => {
                    this.$Message.info('授权项目数设置成功');
                    this.listTo = 10,
                    this.getList();
                });

            },
            mod(){
                if(this.limitNum1 == null || this.limitNum1 == ''){
                    this.$Message.error('授权项目数不能为空');
                    return;
                }
                const url = api.updateLimitNum(),
                    data = {
                        id: this.limitId,
                        limitNum: this.limitNum1,
                    };

                this.ajax.post(url, data, (data) => {
                    this.$Message.info('授权项目数修改成功');
                    this.getList();
                });

            },
            getNClist () {
                const url = api.getAllFpList();
                this.ajax.get(url, null, (data) => {
                    console.log(data);
                    this.nclist = data.data;
                });
            },
            checkLimitNum: function (name) {
                if (/^[\s]{0,}$/.test(this[name])) {
                    this.limitNum = true;
                } else {
                    this.limitNum = false;
                    this.errorPhTip = '不能为空！';
                }
            },
        },
        computed: {},
        created () {
            this.getList();
            this.getNClist();
        }
    }
</script>
<style scoped lang="less">
    @import "../../assets/css/contract-manage.less";
    @import "../../assets/css/control.css";
</style>

