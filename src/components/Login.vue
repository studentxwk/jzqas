<template>
  <div class="login">
      <div class="slider">
        <Carousel autoplay loop="true" dots="none" :height="'100%'" :autoplay-speed="5000">
          <CarouselItem v-for="car in carousels" :key="car.bgImg">
            <div :class="[{carousel: true}, car.bgImg]"></div>
          </CarouselItem>
        </Carousel>
        <div class="title">
          <img src="../assets/scp-logo.png" alt="">
        </div>
        <div class="login-box" @keyup.13="handleSubmit('formInline')">
          <h3 class="login-title">用户登录</h3>
          <Form ref="formInline" :model="formInline" :rules="ruleInline" class="form-box">
            <Form-item prop="user">
              <Input type="text" v-model="formInline.user" placeholder="请输入用户名" class="login-input" size="large">
              <i class="iconfont icon-user" slot="prepend"/>
              </Input>
            </Form-item>
            <Form-item prop="password">
              <Input type="password" v-model="formInline.password" placeholder="请输入密码"  class="login-input" size="large">
              <i class="iconfont icon-Password" slot="prepend"/>
              </Input>
            </Form-item>
            <Row class="operator">
              <Col span="12">
              <Checkbox v-model="single">记住密码</Checkbox>
              </Col>
              <Col span="12" class="passwordReset">
              <a @click.prevent="passwordReset">忘记密码?</a>
              </Col>
            </Row>
            <Form-item>
              <Button :loading="loginWait" type="primary" @click="handleSubmit('formInline')" long size="large">
                <span v-if="!loginWait">登 录</span>
                <span v-else>登 录 中 ...</span>
              </Button>
            </Form-item>
            <Row class="register">
              <Icon type="ios-information-outline" style="font-size: 16px;vertical-align: middle"></Icon>
              供应商用户
              <a @click.prevent="register" style="text-decoration: underline;">注册账号</a>
            </Row>
          </Form>
        </div>
      </div>
      <div class="footer">
        <ul class="links">
          <li v-for="link in fLinks">
            <a :href="link.href" v-text="link.text" target="_blank"></a>
          </li>
        </ul>
        <p>用友建筑云服务有限公司©2017京ICP证100714号京公网安备11010802021935号</p>
        <p>公司地址：北京市海淀区北清路68号用友软件园19号楼A座二层 邮编：100094 客服热线：400-6600-588</p>
      </div>
  </div>
</template>
<script>
  import router from '../router';
  import api from '../utils/api';

  export default {
    name: 'Login',
    data () {
      return {
        slideNum: 0,
        carousels: [
            {bgImg: 'carousel-1'},
            {bgImg: 'carousel-2'},
            {bgImg: 'carousel-3'}
        ],
        single: true,
        loginWait: false,
        fLinks: [
            {text: '用友建筑官网', href: 'https://www.yonyouccs.com/icop-website/'},
            {text: '用友软件官网', href: 'http://www.yonyou.com/index.html'},
            {text: '用友云', href: 'https://www.yonyoucloud.com/'},
            {text: 'NC产品主页介绍', href: 'http://nc.yonyou.com/'}
        ],
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      setCookie(name, value, iDay) {
          var oDate = new Date();
          oDate.setDate(oDate.getDate() + iDay);

          document.cookie = name+'='+value+';expires='+oDate;
      },
      getCookie(name) {
          var arr = document.cookie.split('; ');

          for(let i = 0; i < arr.length; i++) {
              var arr2 = arr[i].split('=');

              if(arr2[0] == name) {
                  return arr2[1];
              }
          }

          return '';	//没找到
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loginWait = true;
            var userName = this.formInline.user,
                pwd = this.formInline.password,
                user = {};

            /*const crypt = new JSEncrypt();
            // crypt.setKey('');
            var encrypted = crypt.encrypt(pwd);
            console.log(encrypted)*/

            user.userCode = userName;
            user.password = pwd;

            this.ajax.post(api.login(), user, (data) => {
              this.$Message.success('登录成功!');
              this.loginWait = false;
                //存储token
              sessionStorage.setItem('token', data.data.token);
              sessionStorage.setItem('userInfo', JSON.stringify(data.data.user));

              // 记住密码
              if(this.single) {
                  this.setCookie('user', this.formInline.user, 7);
                  this.setCookie('password', this.formInline.password, 3);
              } else {
                  // 删除
                  this.setCookie('user', this.formInline.user, -1);
                  this.setCookie('password', this.formInline.password, -1);
              }

              switch(data.data.user.userType) {
                case 0:
                  router.push({path: "/SystemManage"});
                  break;
                case 1:
                  router.push({path: "/ownerControl"});
                  break;
                case 2:
                  router.push({path: "/supplierControl"});
                  break;
                default:
                  router.push({path: "/home"});
              }

            }, (data) => {
                this.$Message.error(data.error_msg);
                this.loginWait = false;
            }, (error) => {
                alert(error)
                this.loginWait = false;
            });

          }
        })
      },
      register(){
        router.push({path: "/register"});
      },
      passwordReset(){
        router.push({path: "/resetPassword"});
      }
    },
    created() {
        this.formInline.user = this.getCookie('user');
        this.formInline.password = this.getCookie('password');
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../assets/base.less";

  .loop(@counter) when (@counter > 0) {
      .carousel-@{counter} {
          background-image: url("../assets/signin-@{counter}.jpg");
      }
      .loop((@counter - 1));
  }

  .ipt-pre {
    width: 30px !important;
    display: block;
  }

  .login {
    height: 100%;
    min-width: 1200px;
    position: relative;

    .slider {
      .position(absolute, 0, 0, 110px, 0);

      .carousel {
        height: 100%;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: cover;
      }
      .loop(3);
    }

    .title{
      .position(absolute, 30px, @left: 10%);
      z-index: 100;
    }

    .login-title {
      height:52px;
      line-height:52px;
      color: @deepBlue;
      text-align: left;
      text-indent: 20px;
      font-size: 18px;
      background: url("../assets/login-title.png") repeat-x left center;
      border-bottom: 1px solid #c2d5ec;
    }

    .form-box{
      padding: 30px 50px 0;

      .register{
        text-align: left;
      }
      .passwordReset{
        text-align: left;
      }
    }

    .footer{
      .position(absolute, auto, 0, 0, 0);
      color: #666;
      text-align: center;
      line-height: 20px;
      padding: 20px 0;
      background: @white;

      .links {
        li {
          display: inline-block;
          padding: 0 20px;
          position: relative;

          &::after{
            content: '';
            width: 2px;
            height: 14px;
            .position(absolute, 3px, 0, auto, auto);
            background-color: #666;
          }
          &:last-child::after {
            display: none;
          }
          a {
            color: #666;
          }
          a:hover {
            text-decoration: underline;
          }
        }
      }
      p {
        margin-top: 5px;
      }
    }
  }

  .login-box {
    background: @white;
    .position(absolute, 50%, 10%);
    margin-top:-195px;
    width: 390px;
    height: 390px;
    border-radius: 4px;
    overflow: hidden;
    z-index: 999;
  }

  .iconfont {
    color: #C2CAD1;
  }

  .operator {
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .operator div.ivu-col:nth-child(1) {
    text-align: left;
  }

  .operator div.ivu-col:nth-child(2) {
    text-align: right;
  }
</style>
