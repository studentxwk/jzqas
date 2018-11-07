<template>
    <div class="wrap">
        <div class="head-top">
            <div class="head-log"></div>

            <ul class="menu">
                <li v-for="(me, index) in allMenu" v-if="me.show" @click="rediect(me.route, index)"
                    :class="{active: me.isActive}">
                    {{ me.text }}
                </li>
            </ul>

            <div class="head-right">
                <!--<div class="bell"  v-bind:style="bellStype" @click="openMessage()">
                  <i class="num" v-if="numMes!=0" >{{numMes}}</i>
                </div>-->
                <div class="portrait">
                    <img v-if="headerImgUrl" :src="headerImgUrl" alt="" @click="photo(headerImgUrl);">
                </div>
                <Dropdown class="drop-down">
                    <a href="javascript:void(0)" class="w">
                        {{userInfo.userName}}
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <Dropdown-menu slot="list">
                        <Dropdown-item name="userCenter">
                            <a @click.prevent="clickUser(userCenter)"
                               class="b down">个人中心</a>
                        </Dropdown-item>
                        <Dropdown-item name="loginOut"><a @click.prevent="clickUser('loginout')" class="b down">退出</a>
                        </Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </div>

        </div>

        <div class="view-container">
            <router-view></router-view>
        </div>
        <Modal v-model="photoModel" @on-ok="ok(imgUrl)" title="更换头像">

            <template>
                <div class="demo-upload-list" v-for="item in uploadList">
                    <template v-if="item.url != null">
                        <img :src="item.url">
                        <!--   <div class="demo-upload-list-cover">
                             <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                             <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                           </div>-->
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <Upload :headers="uploadHeader"
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        type="drag"
                        :action="photoUploadUrl"
                        style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="camera" size="20"></Icon>
                    </div>
                </Upload>
                <div title="查看图片" v-model="visible">
                    <img :src=getImgUrl v-if="visible" style="width: 100%">
                </div>
            </template>
        </Modal>
    </div>

</template>
<script>
    import router from '../router';
    import api from '../utils/api';
    import bellActiveImage from '../assets/bell_active.png';
    import bellImage from '../assets/bell.png';

    export default {
        name: 'Home',
        data() {
            return {
                bellActiveImageUrl: bellActiveImage,
                bellImageUrl: bellImage,
                //[jwtToken]
                headerImgUrl: '',
                uploadHeader: {},
                photoUploadUrl: '',
                photoModel: false,
                defaultList: [],
                imgName: '',
                bellStype: {},
                visible: true,
                uploadList: [],
                allMenu: [
                    {text: '甲方管理', route: 'ownerControl', isActive: false, show: false, only: '1'},
                    {text: '供应商管理', route: 'supplierControl', isActive: false, show: false, only: '2'},
                    {text: '合约管理', route: '', isActive: false, show: false, only: '1,2'},
                    {text: '项目授权', route: 'authorize', isActive: false, show: false, only: '2'},
                    /*{text: '结算', route: 'SettleManage', isActive: false, show: false, only: ''},*/
                    {text: '开票管理', route: 'OpenManage', isActive: false, show: false, only: '1'},
                    /*{text: '收款', route: 'ReceiveManage', isActive: false, show: false, only: ''},
                    {text: '图表', route: 'ChartManage', isActive: false, show: false, only: ''}*/
                    {text: '系统管理', route: 'SystemManage', isActive: false, show: false, only: '0'}
                ],
                imgUrl: '',
                getImgUrl: '',
                numMes: 0
            }
        },
        computed: {
            userInfo: function () {
                if (sessionStorage.getItem('userInfo')) {
                    var user = JSON.parse(sessionStorage.getItem('userInfo'));
                    var headImg = user.headerImg;
                    if (headImg != null && headImg != "") {
                        this.headerImgUrl = api.rootUrl() + user.headerImg;
                    } else {
                        this.headerImgUrl = "/static/img/head.png";
                    }

                    return user;
                } else {
                    return {userName: '未登录', userCode: '', userType: ''}
                }
            },
            userCenter() {
                switch (this.userInfo.userType) {
                    case 0:
                        return 'corpCenter';
                    case 1:
                        return 'userCenter';
                    case 2:
                        return 'corpCenter';
                }
            },
        },
        methods: {
            initPhotoConfig() {
                const phoUrl = api.photoUrl();
                this.photoUploadUrl = phoUrl;
                this.uploadHeader = {'jwtToken': sessionStorage.getItem('token') || ''};
            },
            photo(url) {
                this.photoModel = true;
                this.handleView(url);
                this.uploadList = [
                    {
                        'name': 'ss',
                        'url': url
                    }
                ];  //上面展示的小头像
                this.initPhotoConfig();
            },
            handleView(url) {
                this.visible = true;
                this.getImgUrl = url;
            },
            handleRemove(file) {
                // 从 upload 实例删除数据
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                var newImgUrl = api.rootUrl() + res.data;
                this.uploadList = [
                    {
                        'name': file.name,
                        'url': newImgUrl
                    }
                ];
                this.imgUrl = res.data;
                this.handleView(newImgUrl);
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload() {
                /*const check = this.uploadList.length < 5;
                if (!check) {
                  this.$Notice.warning({
                    title: '最多只能上传 5 张图片。'
                  });
                }*/
                return true;
            },
            ok(imgUrl) {
                const url = api.saveHead();
                var pathData = {
                    path: imgUrl
                }
                this.ajax.get(url, pathData, (data) => {
                    this.headerImgUrl = api.rootUrl() + imgUrl;
                });
            },
            // 消息提醒
            getMessage() {
                const url = api.getNotice();
                this.ajax.get(url, null, (data) => {
                    this.numMes = list.length;
                    var list = data.data;
                    for (var a = 0; a < list.length; a++) {
                        this.$Notice.open({
                            title: list[a].title,
                            desc: false ?
                                contact : list[a].content
                        });
                    }
                });

            },
            // 跳转消息展示页面
            openMessage() {
                //设置消息显示图标
                this.bellStype.background = 'url("' + this.bellActiveImageUrl + '") no-repeat 50% 50%';
                // 清空所选项
                this.allMenu.map((item, i) => {
                    item.isActive = false;
                });
                router.push({path: "/Message"});
            },
            clickUser(flag) {
                if (flag == 'loginout') {
                    //删除token
                    sessionStorage.removeItem('token');
                    //删除用户信息
                    sessionStorage.removeItem('userInfo');
                    router.push({path: "/login"});
                } else {
                    this.allMenu.map((item, i) => {
                        item.isActive = false;
                    });
                    router.push({path: "/" + flag});
                }
            },
            rediect(flag, index) {
                if (flag.length) {
                    router.push({path: '/' + flag});
                    //设置消息显示图标
                    if (this.bellStype.background == 'url("' + this.bellActiveImageUrl + '") no-repeat 50% 50%') {
                        this.bellStype.background = 'url("' + this.bellImageUrl + '") no-repeat 50% 50%';
                    }
                    this.allMenu.map((item, i) => {
                        if (i === index) {
                            item.isActive = true;
                        } else {
                            item.isActive = false;
                        }
                    });
                }

            }
        },
        created() {
            this.allMenu.map((item) => {
                if (item.text == '合约管理') {
                    switch (this.userInfo.userType) {
                        case 1:
                            // 供应商登录
                            item.route = 'ContractManage';
                            break;
                        case 2:
                            // 甲方登录
                            item.route = 'ContractMaker';
                            break;
                        case 0:
                            // 系统管理员
                            item.route = 'SystemManage';
                            break;
                    }
                }
                ;

                (item.only.indexOf(this.userInfo.userType) >= 0 || item.only == '') ? item.show = true : item.show = false;

                if (item.route == this.$route.path.slice(1)) {
                    item.isActive = true;
                }
            });

            this.getMessage();

        }
    }

</script>
<style>
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>