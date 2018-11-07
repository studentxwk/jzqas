<template>
  <Form :model="formItem" :label-width="130" style="margin-left: 20px;" ref="formValidate" :rules="ruleValidate">
    <Form-item style='margin-top:10px;margin-left: 35px;'>
      <Button type="primary" @click="save" style="float: left;width: 80px;" >保存</Button>
      <Button type="ghost" style="margin-left: 30px;float: left;width: 80px;" @click="cancle" >取消</Button>
    </Form-item>
    <Form-item label="NC系统"  style="margin-left: 35px;" prop="firstpartyId">
      <Select v-model="formItem.firstpartyId" style="width:300px;float: left;" :class="{error_border2:testObj.firstpartyId}" @on-change="checkMessage('firstpartyId')">
        <Option v-for="item in nclist" :value="item.id" :key="item.id" lazy >{{ item.corpName }}</Option>
      </Select>
      <p class="ivu-form-item-error-tip top42" style="margin-top:30px;" v-if="testObj.firstpartyId">{{ errorTip }}</p>
    </Form-item>
    <Collapse v-model="model" style = "margin-right: 20px;">
      <Panel name="1" style="text-align: left">
        基本信息
      <div slot="content" style="padding: 0 20px">
            <Form-item label="项目" style="float: left;" prop="projectName">
              <Input v-model="formItem.projectName"  placeholder="请选择..."
                     style="width: 300px" readonly :class="{error_border:testObj.projectName}">
              <Button slot="append" icon="ios-search" @click="open('pk_project')"></Button>
              </Input>
              <p class="ivu-form-item-error-tip top42"  v-if="testObj.projectName">{{ errorTip }}</p>
            </Form-item>
            <Form-item label="单据日期" >
                <Col span="3">
                <Date-picker placeholder="选择日期" type="date" v-model="formItem.dbilldate" lazy style="width:300px;float: left;"></Date-picker>
                </Col>
            </Form-item>
            <Form-item label="上次结算截止日期"  style="float: left;" prop="dlastsettledate">
              <Col span="3">
              <Date-picker  placeholder="选择日期" type="date"  v-model="formItem.dlastsettledate" lzay style="width:300px;float: left;" :class="{error_border:testObj.dlastsettledate}"></Date-picker>
              </Col>
              <p class="ivu-form-item-error-tip top42" style="margin-top:30px;" v-if="testObj.dlastsettledate">{{ errorTip }}</p>
            </Form-item>
            <Form-item label="本次结算截止日期" prop="dsettledate">
              <Col span="3">
              <Date-picker type="date" placeholder="选择日期" v-model="formItem.dsettledate" lazy style="width:300px;float: left;" ></Date-picker>
              </Col>
            </Form-item>
        <!--
            <Form-item label="合同类型" style="float: left;">
              <Select v-model="formItem.contracttypeId" style="width:300px;float: left;">
                <Option v-for="item in contractTypelist" :value="item.templetCode" :key="item.templetCode" lazy>{{ item.templetName }}</Option>
              </Select>
            </Form-item>-->
            <Form-item label="合同" prop="subcontractName">
              <!--<Input v-model="formItem.subcontractName" lazy style="width:300px;float: left;"></Input>-->
              <Input v-model="formItem.subcontractName"  placeholder="请选择..."
                     style="width: 300px" readonly :class="{error_border:testObj.subcontractName}">
              <Button slot="append" icon="ios-search" @click="open('pk_contract')"></Button>
              </Input>
              <p class="ivu-form-item-error-tip top42"  v-if="testObj.subcontractName">{{ errorTip }}</p>
            </Form-item>
            <Form-item label="分包模式" v-if="formItem.contracttypeId == 'H5AI'">
              <Select v-model="formItem.isubmode" style="width:300px;float: left;">
                <Option v-for="item in isubmodeList" :value="item.key" :key="item.key" lazy>{{item.value}}</Option>
              </Select>
            </Form-item>
            <Form-item label="是否完工" v-if="formItem.contracttypeId == 'H5A1'">
              <Checkbox v-model="formItem.bisfinished" lazy ></Checkbox>
            </Form-item>
            <Form-item label="备注">
              <Input v-model="formItem.vmemo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:750px;float: left;"></Input>
            </Form-item>
      </div>
    </Panel>
    </Collapse>

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

  </Form>
</template>
<script>
  import router from '../router';
  import api from '../utils/api';
  import axios from 'axios';
  export default {
    data () {
      return {
        isubmodeList:[],
        formItem: {
          firstpartyId: '',
          corpName:'',
          projectId: '',
          projectName:'',
          dbilldate: '',
          subcontractId:'',
          subcontractName: '',
          contracttypeId: '',
          contracttypeName:'',
          dlastsettledate: '',
          dsettledate: '',
          bisfinished: false,
          vmemo: '',
          id: '',
          pkGroup:'',
          pkOrg:'',
          isubmode:''
        },

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

        model: '1',
        settleMessage:'',
        openSearchPrject: '',
        openSearchContract: '',
        openSearchProject:'',
        nclist: [],
        projectlist: [],
        contractTypelist: [],
        openModelProject: false,
        openModelContract: false,
        openData:[],
        openListFrom: 0,  // 起始位置
        openListTo: 10,  // 列表长度
        openListTotal: 0,  // 列表总条数
        openListFromContract: 0,  // 起始位置
        openListToContract: 10,  // 列表长度
        openListTotalContract: 0,  // 列表总条数
        errorTip: '不能为空！',
        testObj: {
          firstpartyId: false,
          projectName:false,
          dlastsettledate:false,
          subcontractName:false
        },
        ruleValidate: {
          firstpartyId: [
            { required: true,message:' ',trigger: 'blur'}
          ],
          projectName: [
            { required: true,message:'不能为空！',trigger: 'blur'}
          ],
          dlastsettledate: [
            { required: true,message:' ',trigger: 'blur'}
          ],
          dsettledate:[
            { required: true,message:' ',trigger: 'blur'}
          ],
          subcontractName:[
            { required: true,message:'不能为空！',trigger: 'blur'}
          ]
        }

      }
    },
    methods: {
      //合同弹出框选择
      openSelectContract(params){
        this.formItem.subcontractName = params.row.vname;
        this.formItem.subcontractId = params.row.id;
        this.formItem.contracttypeId = params.row.pk_billtypecode;
        this.openClose();
      },

      //项目弹出框选择
      openSelect (params) {  // 选中的行
        var proId = params.row.projectId;
        var proName = params.row.projectName;
        this.formItem.projectId = proId;
        this.formItem.projectName = proName;
        this.formItem.pkGroup = params.row.pkGroup;
        this.formItem.pkOrg = params.row.pkOrg;
        this.checkMessage("projectName");
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
          start: this.openListFromContract,
          length: 10,
          openKey: this.curOpenKey,
          search: this.openSearchContract,
          contracttypeId:this.formItem.contracttypeId,
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
      save(){
        //判空
        var hasNull = 0;
        for(let key in this.testObj){
          this.checkMessage(key);
          if(this.testObj[key]){
            hasNull += 1;
          }
        }

        if(hasNull == 0){
          if(this.formItem.contracttypeId == "H5A1"){
          this.formItem.contracttypeName = "专业分包合同";
        }else if(this.formItem.contracttypeId == "H5AI"){
          this.formItem.contracttypeName = "劳务分包合同";
        }else if(this.formItem.contracttypeId == "Z2"){
            this.formItem.contracttypeName = "物资采购合同";
        }else if(this.formItem.contracttypeId == "H542"){
            this.formItem.contracttypeName = "其它支出类合同";
          }
          const url = api.saveSubsettle(),
          data = this.formItem;

          this.ajax.post(url, data, (data) => {
          if (data.error_code == 200) {
            router.push({
              path: "/SettleManage"
            });
          }else{
            this.$Message.success('保存失败');
          }
          });
        }
      },

      checkMessage(name){
          if(this.formItem[name] == ""){
            this.testObj[name] = true;
          }else{
            this.testObj[name] = false;
          }
      },

      cancle(){
        router.push({
          path: "/SettleManage"
        });
      },

      //查询要修改的数据
      getEditMessage(id){
        this.formItem.id = id;
        const url = api.getSettleById(id);
        this.ajax.post(url, null, (data) => {
        console.log(data);
        this.settleMessage = data.data;
        this.formItem =  data.data;
        if(this.formItem.bisfinished == 'Y'){
          this.formItem.bisfinished = true;
        }
      });
      },

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

      getContractTypeList(){
        const url = api.getRefUrl();
        var typeData = {
          openKey: 'contract_type',
          search: '',
        }
        this.ajax.post(url, typeData, (data) => {
          console.log(data);
        this.contractTypelist = data.data;
      });
      },

      getProjectlist () {
        const url = api.getRefUrl();
        var proData = {
          openKey: 'pk_project',
          firstpartyId: this.firstpartyId,
          search: '',
        }
        this.ajax.post(url, proData, (data) => {
          console.log(data);
        this.projectlist = data.data;
      });
      },

      getIsubmodeList () {
        this.isubmodeList = [{"key":0,"value":"定额模式"},{"key":1,"value":"综合单价模式"}];
      }


    },


    created () {

      this.getNClist();
      this.getProjectlist();
      this.getContractTypeList();
      this.getIsubmodeList();

      //新增
      if (this.$route.query.mark == 0) {
        this.formItem.firstpartyId = this.$route.query.firstpartyIdmodel;
        this.formItem.contracttypeId = this.$route.query.contracttypeId;
        //this.formItem.projectId= this.$route.query.projectId;
      }

      //修改
      if (this.$route.query.mark == 1) {
        var settleId = this.$route.query.settleId;
        this.getEditMessage(settleId);
      }
    }
  }
</script>
<style scoped>
  .error_border{
    border: 1px  #ff3300;
  }
  .error_border2{
    border: 1px  solid #ff3300;
  }
</style>