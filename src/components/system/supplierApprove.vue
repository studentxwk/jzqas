<template>
    <div class="contractManage layout-content" style="padding:0;">
        <div class="contractList">
            <div class="contractListOpt" style="line-height: normal;">
                <div class="contractListOptItem">
                    <span><Input v-model="queryVendor" icon="ios-search" placeholder="输入公司名称或营业执照号..."
                                 style="width:300px;"></Input></span>
                    <span><Button type="success" @click="getList()">查 询</Button></span>
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
                :closable="false"
                :mask-closable="false"
                width="450">
            <div class="dialogContainer">
                <div class="dialogConItem">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                        <Form-item label="用户名" prop="userCode">
                            <Input v-model="formValidate.userCode" placeholder="3-16位，字母、数字、下划线"></Input>
                        </Form-item>
                        <Form-item label="昵称" prop="phone">
                            <Input v-model="formValidate.userName" placeholder="昵称"></Input>
                        </Form-item>
                        <Form-item label="设置密码" prop="password">
                            <Input v-model="formValidate.password" type="password"
                                   placeholder="6-16位，字母、数字、下划线（至少两种）"></Input>
                        </Form-item>
                        <Form-item label="确认密码" prop="confirmPassword">
                            <Input v-model="formValidate.confirmPassword" type="password"
                                   placeholder="6-16位，字母、数字、下划线（至少两种）"></Input>
                        </Form-item>
                    </Form>
                </div>
            </div>
            <div slot="footer">
                <Button @click="closeM1('formValidate')">取 消</Button>
                <Button type="primary" :loading="addStatus" @click="add('formValidate')">确 定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    import router from '../../router';
    import api from '../../utils/api';

    export default {
        data() {
            const checkUserCode = (rule, value, callback) => {
                if (!/^[a-zA-Z\d_]{3,16}$/.test(value)) {
                    callback(new Error('用户名格式不符合规则！'));
                } else {
                    callback();
                }
            };
            const checkUserName = (rule, value, callback) => {
                if (/^[\s]{0,}$/.test(value)) {
                    callback(new Error('不能为空！'));
                } else {
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (!/^(?![a-zA-z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]{6,16}$/.test(value)) {
                    callback(new Error('密码格式不符合规则！'));
                } else {
                    if (this.formValidate.confirmPassword !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formValidate.validateField('confirmPassword');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (!/^(?![a-zA-z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]{6,16}$/.test(value)) {
                    callback(new Error('密码格式不符合规则！'));
                } else if (value !== this.formValidate.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                isEdit: false,
                addStatus: false,
                queryVendor: '',
                userId: '',
                formValidate: {
                    userCode: '',
                    password: '',
                    confirmPassword: '',
                    phone: ''
                },
                ruleValidate: {
                    userCode: [
                        {validator: checkUserCode, trigger: 'blur'}
                    ],
                    userName: [
                        {validator: checkUserName, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {validator: validatePassCheck, trigger: 'blur'}
                    ]
                },
                columns7: [
                    {
                        title: '公司名称',
                        align: 'center',
                        key: 'supplierName'
                    },
                    {
                        title: '营业执照号',
                        align: 'center',
                        key: 'corpRegNo'
                    },
                    {
                        title: '公司法人',
                        align: 'center',
                        key: 'corporation'/*,
                        render: (h, params) => {
                            var userType = params.row.userType;
                            if (1 == userType) {
                                return h('span', {}, '注册供应商');
                            }
                        }*/
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            var status = params.row.status;
                            if (0 == status) {
                                return h('span', {}, '未审批');
                            } else if (1 == status) {
                                return h('span', {}, '审批通过');
                            } else {
                                return h('span', {}, '审批不通过');
                            }
                        }
                    }, {
                        title: '创建时间',
                        align: 'center',
                        key: 'createTime',
                        width: 200
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 250,
                        align: 'center',
                        render: (h, params) => {
                            var status = params.row.status;
                            if (0 == status) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.detail(params.row.id);
                                            }
                                        }
                                    }, '查 看'),
                                    h('Button', {
                                        props: {
                                            type: 'success',
                                            size: 'small'
                                        },
                                        style: {
                                            marginLeft: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.approve(params.row.id, 1)
                                            }
                                        }
                                    }, '审批通过'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        style: {
                                            marginLeft: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.approve(params.row.id, 2)
                                            }
                                        }
                                    }, '审批不通过')
                                ])
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.detail(params.row.id);
                                            }
                                        }
                                    }, '查 看')
                                ]);
                            }
                        }
                    }
                ],
                modal1: false,
                modal2: false,
                nclist: [],
                limitNum: '',
                limitNum1: '',
                ncmodel1: '',
                contractList: [],
                listFrom: 0,  // 起始位置
                listTo: 10,  // 列表长度
                listTotal: 0  // 列表总条数
            }
        },
        methods: {
            detail(params) {//查看
                this.$router.push({
                    path: "/SystemManage/SupplierDetail",
                    query: {id: params}
                });
            },
            //审批通过
            approve(approveId, approveStatus) {
                const url = api.approveSupplier();
                var data = {
                    id: approveId,
                    status: approveStatus
                };
                this.ajax.post(url, data, (data) => {
                    if (data.error_code == 200) {
                        this.getList();
                        this.$Message.success('审批成功');
                    } else {
                        this.$Message.success('审批失败');
                    }
                });
            },
            open() {
                this.modal1 = true;
                this.userId = '';
                for (let key in this.formValidate) {
                    this.formValidate[key] = '';
                }

            },
            getList() {  // 获取列表
                const url = api.getSupplierList(),
                    data = {
                        start: this.listFrom,
                        length: 10,
                        search: this.queryVendor
                    };

                this.ajax.post(url, data, (data) => {
                    this.contractList = data.data.list;
                    this.listTotal = data.data.total;
                    this.listTo = 10;
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
            checkNum(name) {
                if (/^[\s]{0,}$/.test(this[name])) {
                    this.checkNum = true;
                    this.errorNumTip = '不能为空！';
                } else {
                    this.checkNum = false;
                }
            },
            closeM1(name) {
                this.modal1 = false;
                this.$refs[name].resetFields();
            }
        },
        computed: {},
        created() {
            this.getList();
        }
    }
</script>
<style scoped lang="less">
    @import "../../assets/css/contract-manage.less";
    @import "../../assets/css/control.css";
</style>

