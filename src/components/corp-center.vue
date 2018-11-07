<template>
    <div class="layout">
        <div class="layout-content">
            <Row>
                <i-col span="5">
                    <Menu active-name="tab_1" @on-select="changeTab">
                        <Menu-item name="tab_1">
                            <Icon type="compose"></Icon>
                            账户信息
                        </Menu-item>
                        <Menu-item name="tab_2">
                            <Icon type="medkit"></Icon>
                            账户安全
                        </Menu-item>
                    </Menu>
                </i-col>
                <i-col span="19">
                    <div class="layout-content-main">
                        <!-- 账户信息 -->
                        <div v-show="accountTab=='tab_1'">
                            <Card :bordered="false" dis-hover>
                                <p slot="title" class="first-title">
                                    <Icon type="ios-keypad"></Icon>
                                    NC信息
                                </p>
                                <Form :label-width="90">
                                        <Form-item label="NC系统名称" :model="firstparty">
                                            <Input  placeholder="请输入" style="width: 300px" v-model="firstparty.corpName"></Input>
                                        </Form-item>
                                        <Form-item label="NC系统URL">
                                            <Input  placeholder="请输入" style="width: 300px" v-model="firstparty.url"></Input>
                                        </Form-item>
                                        <Form-item label="秘钥">
                                           <Input  placeholder="请输入" style="width: 300px" v-model="firstparty.secretKey"></Input>
                                       </Form-item>
                                        <Button type="primary" size="large" class="confirm-btn" @click="handleSubmit()">
                                            保 存
                                        </Button>
                                </Form>
                            </Card>
                        </div>
                        <!-- 账户安全 -->
                        <div v-show="accountTab=='tab_2'">
                            <Card :bordered="false" dis-hover>
                                <p slot="title" class="first-title">
                                    <Icon type="ios-keypad"></Icon>
                                    基础信息
                                </p>
                                <!--<ul class="info-list">
                                    <li>
                                        <span>会员名：</span>
                                    </li>
                                    <li>
                                        <span>手机号：</span>
                                    </li>
                                    <li>
                                        <span>邮箱地址：</span>
                                    </li>
                                </ul>-->
                                <Form :label-width="90">
                                    <Form-item label="登录账号" :model="user">
                                        <Input   style="width: 300px" v-model="user.userCode" readonly></Input>
                                    </Form-item>
                                    <Form-item label="登录名称">
                                        <Input  style="width: 300px" v-model="user.userName" readonly></Input>
                                    </Form-item>
                                    <Form-item label="手机号">
                                        <Input style="width: 300px" v-model="user.phone" readonly></Input>
                                    </Form-item>
                                </Form>
                            </Card>
                            <!--<Card :bordered="false" dis-hover>
                                <p slot="title" class="first-title">
                                    <Icon type="ios-keypad"></Icon>
                                    安全服务
                                </p>
                                <ul class="info-list">
                                    <li>
                                        <span>登录密码：</span>
                                        <span class="describe">修改更高级别的密码能提高账号的安全性</span>
                                        <span class="button" @click="changePwd = true">修改</span>
                                        <Modal
                                            v-model="changePwd"
                                            title="修改密码"
                                            width="360"
                                            :closable="false"
                                            :mask-closable="false"
                                        >
                                            <div class="relative">
                                                <Input v-model="oldPassword" :class="[{error_border:testObj.oldPassword}, {mtb12: true}]" @on-blur="checkPwd('oldPassword')" type="password" placeholder="原密码"></Input>
                                                <p class="ivu-form-item-error-tip top42" v-if="testObj.oldPassword">{{ errorTip }}</p>
                                            </div>
                                            <div class="relative">
                                                <Input v-model="newPassword" :class="[{error_border:testObj.newPassword}, {mtb12: true}]" @on-blur="checkPwd('newPassword')" type="password" placeholder="新密码"></Input>
                                                <p class="ivu-form-item-error-tip top42" v-if="testObj.newPassword">{{ errorTip }}</p>
                                            </div>
                                            <div class="relative">
                                                <Input v-model="againPassword" :class="[{error_border:testObj.againPassword}, {mtb12: true}]" @on-blur="checkAgainPwd('againPassword')" type="password" placeholder="再输一遍"></Input>
                                                <p class="ivu-form-item-error-tip top42" v-if="testObj.againPassword">{{ errorTip }}</p>
                                            </div>
                                            <div slot="footer">
                                                <Button type="text" @click="pwdCancel" size="large">取消</Button>
                                                <Button type="primary" @click="pwdOk" size="large">确定</Button>
                                            </div>
                                        </Modal>
                                    </li>
                                    <li>
                                        <span>绑定手机：</span>
                                        <span class="describe">修改或关闭已经绑定的手机号</span>
                                        <span class="button" @click="bindPhone = true">修改</span>
                                        <span class="button">关闭手机登录</span>
                                        <Modal
                                            v-model="bindPhone"
                                            title="绑定手机"
                                            width="360"
                                            :closable="false"
                                            :mask-closable="false"
                                        >
                                            <div class="relative">
                                                <Input v-model="bindPhoneNum" :class="[{error_border:checkPhone}, {mtb12: true}]" @on-blur="checkPhoneNum('bindPhoneNum')" placeholder="手机号码"></Input>
                                                <p class="ivu-form-item-error-tip top42" v-if="checkPhone">{{ errorPhTip }}</p>
                                            </div>
                                            <div class="relative">
                                                <Input v-model="verifyCode" :class="[{error_border:checkVcode}, {mtb12: true}]" @on-blur="checkVfyCode('verifyCode')" placeholder="验证码" style="width:50%;margin-right:30px;"></Input>
                                                <Button type="info" :disabled="noSendCode" :loading="noSendCode" @click="sendVfyCode">{{ sendVfyTxt }}</Button>
                                                <p class="ivu-form-item-error-tip top42" v-if="checkVcode">{{ errorVcTip }}</p>
                                            </div>
                                            <div slot="footer">
                                                <Button type="text" @click="phoneCancel" size="large">取消</Button>
                                                <Button type="primary" @click="phoneOk" size="large">确定</Button>
                                            </div>
                                        </Modal>
                                    </li>
                                </ul>
                            </Card>-->
                        </div>
                    </div>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script>
import api from '../utils/api';

export default {
    data () {
      return {
        firstparty:{
              corpName:'',
              url:'',
              secretKey:''
          },
          user:{
              userCode:'',
              userName:'',
              phone:''
          },
        accountTab: 'tab_1',  // 默认显示账户信息标签
        changePwd: false,  // 修改密码对话框是否显示
        oldPassword: '',  // 现用密码
        newPassword: '',  // 新密码
        againPassword: '',  // 重复新密码
        bindPhone: false,  // 绑定手机对话框是否显示
        bindPhoneNum: '',  // 绑定手机号码
        verifyCode: '',  // 手机验证码
        sendVfyTxt: '获取验证码',  // 按钮文字
        errorPhTip: '',
        errorVcTip: '不能为空！',
        errorTip: '不能为空！',
        testObj: {
            'oldPassword': false,
            'newPassword': false,
            'againPassword': false
        },
        checkPhone: false,
        checkVcode: false,
        noSendCode: false
      }
    },
    methods: {
        changeTab(name) {
            this.accountTab = name;
        },
        checkPwd(name) {
            if( /^[\s]{0,}$/.test(this[name]) ) {
                this.testObj[name] = true;
            } else {
                this.testObj[name] = false;
            }
        },
        checkAgainPwd(name) {
            this.checkPwd(name);
            if(!this.testObj[name]) {
                if(this.againPassword !== this.newPassword) {
                    this.testObj[name] = true;
                    this.errorTip = '两次输入不一致！';
                } else {
                    this.testObj[name] = false;
                    this.errorTip = '不能为空！';
                }
            }
        },
        pwdOk() {
            var hasNull = 0;

            for(let key in this.testObj){
                this.checkPwd(key);

                if(this.testObj[key]){
                    // 记录校验为空的总数
                    hasNull += 1;
                }
            }

            if(hasNull == 0) {
                this.checkAgainPwd('againPassword');
                if(!this.testObj['againPassword']) {
                    this.pwdCancel();
                    this.$Message.info('修改成功');
                }
            }
        },
        pwdCancel() {
            this.changePwd = false;
            for(let key in this.testObj){
                this[key] = '';
                this.testObj[key] = false;
            }
        },
        checkPhoneNum(name) {
            if( /^[\s]{0,}$/.test(this[name]) ) {
                this.checkPhone = true;
                this.errorPhTip = '不能为空！';
            }
            else if( !( /^(13|15|17|18)\d{9}$/.test(this[name]) ) ) {
                this.checkPhone = true;
                this.errorPhTip = '手机号码格式不正确！';
            }
            else {
                this.checkPhone = false;
                this.errorPhTip = '';
            }
        },
        checkVfyCode(name) {
            if( /^[\s]{0,}$/.test(this[name]) ) {
                this.checkVcode = true;
            } else {
                this.checkVcode = false;
            }
        },
        sendVfyCode() {
            this.checkPhoneNum('bindPhoneNum');

            if(!this.checkPhone) {
                this.noSendCode = true;
                var num = 60;
                this.sendVfyTxt = '等待 ' + num + ' s';

                this.timer = setInterval( () => {
                    num--;
                    this.sendVfyTxt = '等待 ' + num + ' s';
                    if(num === 0) {
                        clearInterval(this.timer);
                        this.sendVfyTxt = '获取验证码';
                        this.noSendCode = false;
                    }
                }, 1000);
            }
        },
        phoneOk() {
            this.checkPhoneNum('bindPhoneNum');
            this.checkVfyCode('verifyCode');
            if(!this.checkPhone && !this.checkVcode) {
                this.phoneCancel();
                this.$Message.info('手机号绑定成功');
            }
        },
        phoneCancel() {
            // 关闭弹窗
            this.bindPhone = false;
            // 清空值
            this.bindPhoneNum = '';
            this.verifyCode = '';
            // 重置样式
            this.checkPhone = false;
            this.errorPhTip = '';
            this.checkVcode = false;
            clearInterval(this.timer);
            this.noSendCode = false;
            this.sendVfyTxt = '获取验证码';
        },
        getUserInfo() {
            const url = api.userInfo();

            this.ajax.get (url, {}, (data) => {
                this.user  = data.data;
                for(let key in data.data.firstPartyModel) {
                    if(key !== 'dr' && key !== 'ts') {
                        this.firstparty[key] = data.data.firstPartyModel[key];
                    }
                }
            })
        },

        handleSubmit () {
            //this.$refs[name].validate((valid) => {
                //if (valid) {
                    this.saveUserInfo();
                //}
            //});
        },

        saveUserInfo() {
            const url = api.saveUserBasic();
            var reqData = {firstPartyModel:this.firstparty};
            this.ajax.post (url, reqData, (data) => {
                if (data.error_code == 200) {
                this.$Message.success('保存成功!');
            }else{
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