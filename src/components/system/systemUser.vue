<template>
    <div class="contractManage layout-content" style="padding:0;">
        <div class="contractList">
            <div class="contractListOpt" style="line-height: normal;">
                <div class="contractListOptItem">
                    <Button type="info" @click="open()" class="mar-r10">新 增</Button>
                    <span><Input v-model="queryVendor" icon="ios-search" placeholder="输入用户名或昵称..."
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
                queryVendor: '',
                isEdit: false,
                addStatus: false,
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
                        title: '用户名',
                        align: 'center',
                        key: 'userCode'
                    },
                    {
                        title: '昵称',
                        align: 'center',
                        key: 'userName'
                    },
                    {
                        title: '用户类型',
                        align: 'center',
                        key: 'userType',
                        render: (h, params) => {
                            var userType = params.row.userType;
                            if (0 == userType) {
                                return h('span', {}, '管理员');
                            }
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            var status = params.row.status;
                            if (0 == status) {
                                return h('span', {}, '启 用');
                            } else {
                                return h('span', {}, '停 用');
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
                        align: 'center',
                        render: (h, params) => {
                            var optStatus = params.row.opt_status;
                            return h('div', [
                                /*  h('Button', {
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
                          }, '修改'),*/
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delete(params.row.id, params.row.userName);
                                        }
                                    }
                                }, '删 除')
                            ]);

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
            delete(id, firstpartyName) {
                this.$Modal.confirm({
                    title: '警告',
                    content: '<p>确定要删除用户【' + firstpartyName + '】？</p>',
                    onOk: () => {
                        const delUrl = api.delUserInfo() + '/' + id;
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
            edit(params) {
                this.modal1 = true;
                this.isEdit = true;
                const url = api.getUserInfo() + params.row.id;
                this.ajax.get(url, {}, (data) => {

                    for (let key in data.data) {
                        if (key !== 'dr' && key !== 'ts') {
                            this.formValidate[key] = data.data[key];
                        }
                    }
                })
            },
            open() {
                this.modal1 = true;
                this.userId = '';
                for (let key in this.formValidate) {
                    this.formValidate[key] = '';
                }

            },
            getList() {  // 获取列表
                const url = api.getAllUser(),
                    data = {
                        start: this.listFrom,
                        length: 10,
                        userType: 0,
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
            add(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.addStatus = true;
                        const url = api.saveUserInfo();
                        var user = this.formValidate;
                        user.userType = 0;
                        this.ajax.post(url, user, (data) => {
                            this.$Message.info('操作成功');
                            this.addStatus = false;
                            this.getList();
                            this.closeM1();
                        }, (data) => {
                            this.$Message.error(data.error_msg);
                            this.addStatus = false;
                        }, (error) => {
                            alert(error)
                            this.addStatus = false;
                        });

                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                });
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

