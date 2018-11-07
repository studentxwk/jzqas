<template>
    <div class="contractManage layout-content">
        <div class="opt">
            <div class="optItem">
                <span class="lb">NC系统</span>
                <Select v-model="ncmodel" clearable filterable style="width:300px">
                    <Option v-for="item in nclist" :value="item.id" :key="item.id">
                        {{ item.corpName }}
                    </Option>
                </Select>
            </div>
            <div class="optItem">
                <span class="lb">合同类型</span>
                <Select v-model="contractTypemodel" clearable filterable style="width:200px">
                    <Option v-for="item in contractTypeList" :value="item.templetCode" :key="item.templetCode">{{ item.templetName }}</Option>
                </Select>
            </div>

            <div class="optItem">
                <span class="lb">项目</span>
                <Select v-model="projectmodel" clearable filterable style="width:300px;">
                    <Option v-for="item in projectList" :value="item.id" :key="item.id">
                        {{ item.projectName }}
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
                    <Button type="success" v-model="modal1"
                            @click="add()">新增</Button>
                </div>
            </div>
            <Table border :columns="columns" :data="openList"></Table>
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
    import router from '../router';
    import api from '../utils/api';
    import axios from 'axios';
    export default {
        data () {
            return {
                columns: [
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
                        title: '发票代码',
                        key: 'vinvcode'
                    },
                    {
                        title: '发票号码',
                        key: 'vinvno'
                    },
                    {
                        title: '开票日期',
                        key: 'dopendate'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                        var status = params.row.status;
                        if(0 == status) {
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, '已提交'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.detail( params.row.id);
                                        }
                                    }
                                }, '查看')
                            ])
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
                                        this.delete( params.row.id,params.row.subcontractName);
                                        }
                                    }
                                    }, '删除')
                            ]);

                        }
                    }
                }
            ],
            modal1: false,
                    ncmodel:'',//ncmode
                    nclist:[],//nc列表
                    contractTypemodel:'',//合同类型model
                    contractTypeList:[],//合同类型列表
                    projectmodel:'',//项目model
                    projectList:[],//项目列表
                    contractmodel:'',//合同model
                    contractList:[],//合同列表
                    listFrom:0,  // 起始位置
                    listTo:10,  // 列表长度
                    listTotal:0,// 列表总条数
                    openList:[],
            }
        },
        methods: {
            getList () {  // 查询获取开票列表
                const url = api.getOpenListData(),
                data = {
                    start: this.listFrom,
                    length: 10,
                    search: '',
                    firstpartyId: this.ncmodel,
                    contracttypeId: this.contractTypemodel,
                    projectId: this.projectmodel,
                };
                console.log(data);
                this.ajax.post(url, data, (data) => {
                this.openList = data.data.list;
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
            edit(params){//修改
                router.push({
                    path: "/OpenEdit",
                    query: {openId: params.row.id, isEdit: true,mark:0}
                });
            },
            detail(params){//查看
                router.push({
                    path: "/OpenDetail",
                    query: {openId: params, isEdit: false,mark:0}
                });
            },
            submit(openid){//提交
                const url = api.submitOpen(openid);

                this.ajax.post(url, null, (data) => {
                if (data.error_code == 200) {
                    this.getList();
                    this.$Message.success('提交成功');
                }else{
                    this.$Message.success('提交失败');
                }
               });
            },
            delete(id,subcontractName){
                this.$Modal.confirm({
                            title: '警告',
                            content:  '<p>确定要删除合同【'+subcontractName+'】？</p>',
                            onOk: () => {
                            const delUrl = api.delOpenData(id);
                this.ajax.delete(delUrl,null,(data) => {
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
            getContractTypeList () {//获取合同类型列表
                const url = api.getRefUrl();
                var typeData = {
                    openKey: 'contract_type',
                    search: '',
                }
                this.ajax.post(url, typeData, (data) => {
                console.log(data);
                this.contractTypeList = data.data;
              //  this.contractTypeList1 = data.data;
            });
            },
            getProjectList (){//获取项目列表
                const url = api.getRefUrl();
                var proData = {
                    openKey: 'pk_project',
                    firstpartyId: this.firstpartyId,
                    search: '',
                }
                this.ajax.post(url, proData, (data) => {
                console.log(data);
                this.projectList = data.data;
                this.projectList1 = data.data;
            });
            },
            add(){//新增
                router.push({
                    path: "/OpenEdit",
                });
            },
        },
        computed: {},
        created () {
            this.getList();
            this.getNClist();
            this.getContractTypeList();
            this.getProjectList();
        }
    }

</script>
<style scoped lang="less">
    @import "../assets/css/contract-manage.less";
</style>
