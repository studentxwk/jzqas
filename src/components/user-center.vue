<template>
    <div class="layout">
        <Row class="layout-content">
            <i-col span="4" class="left-menu">
                <h5 class="menus-name">个人中心</h5>
                <ul class="all-items">
                    <li v-for="(item, index) in allItems" :class="{active: item.isActive}" @click="changeActive(index)"
                        v-text="item.text"></li>
                </ul>
            </i-col>
            <i-col span="20">
                <!-- 账户信息 -->
                <div v-if="accountTab=='tab_1'" style="position: relative;">
                    <span class="sub-title">信息越全面合同来的越快，带*号的为必填项</span>
                    <Tabs value="name_0">
                        <Tab-pane label="基本信息" name="name_0" class="layout-content-main">
                            <Form ref="formValidate" :model="account" :rules="ruleValidate" class="inputs-wrap"
                                  :label-width="90">
                                <Row :gutter="24">
                                    <Col :xs="24" :sm="24">
                                    <Form-item label="公司名称" prop="supplierName">
                                        <Input v-model="account.supplierName" placeholder="请输入"></Input>
                                    </Form-item>
                                    </Col>
                                    <Col :xs="24" :sm="24">
                                    <Form-item label="营业执照号" prop="corpRegNo">
                                        <Input v-model="account.corpRegNo" placeholder="请输入"></Input>
                                    </Form-item>
                                    </Col>
                                </Row>
                                <Row :gutter="24">
                                    <Col :xs="24" :sm="24">
                                    <Form-item label="公司法人" prop="corporation">
                                        <Input v-model="account.corporation" placeholder="请输入"></Input>
                                    </Form-item>
                                    </Col>
                                    <Col :xs="24" :sm="24">
                                    <Form-item label="注册日期" prop="corpRegDate">
                                        <Date-picker v-model="account.corpRegDate" placeholder="请输入"
                                                     readonly></Date-picker>
                                    </Form-item>
                                    </Col>
                                </Row>
                                <Row :gutter="24">
                                    <Col :xs="24" :sm="24">
                                    <Form-item label="企业地址" prop="corpAddress">
                                        <Input v-model="account.corpAddress" placeholder="请输入"></Input>
                                    </Form-item>
                                    </Col>
                                    <Col :xs="24" :sm="24">
                                    <Form-item label="注册资金" prop="corpRegCapital">
                                        <Input-number v-model="account.corpRegCapital" placeholder="请输入"></Input-number>
                                    </Form-item>
                                    </Col>
                                </Row>
                                <Button type="primary" size="large" class="confirm-btn"
                                        @click="handleSubmit('formValidate')">
                                    保 存
                                </Button>
                            </Form>
                        </Tab-pane>
                    </Tabs>
                </div>
                <!-- 账户安全 -->
                <div v-if="accountTab=='tab_2'">
                    <Tabs :animated="false" value="name1">
                        <Tab-pane label="修改密码" name="name1" class="layout-content-main">
                            <div class="inputs-wrap">
                                <Form ref="userCenterPwd" :model="mdUserPwd" :rules="ruleUserPwd" :label-width="80">
                                    <Form-item label="原密码" prop="oldPassword">
                                        <Input v-model="mdUserPwd.oldPassword" type="password"
                                               placeholder="请输入原密码"></Input>
                                    </Form-item>
                                    <Form-item label="新密码" prop="newPassword">
                                        <Input v-model="mdUserPwd.newPassword" type="password"
                                               placeholder="6-16位，字母、数字、下划线（至少两种）"></Input>
                                    </Form-item>
                                    <Form-item label="确认新密码" prop="againPassword">
                                        <Input v-model="mdUserPwd.againPassword" type="password"
                                               placeholder="6-16位，字母、数字、下划线（至少两种）"></Input>
                                    </Form-item>
                                    <Form-item>
                                        <Button type="primary" @click="handleUserPwd('userCenterPwd')" size="large" class="confirm-btn">确 定</Button>
                                    </Form-item>
                                </Form>
                            </div>
                        </Tab-pane>
                        <!--<Tab-pane label="修改手机" name="name2" class="layout-content-main">
                            <div class="inputs-wrap">
                                <div class="relative">
                                    <span class="input-name">原手机号码</span>
                                    <Input v-model="phonePattern"  readonly></Input>
                                </div>
                                <div class="relative">
                                    <span class="input-name">验证码</span>
                                    <Input v-model="verifyCode" :class="{error_border:checkVcode}" @on-blur="checkVfyCode(verifyCode)" placeholder="验证码" style="width:50%;margin-right:30px;"></Input>
                                    <Button type="info" :disabled="noSendCode" :loading="noSendCode" @click="sendVfyCode">{{ sendVfyTxt }}</Button>
                                    <p class="ivu-form-item-error-tip top42" v-if="checkVcode" style="margin:-10px 0px 0px  90px">{{ errorVcTip }}</p>
                                </div>
                                <div class="relative">
                                    <span class="input-name">新手机号码</span>
                                    <Input v-model="bindPhoneNum" :class="{error_border:checkPhone}" @on-blur="checkPhoneNum('bindPhoneNum')" placeholder="手机号码"></Input>
                                    <p class="ivu-form-item-error-tip top42" v-if="checkPhone" style="margin:-10px 0px 0px  90px">{{ errorPhTip }}</p>
                                </div>
                                <Button type="primary" @click="phoneOk" size="large" class="confirm-btn">确定</Button>
                            </div>
                        </Tab-pane>-->
                    </Tabs>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import api from '../utils/api';
    import router from '../router';

    export default {
        data() {
            const validOldPass = (rule, value, callback) => {
                if (!/^(?![a-zA-z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]{6,16}$/.test(value)) {
                    callback(new Error('密码格式不符合规则！'));
                } else {
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (!/^(?![a-zA-z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]{6,16}$/.test(value)) {
                    callback(new Error('密码格式不符合规则！'));
                } else {
                    if (this.mdUserPwd.againPassword !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.userCenterPwd.validateField('againPassword');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (!/^(?![a-zA-z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]{6,16}$/.test(value)) {
                    callback(new Error('密码格式不符合规则！'));
                } else if (value !== this.mdUserPwd.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                allItems: [
                    {text: '基本信息', isActive: true},
                    {text: '密码安全', isActive: false}
                ],
                accountTab: 'tab_1',  // 默认显示账户信息标签
                mdUserPwd: {
                    oldPassword: '',  // 现用密码
                    newPassword: '',  // 新密码
                    againPassword: ''  // 重复新密码
                },
                ruleUserPwd: {
                    oldPassword: [
                        {validator: validOldPass, trigger: 'blur'}
                    ],
                    newPassword: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    againPassword: [
                        {validator: validatePassCheck, trigger: 'blur'}
                    ]
                },
                phone: '',//原手机号码
                phonePattern: '',//原手机号码
                bindPhoneNum: '',  // 绑定手机号码
                verifyCode: '',  // 手机验证码
                sendVfyTxt: '获取验证码',  // 按钮文字
                errorPhTip: '',
                errorVcTip: '不能为空！',
                checkPhone: false,
                checkVcode: false,
                noSendCode: false,
                account: {
                    supplierName: '',  // 公司名称
                    corpRegNo: '',  // 营业执照号
                    corporation: '',  // 公司法人
                    corpRegDate: '',  // 营业执照日期
                    corpAddress: '',  // 企业地址
                    corpRegCapital: ''  // 注册资金
                },
                ruleValidate: {
                    supplierName: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    corpRegNo: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    corporation: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            changeActive(index) {
                this.allItems.map((item, i) => {
                    if (i == index) {
                        item.isActive = true;
                        this.accountTab = 'tab_' + (index + 1);
                    } else {
                        item.isActive = false;
                    }
                });
            },
            handleUserPwd(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const url = api.userEditPsw();
                        var pswData = {
                            password: this.oldPassword,
                            newpassword: this.newPassword,
                            confirmPassword: this.againPassword
                        };

                        this.ajax.post(url, pswData, (data) => {
                            this.$Modal.success({
                                title: '提示',
                                content: '<p>密码修改成功,请重新登录...</p>',
                                onOk: () => {
                                    router.push({path: "/login"});
                                }
                            });
                        }, (data) => {
                            this.$Message.error(data.error_msg);
                        })
                    }
                });
            },
            checkPhoneNum(name) {
                if (/^[\s]{0,}$/.test(this[name])) {
                    this.checkPhone = true;
                    this.errorPhTip = '不能为空！';
                }
                else if (!( /^(13|15|17|18)\d{9}$/.test(this[name]) )) {
                    this.checkPhone = true;
                    this.errorPhTip = '手机号码格式不正确！';
                }
                else {
                    this.checkPhone = false;
                    this.errorPhTip = '';
                }
            },
            checkVfyCode(name) {
                if (/^[\s]{0,}$/.test(this[name])) {
                    this.checkVcode = true;
                } else {
                    this.checkVcode = false;
                }
            },
            sendVfyCode() {
                //this.checkPhoneNum('bindPhoneNum');
                if (!this.checkPhone) {
                    this.noSendCode = true;
                    var num = 60;
                    this.sendVfyTxt = '等待 ' + num + ' s';

                    this.timer = setInterval(() => {
                        num--;
                        this.sendVfyTxt = '等待 ' + num + ' s';
                        if (num === 0) {
                            clearInterval(this.timer);
                            this.sendVfyTxt = '获取验证码';
                            this.noSendCode = false;
                        }
                    }, 1000);
                    const url = api.getPhoneCode();
                    var openData = {
                        phone: this.phone
                    };
                    this.ajax.post(url, openData, (data) => {
                        console.log(data);
                    });
                }
            },
            phoneOk() {
                this.checkPhoneNum('bindPhoneNum');
                this.checkVfyCode('verifyCode');
                if (!this.checkPhone && !this.checkVcode) {
                    clearInterval(this.timer);
                    this.sendVfyTxt = '获取验证码';
                    this.noSendCode = false;
                    const url = api.modifyPhone();
                    var openData = {
                        phone: this.bindPhoneNum,
                        checkcode: this.verifyCode
                    };
                    this.ajax.post(url, openData, (data) => {
                        if (data.error_code == 200) {
                            this.$Message.info('手机号绑定成功');
                        } else {
                            this.$Message.info(data.error_msg);
                        }
                    });
                }
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.saveUserInfo();
                    }
                });
            },
            getUserInfo() {
                const url = api.userInfo();

                this.ajax.get(url, {}, (data) => {
                    this.phonePattern = this.filterTel(data.data.phone);
                    this.phone = data.data.phone;
                    for (let key in data.data.supplierModel) {
                        if (key !== 'dr' && key !== 'ts') {
                            this.account[key] = data.data.supplierModel[key];
                        }
                    }
                })
            },

            filterTel(str) {
                let start = str.slice(0, 4);
                let end = str.slice(-2);
                return `${start}******${end}`;
            },

            //时间转换
            formatDate(date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            saveUserInfo() {
                const url = api.saveUserBasic();
                this.account.corpRegDate = this.formatDate(new Date(this.account.corpRegDate));
                var reqData = {supplierModel: this.account};

                this.ajax.post(url, reqData, (data) => {
                    if (data.error_code == 200) {
                        this.$Message.success('保存成功!');
                    } else {
                        this.$Message.error('修改失败!');
                    }
                })
            }
        },
        created() {
            this.getUserInfo();
        }
    }
</script>

<style scoped>
    @import "../assets/css/control.css";
</style>