<template>
  <div class="wrap">
    <div class="wrap-box">
      <div class="register-top">
        <img src="../assets/deep-logo.png" alt="">
      </div>
      <div class="content">
        <div class="register-title">
          忘记密码
        </div>
        <div class="form-box">
          <Steps :current="current">
            <Step title="第一步" content="验证用户名"></Step>
            <Step title="第二步" content="修改密码"></Step>
            <Step title="第三步" content="完成"></Step>
          </Steps>
          <div class="step-box">
            <ul>
              <li v-if="current === 0">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                  <Form-item label="用户名" prop="userCode">
                    <Input v-model="formValidate.userCode"></Input>
                    <span style="color: red;" v-if="checkUserCode">请使用注册时手机号接收验证码</span>
                  </Form-item>
                  <Form-item label="验证码" prop="verifyCode">
                    <Input v-model="formValidate.verifyCode" class="getVerifyCode">
                      <Button slot="append" :disabled="noSendCode" :loading="noSendCode" @click="sendVfyCode">{{ sendVfyTxt }}</Button>
                    </Input>
                   <span style="color: red;">请使用注册时手机号接收验证码</span>
                  </Form-item>
                <Form-item>
                    <Button type="primary" long @click="handleSubmit('formValidate')">下一步</Button>
                </Form-item>
                </Form>
              </li>
              <li v-if="current === 1">
                <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="90">
                    <Form-item label="设置密码" prop="password">
                    <Input v-model="formValidate1.password" type="password"></Input>
                  </Form-item>
                  <Form-item label="确认密码" prop="confirmPassword">
                    <Input v-model="formValidate1.confirmPassword" type="password"></Input>
                  </Form-item>
                  <Form-item>
                    <Button type="primary" long @click="handleSubmit('formValidate1')">下一步</Button>
                  </Form-item>
                </Form>
              </li>
              <li v-if="current === 2">
                <div class="complete">
                  <span class="img"></span>
                  <span>恭喜您，密码修改完成！</span>
                </div>
                <p class="jump-page"><span id="daojishi" v-html="daojishi">{{daojishi}}</span>秒后自动跳转至首页 <a @click.prevent="login">立即跳转</a></p>
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
    data () {
      const checkNull = (rule, value, callback) => {
        if (/^[\s]{0,}$/.test(value)) {
          callback(new Error('不能为空！'));
        } else {
          callback();
        }
      };

      const checkPhone = (rule, value, callback) => {
        if (/^[\s]{0,}$/.test(value)) {
          callback(new Error('不能为空！'));
        } else if (!/^(13|15|17|18)\d{9}$/.test(value)) {
          callback(new Error('手机号码格式不正确！'));
        } else {
          callback();
        }
      };

      const validatePass = (rule, value, callback) => {
          if (/^[\s]{0,}$/.test(value)) {
              callback(new Error('不能为空！'));
          } else {
              if (this.formValidate.confirmPassword !== '') {
                  // 对第二个密码框单独验证
                  this.$refs.formValidate.validateField('confirmPassword');
              }
              callback();
          }
      };

      const validatePassCheck = (rule, value, callback) => {
          if (/^[\s]{0,}$/.test(value)) {
              callback(new Error('不能为空！'));
          } else if (value !== this.formValidate.password) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };

      return {
          checkUserCode: false,
          daojishi: 3,
          supplyTypeList:[],
        current: 0,
        noSendCode: false,
        sendVfyTxt: '获取验证码',  // 按钮文字
        formValidate: {
          userCode: '',
          verifyCode: '',
          phone: ''
        },
        formValidate1: {
            password: '',
            confirmPassword: ''
        },
        ruleValidate: {
          userCode: [
            {validator: checkNull, trigger: 'blur'}
          ],
          verifyCode: [
            {validator: checkNull, trigger: 'blur'}
          ],
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
                { required: true, message: '不能为空', trigger: 'blur' }
            ],
            corpRegNo: [
                { required: true, message: '不能为空', trigger: 'blur' }
            ],
            corporation: [
                { required: true, message: '不能为空', trigger: 'blur' }
            ]
        }
      }
    },
    methods: {
    login(){
        router.push({path: "/login"});
    },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
              //检查验证码是否正确
              if((this.current+1) === 1){
                  const url = api.validCode();
                  var openData = {
                      phone:this.phone,
                      checkcode:this.formValidate.verifyCode
                  };
                  this.ajax.post(url,openData,(data) =>{
                      if (data.error_code == 200) {
                          this.current += 1;
                     }
                  });

              }
              if((this.current+1) === 2) {
                  var openData = {
                      userCode:this.formValidate.userCode,
                      newpassword:this.formValidate1.password,
                      confirmPassword:this.formValidate1.confirmPassword
                  }
                  this.ajax.post(api.updatePassword(), openData, (data) => {
                      if(200 == data.error_code){
                          this.current += 1;
                          var dao = 3;
                          this.daojishi = dao + ' s';

                          this.timer = setInterval(() => {
                              dao--;
                             this.daojishi = dao + ' s';
                              if(dao === 0) {
                                  clearInterval(this.timer);
                                  this.login();
                              }
                          }, 1000);
                      }else{
                        this.$Message.error(data.error_msg);
                      }

                  });

              }
          } else {
            this.$Message.error('表单验证失败!');
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
          this.$refs.formValidate.validateField('userCode', (valid) => {
              if(valid === '') {
                  //查询用户名是否存在，若存在，获取对应手机号发送验证码，不存在返回页面提示信息
                  const url = api.validName();
                  var openData = {
                      userCode:this.formValidate.userCode
                  };
                  this.ajax.post(url, openData, (data) => {
                      if (data.error_code == 200) {
                               this.phone=data.data;
                        }else{
                              this.checkUserCode = true;
                              //this.$Message.info(data.error_msg);
                         }
                  });
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
          });
      },
    },
      created() {
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

  .form-box{
    padding: 40px 50px 40px 200px;
  }
  .step-box{
    margin: 50px 0 0 80px;
    width:50%;
  }
  .to-login{
    margin-top: 10px;
  }
  .complete{
    overflow: hidden;
    padding-left: 80px;
  }
  .complete span{
    float: left;
    font-size: 24px;
    line-height: 35px;
    color: #55626e;
  }
  .complete .img{
    background: url("../assets/complete.png") no-repeat 50% 50%;
    width: 35px;
    height: 35px;
    margin-right: 10px;
  }
  .jump-page{
    margin-top:10px;
    padding-left: 125px;
  }
  .footer{
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #999;
  }
</style>
