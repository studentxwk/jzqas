<template>
  <Form :model="formItem" inline :label-width="100">
    <div style="text-align: left;margin-left:10px;">
      <FormItem label="NC系统">
        <Select v-model="formItem.firstpartyId" style="width: 200px;" @on-change="NCselectedHandler">
          <Option v-for="item in nclist" :value="item.id" :key="item.id">{{ item.corpName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="项目">
        <Input v-model="formItem.projectName" style="width: 200px;">
        <Button slot="append" icon="ios-search" style="width: 20px;" @click="showProjectListModal()"></Button>
        </Input>
      </FormItem>
    </div>
    <div style="text-align: left;margin-left:10px;">
      <FormItem label="计费开始日期">
        <DatePicker v-model="startTime" type="date" placeholder="选择日期" style="width: 200px"
                    :format="yyyy-MM-dd" @on-change="(value) => dateHandler(value,'startTime')"></DatePicker>
      </FormItem>
      <FormItem label="计费结束日期">
        <DatePicker v-model="endTime" type="date" placeholder="选择日期" style="width: 200px" :format="yyyy-MM-dd"
                    @on-change="(value) => dateHandler(value,'endTime')"></DatePicker>
      </FormItem>
    </div>
    <div style="text-align: left;margin-left:150px;">
      <FormItem>
        <Button type="primary" @click="save">提交</Button>
        <Button type="ghost" style="margin-left: 8px" @click="cancel">取消</Button>
      </FormItem>
    </div>
    <Modal
      v-model="openModal"
      width="460"
      :closable="true"
      :mask-closable="false"
      title="项目"
    >
      <Table highlight-row :columns="proColumn" :data="projectData" @on-row-click="rowClickHandler"></Table>
      <div style="margin: 10px;overflow: hidden">
        <p style="float: left;line-height: 32px;font-size: 14px;">
          当前展示 {{ openListFrom }} 到 {{ openListFrom + openListTo }} 条，共 {{ openListTotal }} 条
        </p>
        <div style="float: right;">
          <Page :total="openListTotal" :page-size="openListTo" @on-change="openChangePage"></Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="openClose" size="large">取消</Button>
      </div>
    </Modal>
  </Form>
</template>
<script>
  import api from '../../utils/api';
  import router from '../../router';
  export default {
    data(){
      return {
        nclist: [],
        formItem: {},
        openModal: false,
        proColumn: [
          {
            title: '项目',
            key: 'projectName'
          }],
        projectData: [],
        uuid: '',
        openListFrom: 0,  // 起始位置
        openListTo: 5,  // 列表长度
        openListTotal: 0,  // 列表总条数,
        costId: '',
        startTime: '',
        endTime: ''
      }
    },
    methods: {
      getNClist() {
        const url = api.getAllFpList();
        var ncData = {
          openKey: 'nc_system',
          search: '',
        }
        this.ajax.get(url, ncData, (data) => {
          this.nclist = data.data;
        });
      },
      NCselectedHandler() {
        const url = api.getFirProject();
        var reqData = {
          firstpartyId: this.formItem.firstpartyId
        }
        this.ajax.get(url, reqData, (data) => {
          this.uuid = data.data;
        });
      },
      getProjectList() {
        const url = api.AllProjectInfo();
        if (!this.uuid) {
          return;
        }
        var reqData = {
          uuid: this.uuid,
          start: this.openListFrom,
          length: this.openListTo,
          search: ''
        }
        this.ajax.get(url, reqData, (data) => {
          this.projectData = data.data.list;
          this.openListTotal = data.data.total;
        });
      },

      save(){//保存开票信息
        if (!this.formItem.firstpartyId) {
          this.$Message.error('请选择NC系统！')
          return;
        }
        if (!this.formItem.projectName) {
          this.$Message.error('请选择项目！')
          return;
        }
        if (!this.formItem.startTime && this.startTime) {
          this.$Message.error('请选择计费开始时间！')
          return;
        }
        if (!this.formItem.endTime && this.endTime) {
          this.$Message.error('请选择计费结束时间！')
          return;
        }
        var reqData = this.formItem, reqUrl = api.addProCost(), _this = this;
        //编辑
        if (this.costId) {
          this.formItem.id = this.costId;
          if (!this.formItem.startTime) {
            this.formItem.startTime = this.startTime;
          }
          if (!this.formItem.endTime) {
            this.formItem.endTime = this.endTime;
          }
        }
        var _this = this;
        this.ajax.post(reqUrl, reqData, (data) => {
          if (data.error_code == 200) {
            _this.$router.push({
              'path': '/SystemManage/projectBill'
            });
          } else {
            _this.$Message.error(data.error_msg);
          }
        });
      },
      cancel(){//取消和返回
        this.$router.push({
          'path': '/SystemManage/projectBill'
        });
      },
      showProjectListModal(){
        this.openModal = !this.openModal;
        this.getProjectList();
      },
      openClose(){
        this.openModal = false;
      },
      openChangePage(n) {  // 切换分页，重载数据
        this.openListFrom = this.openListTo * (n - 1);
        this.getProjectList();
      },
      rowClickHandler(rowData){
        console.log('rowData', rowData);
        //项目名称
        this.formItem.projectName = rowData.projectName;
        //项目ID
        this.formItem.projectId = rowData.pk_project;
        //关闭窗口
        this.openModal = false;
      },
      dateHandler(value, flag){
        this.formItem[flag] = value;
      },
      //编辑，获取详情
      getCostDetail(){
        if (this.costId) {
          var reqData = {'costId': this.costId}, reqUrl = api.getProCost(), _this = this;
          console.log("reqData", reqData)
          this.ajax.get(reqUrl, reqData, (data) => {
            this.formItem = data.data;
            this.startTime = data.data.startTime;
            this.endTime = data.data.endTime;
          });
        }
      }
    },
    computed: {}
    ,
    created(){
      this.costId = this.$route.query.id;
      if (this.costId) {
        this.getCostDetail();
      }
      this.getNClist();
    }
  }

</script>
<style scoped lang="less">
  @import "../../assets/css/open-edit.less";
</style>
