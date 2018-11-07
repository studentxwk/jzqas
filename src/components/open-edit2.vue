<template>
    <div class="openEntry">
        <div class="openListOpt">
            <div slot="title" class="first-title">
                <Button type="success" @click="save('openHeadData')">保 存</Button>
                <Button @click="cancel">取 消</Button>
            </div>
        </div>
        <div class="openHeadModules">
            <Form class="openHeadData" ref="openHeadData" :model="openHeadData" :rules="ruleHeadData" :label-width="120">
                <div name="headbasic" style="padding:20px;padding: 0px;">
                    <table>
                        <tr>
                            <td>
                                <FormItem label="NC系统" prop="firstpartyId">
                                    <Select v-model="openHeadData.firstpartyId">
                                        <Option v-for="item in nclist" :value="item.id" :key="item.id">
                                            {{ item.corpName }}
                                        </Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem label="项 目" prop="projectName">
                                    <Input v-model="openHeadData.projectName">
                                    <Button slot="append" icon="ios-search" @click="open('pk_project')"></Button>
                                    </Input>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem label="合 同" prop="subcontractName">
                                    <Input v-model="openHeadData.subcontractName">
                                    <Button slot="append" icon="ios-search" @click="open('pk_contract')"></Button>
                                    </Input>
                                </FormItem>
                            </td>
                        </tr>
                    </table>
                    <ul class="y-title-box">
                        <li>
                            <FormItem label="发票代码：" prop="vinvcode" class="list-inputs">
                                <Input size="small" v-model="openHeadData.vinvcode"/>
                            </FormItem>
                            <FormItem label="发票号码：" prop="vinvno" class="list-inputs">
                                <Input size="small" v-model="openHeadData.vinvno"/>
                            </FormItem>
                            <FormItem label="开票日期：" prop="dopendate" style="margin:0;">
                                <DatePicker size="small" :value="openHeadData.dopendate" @on-change="onDateChange" type="date" placeholder="选择日期" class="y-spel-picker"></DatePicker>
                            </FormItem>
                            <FormItem label="校 验 码：" prop="checkCode" class="list-inputs">
                                <Input size="small" v-model="openHeadData.checkCode"/>
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
                                <FormItem label="名 称：" prop="vcstmname" class="list-inputs">
                                    <Input class="input" size="small" v-model="openHeadData.vcstmname"/>
                                </FormItem>
                                <FormItem label="纳税人识别号：" prop="vcstmtaxnumber" class="list-inputs">
                                    <Input class="input" size="small" v-model="openHeadData.vcstmtaxnumber"/>
                                </FormItem>
                                <FormItem label="地 址、电 话：" prop="vcstmaddresphone" class="list-inputs">
                                    <Input class="input" size="small" v-model="openHeadData.vcstmaddresphone"/>
                                </FormItem>
                                <FormItem label="开户行及账户：" prop="vcstmbankaccount" class="list-inputs">
                                    <Input class="input" size="small" v-model="openHeadData.vcstmbankaccount"/>
                                </FormItem>
                            </div>
                            <div class="nav">
                                密<br>
                                码<br>
                                区<br>
                            </div>
                            <div class="section1">
                                <FormItem prop="vsecret" class="spel-textarea">
                                    <Input v-model="openHeadData.vsecret" type="textarea" class="y-area-height"></Input>
                                </FormItem>
                            </div>
                        </div>
                        <div class="secend">
                            <Tab-pane v-for="module in openBodyModules" :key="module.id" :label="module.name"
                                      :name="module.id">
                                <table>
                                    <tr>
                                        <td v-for="item in module.items">{{item.name}}</td>
                                    </tr>
                                    <tr v-for="(moduleData,index) in openBodyModulesData[module.id]">
                                        <td v-for="(md,key) in moduleData.tdData"
                                            @dblclick="edit(module.id,key,index)">
                                            <span v-if="!md.isEdit">{{md.value}}</span>
                                            <Input v-model="md.value" v-if="md.isEdit" :placeholder="md.name"
                                            ></Input>
                                        </td>
                                        <Button type="ghost" @click="removeRow(index)">删除</Button>
                                    </tr>
                                </table>
                            </Tab-pane>
                            <Button style="margin:5px 0;"
                                    type="dashed" long
                                    @click="addRow" icon="plus-round">
                                新增
                            </Button>
                        </div>
                        <div class="third">
                            <div class="thirdCol" style="width: 30%;padding-top:8px;">
                                价税合计（大写）<br>
                            </div>
                            <div class="thirdCol2" style="width: 70%;padding:8px;overflow: hidden;">
                                <FormItem prop="ninvtaxmnyCap" class="spel-textarea" style="float:left;width: 50%">
                                    <Input placeholder="先输入后面的小写数字，可自动计算此值"
                                           v-model="openHeadData.ninvtaxmnyCap"/>
                                </FormItem>
                                <FormItem label="（小写）" prop="ninvtaxmny" style="float:left;width: 50%;margin:0;overflow: hidden;">
                                    <Input @on-change="digitUppercase(openHeadData.ninvtaxmny)"
                                           v-model="openHeadData.ninvtaxmny"
                                           placeholder="只能输入数字，保留两位小数"/>
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
                                <FormItem label="名 称：" prop="vsupname" class="list-inputs">
                                    <Input size="small" v-model="openHeadData.vsupname"/>
                                </FormItem>
                                <FormItem label="纳税人识别号：" prop="vsuptaxnumber" class="list-inputs">
                                    <Input size="small" v-model="openHeadData.vsuptaxnumber"/>
                                </FormItem>
                                <FormItem label="地 址、电 话：" prop="vsupaddresphone" class="list-inputs">
                                    <Input size="small" v-model="openHeadData.vsupaddresphone"/>
                                </FormItem>
                                <FormItem label="开户行及账户：" prop="vsupbankaccount" class="list-inputs">
                                    <Input size="small" v-model="openHeadData.vsupbankaccount"/>
                                </FormItem>
                            </div>
                            <div class="nav">
                                备<br>
                                <br>
                                注<br>
                            </div>
                            <div class="section1">
                                <FormItem prop="vmemo" class="spel-textarea">
                                    <Input v-model="openHeadData.vmemo" type="textarea" class="y-area-height"></Input>
                                </FormItem>
                            </div>
                        </div>
                    </div>
                    <div style="clear:both; overflow: auto; padding-top: 12px;">
                        <FormItem label="收款人：" prop="vreceiver" class="bottom-list">
                            <Input v-model="openHeadData.vreceiver"/>
                        </FormItem>
                        <FormItem label="复 核：" prop="vreviewer" class="bottom-list">
                            <Input v-model="openHeadData.vreviewer"/>
                        </FormItem>
                        <FormItem label="开票人：" prop="bisopen" class="bottom-list">
                            <Input v-model="openHeadData.bisopen"/>
                        </FormItem>
                    </div>
                </div>
            </Form>
        </div>
        <div class="btn-warp">
            <Modal
                    v-model="openModelProject"
                    width="460"
                    :closable="false"
                    :mask-closable="false"
                    title="项目"
            >
                <p slot="header" style="height: auto;text-align:left">
                    <span><Input v-model="openSearchProject" icon="ios-search" placeholder="输入名称搜索..."
                                 style="width:300px;"></Input></span>
                    <span><Button type="success" @click="getOpenList()">查询</Button></span>
                </p>
                <Table highlight-row :columns="proColumn" :data="openData"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <p style="float: left;line-height: 32px;font-size: 14px;">
                        当前展示 {{ openListFrom }} 到 {{ openListFrom + openListTo }} 条，共 {{ openListTotal }} 条
                    </p>
                    <div style="float: right;">
                        <Page :total="openListTotal" :current="1" @on-change="openChangePage"></Page>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="text" @click="openClose" size="large">取消</Button>
                </div>
            </Modal>
        </div>
        <div class="btn-warp">
            <Modal
                    v-model="openModelContract"
                    width="460"
                    :closable="false"
                    :mask-closable="false"
                    title="合同"
            >
                <p slot="header" style="height: auto;text-align:left">
                    <span><Input v-model="openSearchContract" icon="ios-search" placeholder="输入名称搜索..."
                                 style="width:300px;"></Input></span>
                    <span><Button type="success" @click="OpenContractList()">查询</Button></span>
                </p>
                <Table highlight-row :columns="proColumnContract" :data="openData"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <p style="float: left;line-height: 32px;font-size: 14px;">
                        当前展示 {{ openListFromContract }} 到 {{ openListFromContract + openListToContract
                        }} 条，共 {{ openListTotalContract }} 条
                    </p>
                    <div style="float: right;">
                        <Page :total="openListTotalContract" :current="1" @on-change="openChangePageContract"></Page>
                    </div>
                </div>
                <div slot="footer">
                    <Button type="text" @click="openClose" size="large">取消</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
    import api from '../utils/api';
    import router from '../router';

    export default {
        data() {
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
                    }, {
                        name: '单位',
                        id: 'vinvunit',
                        type: 'input'
                    }, {
                        name: '数量',
                        id: 'nnum',
                        type: 'input'
                    }, {
                        name: '单价',
                        id: 'nprice',
                        type: 'input'
                    }, {
                        name: '金额',
                        id: 'norigopenmny',
                        type: 'input'
                    }, {
                        name: '税率',
                        id: 'ntaxrate',
                        type: 'input'
                    }, {
                        name: '税额',
                        id: 'norigtaxmny',
                        type: 'input'
                    }]
                },
                ],
                openBodyModulesData: {
                    '123': [{
                        tdData: {
                            'vopencontent': {value: '', type: 'string', name: '货物或应税劳务、服务名称', isEdit: true},
                            'vinvspec': {value: '', type: 'string', name: '规格型号', isEdit: true},
                            'vinvunit': {value: '', type: 'string', name: '单位', isEdit: true},
                            'nnum': {value: '', type: 'string', name: '数量', isEdit: true},
                            'nprice': {value: '', type: 'string', name: '单价', isEdit: true},
                            'norigopenmny': {value: '', type: 'string', name: '金额', isEdit: true},
                            'ntaxrate': {value: '', type: 'string', name: '税率', isEdit: true},
                            'norigtaxmny': {value: '', type: 'string', name: '税额', isEdit: true},
                        },
                        isChecked: false
                    }]
                },
                value1: '1',
                value2: '2',
                hideData: {},
                currentTabName: '123',
                checkedAll: false,
                isEdit: false,
                ncmodel: '',//ncmode
                nclist: [],//nc列表
                reqData: {"rowData": []},
                openModelProject: false,
                openModelContract: false,
                openSearch: '',
                openColumn: '',
                projectData: [],
                projectSelect: [],
                openSelected: [],  // 选中的行
                hideData: {},
                curOpenKey: '',
                curRefKey: '',
                openListFrom: 0,  // 起始位置
                openListTo: 10,  // 列表长度
                openListToContract: 10,
                openListTotal: 0, // 列表总条数
                openListFromContract: 0,//起始位置
                openListTotalContract: 0,
                openTitle: '',
                openData: [],
                openSearchProject: '',
                openSearchContract: '',
                disabled: false,
                proColumn: [
                    {
                        title: '项目',
                        key: 'projectName'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.openSelect(params)
                                        }
                                    }
                                }, '选择')
                            ]);
                        }
                    }
                ],
                proColumnContract: [
                    {
                        title: '合同名称',
                        key: 'vname'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.openSelectContract(params)
                                        }
                                    }
                                }, '选择')
                            ]);
                        }
                    }
                ],
                openHeadData: {
                    pkProject: '',
                    pkGroup: '',
                    pkOrg: '',
                    contracttypeName: '',//合同类型
                    subcontractId: '',
                    contracttypeId: '',
                    firstpartyId: '',// NC系统
                    projectName: '',//项目
                    subcontractName: '',//合同名称
                    vinvcode: '',//发票代码
                    vinvno: '',//发票号码
                    dopendate: '',//开票日期
                    checkCode: '', // 校验码
                    vcstmname: '',//购买方名称
                    vcstmtaxnumber: '',//购方纳税人识别号
                    vcstmaddresphone: '',//购方发地址及电话
                    vcstmbankaccount: '',//购方开户银行及银行账户
                    vsecret: '',//密码区
                    ninvtaxmnyCap: '',//税价合计(大写)
                    ninvtaxmny: '',// 税价合计(小写)
                    vsupname: '',//销售方
                    vsuptaxnumber: '',//销售方纳税人识别号
                    vsupaddresphone: '',//销售方发地址及电话
                    vsupbankaccount: '',//销售方开户银行及银行帐号
                    vmemo: '',//备注
                    vreceiver: '',// 收款人
                    vreviewer: '',// 复 核
                    bisopen: ''// 开票人
                },
                ruleHeadData: {
                    firstpartyId: [
                        {required: true, message: '请选择！', trigger: 'change'}
                    ],
                    projectName: [
                        {required: true, message: '请选择！', trigger: 'blur'}
                    ],//项目
                    subcontractName: [
                        {required: true, message: '请选择！', trigger: 'blur'}
                    ],//合同名称
                    vinvcode: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//发票代码
                    vinvno: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//发票号码
                    dopendate: [
                        {required: true, message: '', trigger: 'change'}
                    ],//开票日期
                    checkCode: [
                        {required: true, message: '', trigger: 'blur'}
                    ], // 校验码
                    vcstmname: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//购买方名称
                    vcstmtaxnumber: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//购方纳税人识别号
                    vcstmaddresphone: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//购方发地址及电话
                    vcstmbankaccount: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//购方开户银行及银行账户
                    vsecret: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//密码区
                    ninvtaxmnyCap: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//税价合计(大写)
                    ninvtaxmny: [
                        {required: true, message: '', trigger: 'blur'}
                    ],// 税价合计(小写)
                    vsupname: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//销售方
                    vsuptaxnumber: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//销售方纳税人识别号
                    vsupaddresphone: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//销售方发地址及电话
                    vsupbankaccount: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//销售方开户银行及银行帐号
                    vmemo: [
                        {required: true, message: '', trigger: 'blur'}
                    ],//备注
                    vreceiver: [
                        {required: true, message: '请填写！', trigger: 'blur'}
                    ],// 收款人
                    vreviewer: [
                        {required: true, message: '请填写！', trigger: 'blur'}
                    ],// 复 核
                    bisopen: [
                        {required: true, message: '请填写！', trigger: 'blur'}
                    ]// 开票人
                }
            }
        },
        methods: {
            onDateChange(date) {
                this.openHeadData.dopendate = date;
            },
            getNClist() {
                const url = api.getRefUrl();
                var ncData = {
                    openKey: 'nc_system',
                    search: '',
                }
                this.ajax.post(url, ncData, (data) => {

                    this.nclist = data.data;
                });
            },
            //合同弹出框选择
            openSelectContract(params) {
                this.openHeadData.subcontractName = params.row.vname;
                this.openHeadData.subcontractId = params.row.id;
                this.openHeadData.contracttypeId = params.row.pk_billtypecode;
                this.openHeadData.contracttypeName = params.row.contracttypeName;
                this.openClose();
            },
            //项目弹出框选择
            openSelect(params) {  // 选中的行
                var proId = params.row.projectId;
                var proName = params.row.projectName;
                this.openHeadData.pkProject = proId;
                this.openHeadData.projectName = proName;
                this.openHeadData.pkGroup = params.row.pkGroup;
                this.openHeadData.pkOrg = params.row.pkOrg;
                this.openClose();
            },
            open(key) {
                this.curOpenKey = key;
                if (key == "pk_project") {
                    this.getOpenList();
                    this.openModelProject = true;
                } else if (key == "pk_contract") {
                    this.OpenContractList();
                    this.openModelContract = true;
                }
            },
            openClose() {
                this.openModelProject = false;
                this.openModelContract = false;
            },
            getOpenList() {
                const openUrl = api.getRefUrl();
                var openData = {
                    resultType: 'page',
                    start: this.openListFrom,
                    length: 10,
                    openKey: this.curOpenKey,
                    search: this.openSearchProject,
                };
                this.ajax.post(openUrl, openData, (data) => {
                    this.openData = data.data.list;
                    this.openListTotal = data.data.total;
                    if (data.data.list.length < this.openListTo) {
                        this.openListTo = data.data.list.length;
                    }
                });
            },
            OpenContractList() {
                const openUrl = api.getRefUrl();
                var openData = {
                    start: this.openListFromContract,
                    length: 10,
                    openKey: this.curOpenKey,
                    search: this.openSearchContract,
                };
                this.ajax.post(openUrl, openData, (data) => {

                    this.openData = data.data.list;
                    this.openListTotalContract = data.data.total;
                    if (data.data.list.length < this.openListTo) {
                        this.openListToContract = data.data.list.length;
                    }
                });
            },
            openChangePage(n) {  // 切换分页，重载数据
                this.openListTo = 10;
                this.openListFrom = this.openListTo * (n - 1);
                this.getOpenList();
            },
            openChangePageContract(n) {  // 切换分页，重载数据
                this.openListToContract = 10;
                this.openListFromContract = this.openListToContract * (n - 1);
                this.OpenContractList();
            },
            cancel() {//取消和返回
                router.push({
                    path: "/OpenManage"
                });
            },
            save(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.openHeadData.contracttypeId == "H5A1") {
                            this.openHeadData.contracttypeName = "专业分包合同";
                        } else if (this.openHeadData.contracttypeId == "H5AI") {
                            this.openHeadData.contracttypeName = "劳务分包合同";
                        } else if (this.openHeadData.contracttypeId == "Z2") {
                            this.openHeadData.contracttypeName = "物资采购合同";
                        } else if (this.openHeadData.contracttypeId == "H542") {
                            this.openHeadData.contracttypeName = "其它支出类合同";
                        }

                        const url = api.saveOpenInfo();
                        var data = this.openHeadData;
                        data.rowData = [];
                        var obj = {};
                        for (var key in this.openBodyModulesData) {
                            var rowArray = this.openBodyModulesData[key];
                            for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
                                obj = {};
                                for (var rowkey in rowArray[rowIndex].tdData) {
                                    obj[rowkey] = rowArray[rowIndex].tdData[rowkey].value;
                                }
                                data.rowData.push(obj);
                            }
                        }
                        this.ajax.post(url, data, (data) => {
                            this.$Message.success('保存成功');
                            router.push({
                                path: "/OpenManage"
                            });
                        }, (data) => {
                            this.$Message.success(data.error_msg);
                        });
                    }
                });
            },
            addRow() {//增加行
                var obj = {}, rowObj = {};
                this.openBodyModules.map(module => {
                    if (module.id == this.currentTabName) {
                        module.items.map(item => {
                            // debugger;
                            obj[item.id] = {value: '', type: 0, name: item.name, isEdit: true}
                        })
                        rowObj = {'tdData': obj, 'isChecked': false}
                        this.openBodyModulesData[this.currentTabName].push(rowObj);
                    }
                })
                this.$forceUpdate();
            },
            removeRow(index) {//删除行
                for (var row in this.openBodyModulesData) {
                    if (row == this.currentTabName) {
                        this.openBodyModulesData[row].splice(index, 1);
                    }
                }
                this.$forceUpdate();
            },
            getOpenData(openId) {//初始化开票信息
                var _this = this;
                const url = api.getOpenDataById(openId);
                this.ajax.get(url, openId, (data) => {
//                    console.log(data);
                    var moduleData = data.data;
                    _this.initHeadData(moduleData);
                    _this.initBodyData(moduleData);
                });
            },
            initHeadData(moduleData) {
                for (var hd in moduleData) {
                    this.openHeadData[hd] = moduleData[hd];
                }
            },
            initBodyData(moduleData) {
                var rowArray = moduleData.rowData;
                for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {

                    var bodobj = JSON.parse(JSON.stringify(this.openBodyModulesData['123'][0])); //this.templateData是父组件传递的对象
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
            digitUppercase(n) {
                if (/^([1-9]([0-9]{0,11})|[0]\.\d{1,2}|[1-9]([0-9]{0,11})\.\d{1,2})$/.test(n)) {
                    var fraction = ['角', '分'];
                    var digit = [
                        '零', '壹', '贰', '叁', '肆',
                        '伍', '陆', '柒', '捌', '玖'
                    ];
                    var unit = [
                        ['元', '万', '亿'],
                        ['', '拾', '佰', '仟']
                    ];
                    var head = n < 0 ? '欠' : '';
                    n = Math.abs(n);
                    var s = '';
                    for (var i = 0; i < fraction.length; i++) {
                        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
                    }
                    s = s || '整';
                    n = Math.floor(n);
                    for (var i = 0; i < unit[0].length && n > 0; i++) {
                        var p = '';
                        for (var j = 0; j < unit[1].length && n > 0; j++) {
                            p = digit[n % 10] + unit[1][j] + p;
                            n = Math.floor(n / 10);
                        }
                        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
                    }
                    var val = head + s.replace(/(零.)*零元/, '元')
                        .replace(/(零.)+/g, '零')
                        .replace(/^整$/, '零元整');

                    this.openHeadData.ninvtaxmnyCap = val;
                } else {
                    this.openHeadData.ninvtaxmnyCap = '';
                }
            }
        },
        created() {
            this.getNClist();
            if (this.$route.query.mark == 0) {
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
