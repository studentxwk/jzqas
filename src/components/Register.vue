<template>
    <div class="wrap">
        <div class="wrap-box">
            <div class="register-top">
                <img src="../assets/deep-logo.png" alt="">
            </div>
            <div class="content">
                <div class="register-title">
                    供应商注册
                </div>
                <div class="form-box">
                    <Steps :current="current">
                        <Step title="第一步" content="注册"></Step>
                        <Step title="第二步" content="供应商信息维护"></Step>
                        <Step title="第三步" content="完成"></Step>
                    </Steps>
                    <div class="step-box">
                        <ul>
                            <li v-if="current === 0">
                                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                                    <Form-item label="用户名" prop="userCode">
                                        <Input v-model="formValidate.userCode" placeholder="3-16位，字母、数字、下划线"></Input>
                                    </Form-item>
                                    <Form-item label="手机号码" prop="phone">
                                        <Input v-model="formValidate.phone" placeholder="手机号码"></Input>
                                    </Form-item>
                                    <!--<Form-item label="验证码" prop="verifyCode">
                                      <Input v-model="formValidate.verifyCode" class="getVerifyCode" placeholder="验证码">
                                        <Button slot="append" :disabled="noSendCode" :loading="noSendCode" @click="sendVfyCode">{{ sendVfyTxt }}</Button>
                                      </Input>
                                    </Form-item>-->
                                    <Form-item label="设置密码" prop="password">
                                        <Input v-model="formValidate.password" type="password"
                                               placeholder="6-16位，字母、数字、下划线（至少两种）"></Input>
                                    </Form-item>
                                    <Form-item label="确认密码" prop="confirmPassword">
                                        <Input v-model="formValidate.confirmPassword" type="password"
                                               placeholder="6-16位，字母、数字、下划线（至少两种）"></Input>
                                    </Form-item>
                                    <Form-item>
                                        <Button type="primary" long @click="handleSubmit('formValidate')">下一步</Button>
                                        <div class="to-login">已有账号？去 <a @click.prevent="toLogin">登录</a></div>
                                    </Form-item>
                                </Form>
                            </li>
                            <li v-if="current === 1">
                                <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1"
                                      :label-width="90">
                                    <Form-item label="公司名称" prop="supplierName">
                                        <Input v-model="formValidate1.supplierName"></Input>
                                    </Form-item>
                                    <Form-item label="营业执照号" prop="corpRegNo">
                                        <Input v-model="formValidate1.corpRegNo"></Input>
                                    </Form-item>
                                    <Form-item label="公司法人" prop="corporation">
                                        <Input v-model="formValidate1.corporation" class="append-hack"></Input>
                                    </Form-item>
                                    <Form-item label="主要供应类型" prop="vendorType">
                                        <Select v-model="formValidate1.vendorType">
                                            <Option v-for="item in supplyTypeList" v-bind:value="item.ienumValue"
                                                    v-bind:key="item.ienumValue">{{ item.vdisplayName }}
                                            </Option>
                                        </Select>
                                    </Form-item>
                                    <Form-item label="企业地址" prop="corpAddress">
                                        <Input v-model="formValidate1.corpAddress"></Input>
                                    </Form-item>
                                 <!--   <Form-item label="供应商税类" prop="vendorTax">
                                        <Input v-model="formValidate1.vendorTax"></Input>
                                    </Form-item>-->
                                    <Form-item label="电话" prop="phoneNum">
                                        <Input v-model="formValidate1.phoneNum"></Input>
                                    </Form-item>
                                    <Form-item label="传真" prop="faxNum">
                                        <Input v-model="formValidate1.faxNum"></Input>
                                    </Form-item>
                                    <Form-item>
                                        <Button :loading="isSubmit" type="primary" long
                                                @click="handleSubmit('formValidate1')">下一步
                                        </Button>
                                    </Form-item>
                                </Form>
                            </li>
                            <li v-if="current === 2">
                                <div class="complete">
                                    <span class="img"></span>
                                    <span>恭喜您，注册完成！</span>
                                </div>
                                <p class="jump-page"><span>{{daojishi}}</span> 秒后自动跳转至首页 <a @click.prevent="toLogin">立即跳转</a>
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer">
                用友建筑云服务有限公司
            </div>
        </div>
    </div>
</template>
<script>
    import router from '../router';
    import api from '../utils/api';

    export default {
        data() {
            const checkUserCode = (rule, value, callback) => {
                if (!/^[a-zA-Z\d_]{3,16}$/.test(value)) {
                    callback(new Error('用户名格式不符合规则！'));
                } else {
                    callback();
                }
            };
            const checkPhone = (rule, value, callback) => {
                if (!/^(13|15|17|18)\d{9}$/.test(value)) {
                    callback(new Error('手机号码格式不正确！'));
                } else {
                    callback();
                }
            };
            /*const checkVerify = (rule, value, callback) => {
              if (!/^\d{6}$/.test(value)) {
                callback(new Error('验证码格式不正确！'));
              } else {
                callback();
              }
            };*/
            const validatePass = (rule, value, callback) => {
                if (!/^(?![a-zA-Z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]{6,16}$/.test(value)) {
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
                if (!/^(?![a-zA-Z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]{6,16}$/.test(value)) {
                    callback(new Error('密码格式不符合规则！'));
                } else if (value !== this.formValidate.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const corpRegNoCheck = (rule, value, callback) => {
                if (!/^[A-Z\d]{15,18}$/.test(value)) {
                    callback(new Error('营业执照号格式不正确！'));
                } else {
                    callback();
                }
            };
            const ChineseChar = (rule, value, callback) => {
                if (!/^[\u4e00-\u9fa5]{1,50}$/.test(value)) {
                    callback(new Error('名称格式不正确！'));
                } else {
                    callback();
                }
            };

            return {
                daojishi: 3,
                isSubmit: false,
                supplyTypeList: [],
                current: 0,
                noSendCode: false,
                sendVfyTxt: '获取验证码',  // 按钮文字
                formValidate: {
                    userCode: '',
//          verifyCode: '',
                    password: '',
                    confirmPassword: '',
                    phone: ''
                },
                formValidate1: {
                    supplierName: '',  // 公司名称
                    corpRegNo: '',  // 营业执照号
                    corporation: '',  // 公司法人
                    vendorType: '',  // 主要供应类型
                    corpAddress: '',  // 企业地址
                    vendorTax: '',  // 供应商税类
                    phoneNum: '',  // 电话
                    faxNum: ''  // 传真
                },
                ruleValidate: {
                    userCode: [
                        {validator: checkUserCode, trigger: 'blur'}
                    ],
                    /*verifyCode: [
                      {validator: checkVerify, trigger: 'blur'}
                    ],*/
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {validator: validatePassCheck, trigger: 'blur'}
                    ],
                    phone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                ruleValidate1: {
                    supplierName: [
                        {validator: ChineseChar, trigger: 'blur'}
                    ],
                    corpRegNo: [
                        {validator: corpRegNoCheck, trigger: 'blur'}
                    ],
                    corporation: [
                        {validator: ChineseChar, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.current === 0) {
                            var data = {
                                userCode: this.formValidate.userCode
                            };
                            this.ajax.post(api.userUnique(), data, (data) => {
                                if (data.error_code != 200) {
                                    this.$Message.error(data.error_msg);
                                    return;
                                } else {
                                    this.current += 1;
                                }
                            });
                        } else {
                            if (this.current === 1) {
                                this.isSubmit = true;

                                var regUser = this.formValidate;
                                regUser.supplierModel = this.formValidate1;

                                this.ajax.post(api.register(), regUser, (data) => {
                                    this.current = 2;
                                    this.timer = setInterval(() => {
                                        this.daojishi--;
                                        if (this.daojishi === 0) {
                                            clearInterval(this.timer);
                                            this.toLogin();
                                        }
                                    }, 1000);
                                    this.isSubmit = false;
                                }, (data) => {
                                    this.$Message.error(data.error_msg);
                                    this.isSubmit = false;
                                }, (error) => {
                                    alert(error)
                                    this.isSubmit = false;
                                });
                            } else {
                                this.current += 1;
                            }
                        }
                    }
                });
            },
            getSupplyTypeList() {  // 主要供应类型获取列表
                const url = api.getSupplyType();
                this.ajax.get(url, null, (data) => {
                    console.log(data);
                    this.supplyTypeList = data.data;
                });
            },
            sendVfyCode() {
                this.$refs.formValidate.validateField('phone', (valid) => {
                    if (valid === '') {
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
                    }
                });
            },
            toLogin() {
                router.push({path: "/login"});
            }
        }, created() {
            this.getSupplyTypeList();
        }

    }
</script>
<style scoped>
    .wrap {
        background: #f9f9f9;
        overflow: auto;
    }

    .wrap-box {
        width: 1000px;
        margin: 0 auto;
        text-align: left;
    }

    .register-top {
        width: 100%;
        height: 80px;
        padding-top: 27px;
    }

    .register-title {
        height: 40px;
        line-height: 40px;
        text-indent: 24px;
        background: url("../assets/register-bg.png") repeat-x left center;
        color: #fff;
        font-size: 16px;
    }

    .content {
        border: 1px #e8e8e8 solid;
        padding-bottom: 20px;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
    }

    .form-box {
        padding: 40px 50px 40px 200px;
    }

    .step-box {
        margin: 50px 0 0 80px;
        width: 50%;
    }

    .to-login {
        margin-top: 10px;
    }

    .complete {
        overflow: hidden;
        padding-left: 80px;
    }

    .complete span {
        float: left;
        font-size: 24px;
        line-height: 35px;
        color: #55626e;
    }

    .complete .img {
        background: url("../assets/complete.png") no-repeat 50% 50%;
        width: 35px;
        height: 35px;
        margin-right: 10px;
    }

    .jump-page {
        margin-top: 10px;
        padding-left: 125px;
    }

    .footer {
        height: 80px;
        line-height: 80px;
        text-align: center;
        color: #999;
    }
</style>
