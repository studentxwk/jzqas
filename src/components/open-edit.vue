<template>
    <div class="openEntry">
        <div class="openListOpt">
            <div slot="title" class="first-title">
                <Button type="success" @click="save">保存</Button>
                <Button type="success" @click="cancel">取消</Button>
            </div>
        </div>
        <div class="openHeadModules" style="width: 100%;text-align: center">

            <div class="optItem" style="text-align: left">
                <span class="lb">NC系统</span>
                <Select v-model="openHeadData.firstpartyId" style="width:200px">
                    <Option v-for="item in nclist" :value="item.id" :key="item.id">
                        {{ item.corpName }}
                    </Option>
                </Select>
            </div>
            <Form class="openHeadData" ref="openHeadData" :model="openHeadData"  :label-width="80">
                <Collapse v-model="value1" style="text-align: left; width: 100%" accordion>
                    <Panel name="1">基本信息
                        <div name="headbasic" slot="content" style="padding:20px;padding: 0px;">
                            <table>
                                <tr>
                                    <td >
                                        <Form prop="projectName" >
                                            <label style="line-height:40px;">项目</label>
                                            <Input v-model="openHeadData.projectName" style="width: 200px;" >
                                            <Button slot="append" icon="ios-search" @click="open('pk_project')"style="width: 20px;"></Button>
                                            </Input>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form prop="contracttypeId">
                                            <label>合同类型</label>
                                            <Input v-model="openHeadData.contracttypeName" style="width: 180px">
                                            </Input>
                                        </Form>
                                    </td>
                                    <td >
                                        <Form prop="contracttypeName">
                                            <label style="line-height:40px;">合同名称</label>
                                            <Input v-model="openHeadData.subcontractName" style="width: 180px">
                                            <Button slot="append" icon="ios-search" @click="open('pk_contract')" style="width: 10px;"></Button>
                                            </Input>
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form prop="vsupname">
                                            <label >销售方</label>
                                            <Input v-model="openHeadData.vsupname" style="width: 180px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form prop="vsuptaxnumber" style="width: 100%;">
                                            <label>销售方纳税人识别号</label>
                                            <Input v-model="openHeadData.vsuptaxnumber" style="width: 180px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form prop="vsupbankaccount">
                                            <label>销售方开户银行及银行账户</label>
                                            <Input v-model="openHeadData.vsupbankaccount" style="width: 180px"/>
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form prop="vsupaddresphone">
                                            <label>销售方发地址及电话</label>
                                            <Input v-model="openHeadData.vsupaddresphone" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form prop="vcstmname">
                                            <label>购方</label>
                                            <Input v-model="openHeadData.vcstmname" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="vcstmtaxnumber">
                                            <label>购方纳税人识别号</label>
                                            <Input v-model="openHeadData.vcstmtaxnumber" style="width: 200px"/>
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form  prop="vcstmtaxnumber">
                                            <lable>购方开户银行及银行账户</lable>
                                            <Input v-model="openHeadData.vcstmbankaccount" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="vcstmaddresphone">
                                            <label>购方发地址及电话</label>
                                            <Input v-model="openHeadData.vcstmaddresphone" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="vcopenunitname">
                                            <label>开票单位</label>
                                            <Input v-model="openHeadData.vcopenunitname" style="width: 200px"/>
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form  prop="vopenunitphone">
                                            <label>开票单位电话</label>
                                            <Input v-model="openHeadData.vopenunitphone" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="vopenunitaddress">
                                            <label>开票单位地址</label>
                                            <Input v-model="openHeadData.vopenunitaddress" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="vinvno">
                                            <label>发票号码</label>
                                            <Input v-model="openHeadData.vinvno" style="width: 200px"/>
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form prop="vinvcode">
                                            <label>发票代码</label>
                                            <Input v-model="openHeadData.vinvcode" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="iinvtype">
                                            <label>发票类型</label>
                                            <Select v-model="openHeadData.iinvtype" style="width:200px">
                                                <Option v-for="item in iinvTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                            </Select>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="ntaxrate">
                                            <label>税率</label>
                                            <Input v-model="openHeadData.ntaxrate" style="width: 200px"/>
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form  prop="norigthopenmny">
                                            <label>发票金额(无税)</label>
                                            <Input v-model="openHeadData.norigthopenmny" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form prop="norigtaxmny">
                                            <label>税额</label>
                                            <Input v-model="openHeadData.norigtaxmny" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="dopendate">
                                            <label>开票日期</label>
                                            <DatePicker v-model="openHeadData.dopendate" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
                                        </Form>
                                    </td>
                                </tr>
                            </table>
                            <Form-item label="密文" prop="vsecret" >
                                <Input v-model="openHeadData.vsecret" type="textarea"  rows="3" placeholder="请输入..." style="width: 75em"></Input>
                            </Form-item>
                            <!--<Form-item label="密文" prop="vsecret">
                             <textarea v-model="openHeadData.vsecret" cols="120" rows="3" placeholder="请输入..."
                                       style="border-radius:4px;">
                             </textarea>
                            </Form-item>-->
                        </div>
                    </Panel>
                </Collapse>
                <Collapse v-model="value2" style="text-align: left; width: 100%">
                    <Panel name="2">红票信息
                        <div name="red" slot="content" >
                            <table >
                                <tr >
                                    <td>
                                        <Form  prop="bisred">
                                            <label style="line-height: 40px">是否红票</label>
                                            <Checkbox v-model="openHeadData.bisred" :disabled="disabled" style="line-height: 40px">
                                            </Checkbox>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="bishadopenred" style="line-height: 40px">
                                            <label>是否已开红票</label>
                                            <Checkbox v-model="openHeadData.bishadopenred" :disabled="disabled" style="line-height: 40px">
                                            </Checkbox>
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width: 30%">
                                        <Form  prop="vbluecontent">
                                            <label>对应蓝字发票</label>
                                            <Input v-model="openHeadData.vbluecontent" style="width: 200px; "/>
                                        </Form>
                                    </td>
                                    <td style="width: 30%">
                                        <Form  prop="iredaplyreason">
                                            <label>红字开票申请原因</label>
                                            <Input v-model="openHeadData.iredaplyreason" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td style="width: 30%">
                                        <Form prop="vredinfono">
                                            <label>红字专用发票信息表编号</label>
                                            <Input v-model="openHeadData.vredinfono" style="width: 200px"></Input>
                                        </Form>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Form  prop="nshredmny">
                                            <label>可开红票金额(无税)</label>
                                            <Input v-model="openHeadData.nshredmny" style="width: 200px"/>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form  prop="nhadredmny">
                                            <label>已开红票金额(无税)</label>
                                            <Input v-model="openHeadData.nhadredmny" style="width: 200px"/>
                                        </Form>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </Panel>
                </Collapse>
            </Form>
        </div>
        <div class="openBodyModel" style="margin-top: 30px">
            <div class="opt"  >
                <Button type="primary" @click="addRow" style="margin-right: 10px;">增行</Button>
                <Button type="warning" @click="removeRow">删行</Button>
            </div>
            <Tabs class="name1">
                <Tab-pane  v-for="module in openBodyModules" :key="module.id" :label="module.name" :name="module.id">
                    <table class="openBodyTable" >
                        <tr style="background-color:#c8def7">
                            <th class="tbHeader" >
                                <Checkbox v-model="module.smTableCode" @on-change="checkAll"></Checkbox>
                            </th>
                            <th v-for="item in module.items" class="tbHeader" >{{item.name}}</th>
                        </tr>
                        <tr v-for="(moduleData,index) in openBodyModulesData[module.id]">
                            <td >
                                <Checkbox v-model="moduleData.isChecked"
                                          @on-change="(checked) => {checkRow(checked,module.id+'_'+index)}"></Checkbox>
                            </td>
                            <td v-for="(md,key) in moduleData.tdData" @dblclick="edit(module.id,key,index)">
                                <span v-if="!md.isEdit">{{md.value}}</span>
                                <Input v-model="md.value" v-if="md.isEdit" :placeholder="md.name"
                                ></Input>
                            </td>
                        </tr>
                    </table>
                </Tab-pane>
            </Tabs>
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
                    <span><Input v-model="openSearchProject" icon="ios-search" placeholder="输入名称搜索..." style="width:300px;"></Input></span>
                    <span><Button type="success" @click="getOpenList()">查询</Button></span>
                </p>
                <Table highlight-row :columns="proColumn" :data="openData" ></Table>
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
                    <span><Input v-model="openSearchContract" icon="ios-search" placeholder="输入名称搜索..." style="width:300px;"></Input></span>
                    <span><Button type="success" @click="OpenContractList()">查询</Button></span>
                </p>
                <Table highlight-row :columns="proColumnContract" :data="openData" ></Table>
                <div style="margin: 10px;overflow: hidden">
                    <p style="float: left;line-height: 32px;font-size: 14px;">
                        当前展示 {{ openListFromContract }} 到 {{ openListFromContract + openListToContract }} 条，共 {{ openListTotalContract }} 条
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
        data(){
            return {
                value1: '1',
                value2: '2',
                hideData:{},
                currentTabName: '123',
                checkedAll: false,
                isEdit: false,
                firstpartyId: '',
                ncmodel: '',//ncmode
                nclist: [],//nc列表
                reqData: {"rowData":[]},
                openModelProject: false,
                openModelContract:false,
                openSearch: '',
                openColumn:'',
                projectData:[],
                projectSelect:[],
                openSelected: [],  // 选中的行
                hideData:{},
                curOpenKey:'',
                curRefKey:'',
                openListFrom: 0,  // 起始位置
                openListTo: 10,  // 列表长度
                openListToContract:10,
                openListTotal: 0 , // 列表总条数
                openListFromContract:0,//起始位置
                openListTotalContract:0,
                openTitle:'',
                projectData:[],
                openData:[],
                openSearchProject: '',
                openSearchContract: '',
                disabled:false,
                iinvTypeList:[
                    {
                        value: '1',
                        label: '专用发票'
                    },{
                        value: '2',
                        label: '普通发票'
                    }
                ],
                openBodyModules: [{
                    name: '纸质发票',
                    id: '123',
                    items: [{
                        name: '发票内容',
                        id: 'vopencontent',
                        type: 'input'
                    }, {
                        name: '规格',
                        id: 'vinvspec',
                        type: 'input'
                    }, {
                        name: '型号',
                        id: 'vinvtype',
                        type: 'input'
                    }, {
                        name: '税率%',
                        id: 'ntaxrate',
                        type: 'input'
                    }, {
                        name: '单位',
                        id: 'vinvunit',
                        type: 'input'
                    }, {
                        name: '数量',
                        id: 'nnum',
                        type: 'input'
                    },{
                        name: '单价',
                        id: 'nprice',
                        type: 'input'
                    },{
                        name: '发票金额',
                        id: 'norigopenmny',
                        type: 'input'
                    },{
                        name: '税额',
                        id: 'norigtaxmny',
                        type: 'input'
                    },{
                        name: '备注',
                        id: 'vmemo',
                        type: 'input'
                    }]
                },
                ],
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
                pkProject:'',
                pkGroup:'',
                pkOrg:'',
                projectName: '',//项目
                contracttypeName: '',//合同类型
                subcontractName: '',//合同名称
                subcontractId:'',
                contracttypeId:'',
                vsupname: '',//销售方
                vsuptaxnumber: '',//销售方纳税人识别号
                vsupbankaccount: '',//销售方开户银行及银行帐号
                vsupaddresphone: '',//销售方发地址及电话
                vcstmname: '',//购方
                vcstmtaxnumber: '',//购方纳税人识别号
                vcstmtaxnumber: '',//购方开户银行及银行账户
                vcstmaddresphone: '',//购方发地址及电话
                vcopenunitname: '',//开票单位
                vopenunitphone: '',//开票单位电话
                vopenunitaddress: '',//开票单位地址
                vinvno: '',//发票号码
                vinvcode: '',//发票代码
                iinvtype: '',//发票类型
                ntaxrate: '',//税率
                norigthopenmny: '',//发票金额(无税)
                norigtaxmny: '',//税额
                dopendate: '',//开票日期
                vsecret: '',//密文
                bisred: 'false',//是否红票
                bishadopenred: 'false',//是否已开红票
                vbluecontent: '',//对应蓝字发票
                iredaplyreason: '',//红字开票申请原因
                vredinfono: '',//红字专用发票信息表编号
                nshredmny: '',//可开红票金额(无税)
                nhadredmny: ''//已开红票金额(无税)
            },
            openBodyModulesData: {
                '123': [{
                    tdData: {
                        'vopencontent': {value: '', type: 'string', name: '发票内容', isEdit: true},
                        'vinvspec': {value: '', type: 'string', name: '规格', isEdit: true},
                        'vinvtype': {value: '', type: 'string', name: '型号', isEdit: true},
                        'ntaxrate': {value: '', type: 'string', name: '税率%', isEdit: true},
                        'vinvunit': {value: '', type: 'string', name: '单位', isEdit: true},
                        'nnum': {value: '', type: 'string', name: '数量', isEdit: true},
                        'nprice': {value: '', type: 'string', name: '单价', isEdit: true},
                        'norigopenmny': {value: '', type: 'string', name: '发票金额', isEdit: true},
                        'norigtaxmny': {value: '', type: 'string', name: '税额', isEdit: true},
                        'vmemo': {value: '', type: 'string', name: '备注', isEdit: true},
                    },
                    isChecked: false
                }]},
        }
        },
        methods: {
            getNClist () {
                const url = api.getRefUrl();
                var ncData = {
                    openKey: 'nc_system',
                    search: '',
                }
                this.ajax.post(url, ncData, (data) => {
                    console.log(data);
                this.nclist = data.data;
            });
            },
            //合同弹出框选择
            openSelectContract(params){
                this.openHeadData.subcontractName = params.row.vname;
                this.openHeadData.subcontractId = params.row.id;
                this.openHeadData.contracttypeId = params.row.pk_billtypecode;
                this.openHeadData.contracttypeName  = params.row.contracttypeName;
                this.openClose();
            },

            //项目弹出框选择
            openSelect (params) {  // 选中的行
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
                if(key == "pk_project"){
                    this.getOpenList();
                    this.openModelProject= true;
                }else if(key == "pk_contract"){
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
                    resultType:'page',
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
                    length: 10,
                    openKey: this.curOpenKey,
                    search: this.openSearchContract,
                };
                this.ajax.post(openUrl, openData, (data) => {
                    console.log(data);
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
            getOpenData(openId){//初始化开票信息
                var _this = this;
                const url = api.getOpenDataById(openId);
                this.ajax.get(url, openId, (data) => {
                    console.log(data);
                var moduleData = data.data;
                _this.initHeadData(moduleData);
                _this.initBodyData(moduleData);
            });
            },
            initHeadData(moduleData){
                for (var hd in moduleData) {
                    if(moduleData.bisred=='y' || moduleData.bisred=='Y'){
                        this.openHeadData.bisred = true;
                    }
                    if(moduleData.bishadopenred =='Y' || moduleData.bishadopenred =='y'){
                        this.openHeadData.bishadopenred = true;
                    }
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
                    bodobj.tdData.vinvtype.value = row.vinvtype;
                    bodobj.tdData.ntaxrate.value = row.ntaxrate;
                    bodobj.tdData.vinvunit.value = row.vinvunit;
                    bodobj.tdData.nprice.value = row.nprice;
                    bodobj.tdData.norigopenmny.value = row.norigopenmny;
                    bodobj.tdData.norigtaxmny.value = row.norigtaxmny;
                    bodobj.tdData.vmemo.value = row.vmemo;
                    bodobj.tdData.nnum.value = row.nnum;

                    this.openBodyModulesData[this.currentTabName][rowIndex] = bodobj;
                }
            },
            save(){//保存开票信息
                const url = api.saveOpenInfo();
                //debugger;
                var obj = {};
                //获取表体数据
                var data = this.openHeadData;//获取表头数据
                data.rowData = [];
                for (var key in this.openBodyModulesData) {
                    var rowArray = this.openBodyModulesData[key];

                    for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
                        obj = {};
                        for (var rowkey in rowArray[rowIndex].tdData) {
                            //debugger;
                            obj[rowkey] = rowArray[rowIndex].tdData[rowkey].value;
                        }
                        data.rowData.push(obj);
                    }
                }
                this.ajax.post(url, data, (data) => {
                    //console.log(data);
                    if (data.error_code == 200) {
                    this.$Message.success('保存成功');
                    router.push({
                        path: "/OpenManage"
                    });
                    }else{
                        this.$Message.success('保存失败');
                    }
                });
            },
            cancel(){//取消和返回
                router.push({
                    path: "/OpenManage"
                });
            },
            addRow(){//增加行
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
            //点击表格单元格切换编辑模式
            edit(moduleId, itemId, index)
            {
                this.openBodyModulesData[moduleId][index]['tdData'][itemId].isEdit = true;
                this.$forceUpdate()
            }
            ,
            //全选行
            checkAll(checked)
            {
                for (var row in this.openBodyModulesData) {
                    if (row == this.currentTabName) {
                        for (var v in this.openBodyModulesData[row]) {
                            this.openBodyModulesData[row][v].isChecked = checked;
                        }
                    }
                }
            }
            ,
            //选中或者取消选中行
            checkRow(checked, row)
            {
                if (checked) {
                    var isAllChecked = true;
                    for (var row in this.openBodyModulesData) {
                        if (row == this.currentTabName) {
                            for (var v in this.openBodyModulesData[row]) {
                                if (!this.openBodyModulesData[row][v].isChecked) {
                                    isAllChecked = false;
                                    break;
                                }
                            }
                        }
                    }
                    this.checkedAll = isAllChecked;
                } else {
                    this.checkedAll = false;
                }
            }
            ,
            removeRow(){//删除行
                for (var row in this.openBodyModulesData) {
                    if (row == this.currentTabName) {
                        for (var i = 0; i < this.openBodyModulesData[row].length; i++) {
                            if (this.openBodyModulesData[row][i].isChecked) {
                                this.openBodyModulesData[row].splice(i, 1);
                                i--;
                            }
                        }
                    }
                }
                this.$forceUpdate();
            },
        },
        computed: {}
        ,
        created(){
            this.getNClist();
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
    @import "../assets/css/open-edit.less";
    @import "../assets/css/control.css";
</style>
