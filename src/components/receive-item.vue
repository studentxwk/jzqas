<template>
    <div>
        <div v-model="recModel">
            <Form label-position="right" :label-width="70" style="margin:10px 40px;width: 35%">
                <Form-item label="NC系统" style="font-weight: bold" >
                    <Input v-model="recModel.ncName" readonly="true"></Input>
                </Form-item>
            </Form>
            <Collapse v-model="model">
                <Panel name="1" style="text-align: left">
                    基本信息
                    <div slot="content" style="padding: 0 20px">
                        <div style="float: left;width: 50%;padding-right:20px ">
                            <Form label-position="right" :label-width="70">
                                <Form-item label="项目">
                                    <Input v-model="recModel.projectName" readonly="true"></Input>
                                </Form-item>
                                <Form-item label="结算方式">
                                    <Input v-model="recModel.vpaytype" readonly="true"></Input>
                                </Form-item>
                                <Form-item label="现金账户">
                                    <Input v-model="recModel.vcashaccount" readonly="true"></Input>
                                </Form-item>
                            </Form>
                        </div>
                        <div style="float: left;width: 50%">
                            <Form label-position="right" :label-width="100">
                                <Form-item label="付款金额">
                                    <Input v-model="recModel.npaymny" readonly="true"></Input>
                                </Form-item>
                                <Form-item label="付款银行账户">
                                    <Input v-model="recModel.vbankaccbas" readonly="true"></Input>
                                </Form-item>
                                <Form-item label="收款银行账户">
                                    <Input v-model="recModel.vreceiptacc" readonly="true"></Input>
                                </Form-item>
                            </Form>
                        </div>
                        <Form :model="recModel" label-position="right" :label-width="70">
                            <Form-item label="备注">
                                <Input v-model="recModel.vmemo" readonly="true"></Input>
                            </Form-item>
                        </Form>
                    </div>
                </Panel>
            </Collapse>
        </div>

        <div>
            <Tabs value="name1">
                <Tab-pane label="" name="name1">
                    <Table border :columns="columns7" :data="receiveList"></Table>
                </Tab-pane>
            </Tabs>
        </div>
    </div>


</template>
<script>
    import router from '../router';
    import api from '../utils/api';
    import axios from 'axios';

    export default {
        data() {
            return {
                model: '1',
                recModel: '',
                receiveList: [],
                columns7: [
                    {
                        title: '用途',
                        key: 'vuse'
                    },
                    {
                        title: '费用项目',
                        key: 'vfeeitem'
                    },
                    {
                        title: 'npaymny',
                        key: '付款金额'
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
                        title: '备注',
                        key: 'vmemo'
                    }
                ]
            }
        },
        methods: {
            getList(id) {  // 获取列表
                const url = api.getReceive() + '/' + id;

                this.ajax.get(url, null, (data) => {
                    console.log(data);
                    this.recModel = data.data;
                    this.receiveList = data.data.inReceiveBModelList;
                });
            }
        },
        computed: {},
        created() {
            var recId = this.$route.query.receiveId;
            this.getList(recId);

        }
    }
</script>

<style scoped lang="less">
/*    @import "../assets/css/receive-item.less";*/
</style>