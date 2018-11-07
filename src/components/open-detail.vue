<template>
    <div class="openEntry">
        <div class="openListOpt">
            <div slot="title" class="first-title">
                <Button @click="cancel">返回</Button>
            </div>
        </div>
        <div class="openHeadModules">
            <Form class="openHeadData" ref="openHeadData" :model="openHeadData"  :label-width="120">
                <div name="headbasic"  style="padding:20px;padding: 0px;">
                    <table>
                        <tr>
                            <td>
                                <FormItem label="NC系统">
                                    <Input v-model="openHeadData.corpName" readonly />
                                </FormItem>
                            </td>
                            <td >
                                <FormItem label="项目">
                                    <Input v-model="openHeadData.projectName" readonly />
                                </FormItem>
                            </td>
                            <td>
                                <FormItem label="合同">
                                    <Input v-model="openHeadData.subcontractName" readonly />
                                </FormItem>
                            </td>
                        </tr>
                    </table>
                    <ul class="y-title-box">
                        <li>
                            <FormItem label="发票代码：" class="list-inputs">
                                <Input size="small" v-model="openHeadData.vinvcode" readonly/>
                            </FormItem>
                            <FormItem label="发票号码：" class="list-inputs">
                                <Input size="small" v-model="openHeadData.vinvno" readonly/>
                            </FormItem>
                            <FormItem label="开票日期：" class="list-inputs">
                                <Input size="small" v-model="openHeadData.dopendate" readonly/>
                            </FormItem>
                            <FormItem label="校 验 码：" class="list-inputs">
                                <Input size="small" v-model="openHeadData.checkCode" readonly/>
                            </FormItem>
                        </li>
                        <li class="y-center">
                            发 票
                            <hr style="border-top:3px double #ff5c14;"/>
                        </li>
                        <li></li>
                    </ul>
                    <div class="table">
                        <div class="first">
                            <div class="nav">
                                购<br>
                                买<br>
                                方<br>
                            </div>
                            <div class="section">
                                <FormItem label="名 称：" class="list-inputs">
                                    <Input class="input" size="small" v-model="openHeadData.vcstmname" readonly/>
                                </FormItem>
                                <FormItem label="纳税人识别号：" class="list-inputs">
                                    <Input class="input" size="small" v-model="openHeadData.vcstmtaxnumber" readonly/>
                                </FormItem>
                                <FormItem label="地 址、电 话：" class="list-inputs">
                                    <Input class="input" size="small" v-model="openHeadData.vcstmaddresphone" readonly/>
                                </FormItem>
                                <FormItem label="开户行及账户：" class="list-inputs">
                                    <Input class="input" size="small" v-model="openHeadData.vcstmbankaccount" readonly/>
                                </FormItem>
                            </div>
                            <div class="nav">
                                密<br>
                                码<br>
                                区<br>
                            </div>
                            <div class="section1">
                                <FormItem class="spel-textarea">
                                    <Input v-model="openHeadData.vsecret" type="textarea" class="y-area-height" readonly/>
                                </FormItem>
                            </div>
                        </div>
                        <div class="secend">
                                <Tab-pane  v-for="module in openBodyModules" :key="module.id" :label="module.name" :name="module.id" style="margin-bottom: 5px;">
                                    <table>
                                        <tr>
                                            <td v-for="item in module.items"  >{{item.name}}</td>
                                        </tr>
                                        <tr v-for="(moduleData,index) in openBodyModulesData[module.id]">

                                            <td v-for="(md,key) in moduleData.tdData" @dblclick="edit(module.id,key,index)">
                                                <Input v-model="md.value"  :placeholder="md.name" readonly></Input>
                                            </td>
                                        </tr>
                                    </table>
                                </Tab-pane>
                        </div>
                        <div class="third">
                            <div  class="thirdCol" style="width: 30%;padding-top:8px;">
                                价税合计（大写）<br>
                            </div>
                            <div class="thirdCol2" style="width: 70%;padding:8px;overflow: hidden;">
                                <FormItem class="spel-textarea" style="float:left;width: 50%">
                                    <Input v-model="openHeadData.ninvtaxmnyCap" readonly/>
                                </FormItem>
                                <FormItem label="（小写）" style="float:left;width: 50%;margin:0;overflow: hidden;">
                                    <Input v-model="openHeadData.ninvtaxmny" readonly/>
                                </FormItem>
                            </div>
                        </div>
                        <div class="four">
                            <div class="nav">
                                销<br>
                                售<br>
                                方<br>
                            </div>
                            <div class="section">
                                <FormItem label="名 称：" class="list-inputs">
                                    <Input size="small" v-model="openHeadData.vsupname" readonly/>
                                </FormItem>
                                <FormItem label="纳税人识别号：" class="list-inputs">
                                    <Input size="small" v-model="openHeadData.vsuptaxnumber" readonly/>
                                </FormItem>
                                <FormItem label="地 址、电 话：" class="list-inputs">
                                    <Input size="small" v-model="openHeadData.vsupaddresphone" readonly/>
                                </FormItem>
                                <FormItem label="开户行及账户：" class="list-inputs">
                                    <Input size="small" v-model="openHeadData.vsupbankaccount" readonly/>
                                </FormItem>
                            </div>
                            <div class="nav">
                                备<br>
                                <br>
                                注<br>
                            </div>
                            <div class="section1">
                                <FormItem class="spel-textarea">
                                    <Input v-model="openHeadData.vmemo" type="textarea" class="y-area-height" readonly />
                                </FormItem>
                            </div>
                        </div>
                    </div>
                    <div style="clear:both; overflow: auto; padding-top: 12px;">
                        <FormItem label="收款人：" class="bottom-list">
                            <Input v-model="openHeadData.vreceiver" readonly/>
                        </FormItem>
                        <FormItem label="复 核：" class="bottom-list">
                            <Input v-model="openHeadData.vreviewer" readonly/>
                        </FormItem>
                        <FormItem label="开票人：" class="bottom-list">
                            <Input v-model="openHeadData.bisopen" readonly/>
                        </FormItem>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>
<script>
    import api from '../utils/api';
    import router from '../router';
    export default {
        data(){
            return {
                openBodyModules: [{
                    id: '123',
                    items: [{
                        name: '货物或应税劳务、服务名称',
                        id: 'vopencontent',
                        type: 'input'
                    }, {
                        name: '规格型号',
                        id: 'vinvspec',
                        type: 'input'
                    },  {
                        name: '单位',
                        id: 'vinvunit',
                        type: 'input'
                    },{
                        name: '数量',
                        id: 'nnum',
                        type: 'input'
                    }, {
                        name: '单价',
                        id: 'nprice',
                        type: 'input'
                    },{
                        name: '金额',
                        id: 'norigopenmny',
                        type: 'input'
                    },{
                        name: '税率',
                        id: 'ntaxrate',
                        type: 'input'
                    },{
                        name: '税额',
                        id: 'norigtaxmny',
                        type: 'input'
                    }]
                },
                ],
                openBodyModulesData: {
                    '123': [{
                        tdData: {
                            'vopencontent': {value: '', type: 'string', name: '货物或应税劳务、服务名称', isEdit: false},
                            'vinvspec': {value: '', type: 'string', name: '规格型号', isEdit: false},
                            'vinvunit': {value: '', type: 'string', name: '单位', isEdit: false},
                            'nnum': {value: '', type: 'string', name: '数量', isEdit: false},
                            'nprice': {value: '', type: 'string', name: '单价', isEdit: false},
                            'norigopenmny': {value: '', type: 'string', name: '金额', isEdit: false},
                            'ntaxrate': {value: '', type: 'string', name: '税率', isEdit: false},
                            'norigtaxmny': {value: '', type: 'string', name: '税额', isEdit: false},
                        },
                        isChecked: false
                    }]},
                value1: '1',
                value2: '2',
                hideData:{},
                currentTabName: '123',
                isEdit: false,
                firstpartyId: '',
                ncmodel: '',//ncmode
                reqData: {"rowData":[]},
                hideData:{},
                openData:[],
                disabled:false,
            openHeadData: {
                pkProject:'',
                pkGroup:'',
                pkOrg:'',
                projectName: '',//项目
                contracttypeName: '',//合同类型
                subcontractName: '',//合同名称
                subcontractId:'',
                contracttypeId:'',
                vinvcode: '',//发票代码
                vinvno: '',//发票号码
                dopendate: '',//开票日期
                checkCode:'', // 校验码
                vsecret: '',//密码区
                vcstmname: '',//购买方名称
                vcstmtaxnumber: '',//购方纳税人识别号
                vcstmtaxnumber: '',//购方开户银行及银行账户
                vcstmaddresphone: '',//购方发地址及电话
                vsupname: '',//销售方
                vsuptaxnumber: '',//销售方纳税人识别号
                vsupbankaccount: '',//销售方开户银行及银行帐号
                vsupaddresphone: '',//销售方发地址及电话
                vmemo:'',//备注
                ninvtaxmnyCap:'', //税价合计(大写)
                ninvtaxmny:''// 税价合计(小写)
            },
        }
        },
        methods: {
            cancel(){//取消和返回
                router.push({
                    path: "/OpenManage"
                });
            },
            getOpenData(openId){//初始化开票信息
                var _this = this;
                const url = api.getOpenDataById(openId);
                this.ajax.get(url, openId, (data) => {
                var moduleData = data.data;
                _this.initHeadData(moduleData);
                _this.initBodyData(moduleData);
            });
            },

            initHeadData(moduleData){
                for (var hd in moduleData) {
                    this.openHeadData[hd] = moduleData[hd];
                }
            },

            initBodyData(moduleData){
                var rowArray = moduleData.rowData;
                for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {

                    var bodobj=JSON.parse(JSON.stringify(this.openBodyModulesData['123'][0])); //this.templateData是父组件传递的对象
                    // alert(rowIndex);
                    var row = rowArray[rowIndex];
                    bodobj.tdData.vopencontent.value = row.vopencontent;
                    bodobj.tdData.vinvspec.value = row.vinvspec;
                    bodobj.tdData.vinvunit.value = row.vinvunit;
                    bodobj.tdData.nnum.value = row.nnum;
                    bodobj.tdData.nprice.value = row.nprice;
                    bodobj.tdData.norigopenmny.value = row.norigopenmny;
                    bodobj.tdData.ntaxrate.value = row.ntaxrate;
                    bodobj.tdData.norigtaxmny.value = row.norigtaxmny;



                    this.openBodyModulesData[this.currentTabName][rowIndex] = bodobj;
                }
            },
        },
        created(){
            if(this.$route.query.mark == 0){
                var openId = this.$route.query.openId;
                var isEdit = this.$route.query.isEdit;
                this.isEdit = isEdit;
                this.getOpenData(openId);
            }

        }
    }

</script>
<style scoped lang="less">
    @import "../assets/css/open-edit2.less";
</style>
