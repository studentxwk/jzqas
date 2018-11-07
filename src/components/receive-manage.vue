<template>
    <div class="contractManage layout-content">
        <div class="opt">
            <div class="optItem">
                <span class="lb">NC系统</span>
                <Select v-model="ncmodel" clearable filterable style="width:300px">
                    <Option v-for="item in nclist" :value="item.id" :key="item.id">{{ item.corpName }}
                    </Option>
                </Select>
            </div>
            <div class="optItem">
                <span class="lb">项目</span>
                <Select v-model="projectmodel" clearable filterable style="width:300px">
                    <Option v-for="item in projectList" :value="item.projectId" :key="item.projectId">
                        {{ item.projectName }}
                    </Option>
                </Select>
            </div>
            <div class="optItem">
                <Button type="success" @click="getList()">查询</Button>
            </div>
        </div>
        <div class="contractList">
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
                width="360">
            <div class="dialogContainer">
                <div class="dialogConItem">
                    <div class="lb">
                        NC系统
                    </div>
                    <Select style="width:200px">
                    </Select>
                    <div class="clear"></div>
                </div>
                <div class="dialogConItem">
                    <div class="lb">
                        合同类型
                    </div>
                    <Select style="width:200px">
                    </Select>
                    <div class="clear"></div>
                </div>
                <div class="dialogConItem">
                    <div class="lb">
                        项目
                    </div>
                    <Select style="width:200px">
                    </Select>
                    <div class="clear"></div>
                </div>
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
        data() {
            return {
                columns7: [
                    {
                        title: '项目',
                        key: 'projectName'
                    },
                    {
                        title: '付款金额',
                        key: 'npaymny'
                    },
                    {
                        title: '结算方式',
                        key: 'vpaytype'
                    },
                    {
                        title: '付款银行账户',
                        key: 'vbankaccbas'
                    },
                    {
                        title: '现金账户',
                        key: 'vcashaccount'
                    },
                    {
                        title: '收款银行账户',
                        key: 'vreceiptacc'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
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
                                            this.details(params);
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }
                ],
                nclist: [],
                modal1: false,
                ncmodel: '',
                projectList: [],
                projectmodel: '',
                contractList: [],
                listFrom: 0,  // 起始位置
                listTo: 10,  // 列表长度
                listTotal: 0  // 列表总条数
            }
        },
        methods: {
            getList() {  // 获取列表
                const url = api.getReceiveList(),
                    data = {
                        start: this.listFrom,
                        length: 10,
                        search: '',
                        firstpartyId: this.ncmodel,
                        projectId: this.projectmodel
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
            changePage(n) {  // 切换分页，重载数据
                this.listTo = 10;
                this.listFrom = this.listTo * (n - 1);
                this.getList();
            },
            details(params) {
                router.push({
                    path: "/ReceiveItem",
                    query: {receiveId: params.row.id}
                });
            },
            getNClist() {
                const url = api.getRefUrl();
                var ncData = {
                    openKey: 'nc_system',
                    search: '',
                }
                this.ajax.post(url, ncData, (data) => {
                    console.log(data);
                    this.nclist = data.data;

                });
            },
            getProjectList() {
                const url = api.getRefUrl();
                var proData = {
                    openKey: 'pk_project',
                    //firstpartyId: this.firstpartyId,
                    search: '',
                }
                this.ajax.post(url, proData, (data) => {
                    console.log(data);
                    this.projectList = data.data;

                });
            },
        },
        computed: {},
        created() {
            this.getNClist();
            this.getProjectList();
            this.getList();
        }
    }

</script>
<style scoped lang="less">
    @import "../assets/css/contract-manage.less";
</style>
