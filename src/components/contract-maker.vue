<template>
  <div class="contractMaker">
    <Row class="layout-content">
      <i-col span="4" class="left-menu">
        <leftMenu v-on:handleChange="handleChange" :menuListData="menuListData"/>
      </i-col>
      <i-col span="20">
        <div class="contractMakerRight">
          <div class="contractHeadContainer">
            <div class="formItemsContainer">
              <div class="formItemsContainerHeader">
                合同表头选择
              </div>
              <div class="formItemsContainerBody paddingClear">
                <div class="classify" v-for="contractHead in contractHeadItems" :key="contractHead.id">
                  <div class="classifyTitle">
                    <span class="classifyTab">&nbsp;</span><span class="classifyName">{{contractHead.name}}</span>
                    <div class="checkAll">
                      <Checkbox
                        :indeterminate="contractHead.indeterminate"
                        :value="contractHead.checkAll"
                        @click.prevent.native="handleCheckAll('head',contractHead.id)">全选
                      </Checkbox>
                    </div>
                  </div>
                  <div class="classifyCb">
                    <Checkbox-group v-model="checkedHeadItems[contractHead.id]"
                                    @on-change="checkAllGroupChange('head',contractHead.id)">
                      <Checkbox v-for="item in contractHead.items" :key="item.id" :label="item.id">
                        <span>{{item.name}}</span>
                      </Checkbox>
                    </Checkbox-group>
                  </div>
                </div>
              </div>
              <div class="formItemsContainerFooter">
                <Button type="info" @click="showCheckModelDialog('head')" style="width: 200px" icon="plus">添加到模块
                </Button>
              </div>
            </div>
            <div class="contractModelsContainer">
              <div class="contractModelsContainerHeader">
                合同表头模块列表
              </div>
              <div class="contractModelsContainerBody">
                <div class="noData" v-show="noContractHeadData">
                  <div class="icon"><i class="iconfont icon-yqf-liebiaoqueshengyemian"></i></div>
                  <div class="noDataMessage">暂无合同数据</div>
                </div>
                <draggable :list="headModelList" @start="drag=true" @end="drag=false">
                  <Card v-for="model in headModelList" key="model.id" style="margin-bottom: 10px" class="modelCard">
                    <p slot="title">{{model.name}}</p>
                    <a href="#" slot="extra" @click.prevent="removeModel('head',model.id)">
                      <Icon type="close"></Icon>
                    </a>
                    <draggable :list="model.modelItems" @start="drag=true" @end="drag=false">
                      <!--<Tag closable v-for="item in model.modelItems" key="item" @on-close="removeModelItem(item.id,model.id)">-->
                      <!--{{item.name}}-->
                      <!--</Tag>-->
                      <div v-for="item in model.modelItems" key="item.id" class="modelItemTag">
                        {{item.name}}
                        <i class="ivu-icon ivu-icon-ios-close-empty"
                           @click="removeModelItem('head',item.id,model.id,item.classifyId)"></i>
                      </div>
                    </draggable>
                  </Card>
                </draggable>
              </div>
            </div>
          </div>

          <div class="contractBodyContainer">
            <div class="formItemsContainer">
              <div class="formItemsContainerHeader">
                合同表体选择
              </div>
              <div class="formItemsContainerBody paddingClear">
                <div class="classify" v-for="contractBody in contractBodyItems" :key="contractBody.id">
                  <div class="classifyTitle">
                    <span class="classifyTab">&nbsp;</span><span class="classifyName">{{contractBody.name}}</span>
                    <div class="checkAll">
                      <Checkbox
                        :indeterminate="contractBody.indeterminate"
                        :value="contractBody.checkAll"
                        @click.prevent.native="handleCheckAll('body',contractBody.id)">全选
                      </Checkbox>
                    </div>
                  </div>
                  <div class="classifyCb">
                    <Checkbox-group v-model="checkedBodyItems[contractBody.id]"
                                    @on-change="checkAllGroupChange('body',contractBody.id)">
                      <Checkbox v-for="item in contractBody.items" :key="item.id" :label="item.id">
                        <span>{{item.name}}</span>
                      </Checkbox>
                    </Checkbox-group>
                  </div>
                </div>
              </div>
              <div class="formItemsContainerFooter">
                <Button type="info" @click="showCheckModelDialog('body')" style="width: 200px" icon="plus">添加到模块
                </Button>
              </div>
            </div>
            <div class="contractModelsContainer">
              <div class="contractModelsContainerHeader">
                合同表体模块列表
              </div>
              <div class="contractModelsContainerBody">
                <div class="noData" v-show="noContractBodyData">
                  <div class="icon"><i class="iconfont icon-yqf-liebiaoqueshengyemian"></i></div>
                  <div class="noDataMessage">暂无合同数据</div>
                </div>
                <draggable :list="bodyModelList" @start="drag=true" @end="drag=false">
                  <Card v-for="model in bodyModelList" key="model.id" style="margin-bottom: 10px" class="modelCard">
                    <p slot="title">{{model.name}}</p>
                    <a href="#" slot="extra" @click.prevent="removeModel('body',model.id)">
                      <Icon type="close"></Icon>
                    </a>
                    <div class="tableContainer">
                      <div class="tableHeader" :style="{'width':model.width}">
                        <draggable :list="model.modelItems" @start="drag=true" @end="drag=false">
                          <div v-for="item in model.modelItems" key="item.id">{{item.name}}
                            <i class="ivu-icon ivu-icon-ios-close-empty"
                               @click="removeModelItem('body',item.id,model.id,item.classifyId)"></i>
                          </div>
                        </draggable>
                      </div>
                      <div class="tableBody" :style="{'width':model.width}">
                        <div v-for="formItem in model.modelItems" key="formItem"></div>
                      </div>
                    </div>
                  </Card>
                </draggable>
              </div>
            </div>
          </div>
          <div class="submitContainer">
            <Button type="info" style="width: 300px" :loading="loading" @click="submit()">
              <span v-if="!loading">提交</span>
              <span v-else>Loading...</span>
            </Button>
          </div>
          <Modal
            v-model="showModelListDialog"
            title="选择模块"
            @on-ok="" class="modelListDialog" width="300">
            <div class="noData" v-show="noContractData">
              <div class="icon"><i class="iconfont icon-yqf-liebiaoqueshengyemian"></i></div>
              <div class="noDataMessage">暂无合同数据</div>
            </div>
            <ul>
              <li v-for="model in modelList"><a @click.prevent="checkModel(model.id)">{{model.name}}</a></li>
              <li class="modelNameContainer" v-show="isShowNewModelInput">
                <div><input type="text" v-model="newModelName" placeholder="请输入合同模块名称..." ref="newModelInput"
                            @keyup.enter="addNewModelSubmit()"/></div>
              </li>
              <li class="addNewModel" v-show="!isShowNewModelInput && isShowAddNewModel"><a href=""
                                                                                            @click.prevent="showNewModelInput">
                <Icon type="ios-plus-empty"></Icon>
              </a></li>
              <li class="addNewModel" v-show="isShowNewModelInput"><a href="" @click.prevent="addNewModelSubmit()">
                确定
              </a></li>
            </ul>
            <div slot="footer">
            </div>
          </Modal>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
  import router from '../router';
  import draggable from 'vuedraggable';
  import api from '../utils/api';
  import axios from 'axios';
  import leftMenu from './vertical-menu.vue';
  export default {
    data () {
      return {
        headModelList: [],
        //[{'name':'','modelItems':[{'id':123,'name':'','classifyId':''}],'id':''}]
        bodyModelList: [],
        //[{'name':'','modelItems':[],'id':'','classifyId':''}]
        contractHeadItems: [{
          'name': '分类一head', 'items': [
            {'name': '项目名称', 'id': 'projectname'},
            {'name': '采购编号', 'id': 'supcode'},
            {'name': '合同编号', 'id': 'contractcode'},
            {'name': '甲方名称', 'id': 'parta'},
            {'name': '乙方名称', 'id': 'partb'},
            {'name': '货物名称', 'id': 'huowu'},
            {'name': '型号规格', 'id': 'xhgg'},
            {'name': '合同金额', 'id': 'htje'},
          ],
          'id': '1',
          'indeterminate': false,
          'checkAll': false
        }, {
          'name': '分类二head', 'items': [
            {'name': '项目名称', 'id': 'projectname'},
            {'name': '采购编号', 'id': 'supcode'},
            {'name': '合同编号', 'id': 'contractcode'},
            {'name': '甲方名称', 'id': 'parta'},
            {'name': '乙方名称', 'id': 'partb'},
            {'name': '货物名称', 'id': 'huowu'},
            {'name': '型号规格', 'id': 'xhgg'},
            {'name': '合同金额', 'id': 'htje'},
          ],
          'id': '2',
          'indeterminate': false,
          'checkAll': false
        }
        ],
        checkedHeadItems: {'1': [], '2': []},
        //{'1':['projectname','supcode','contractcode'],'1':['projectname','supcode','contractcode']}
        contractBodyItems: [{
          'name': '分类一', 'items': [
            {'name': '项目名称', 'id': 'projectname'},
            {'name': '采购编号', 'id': 'supcode'},
            {'name': '合同编号', 'id': 'contractcode'},
            {'name': '甲方名称', 'id': 'parta'},
            {'name': '乙方名称', 'id': 'partb'},
            {'name': '货物名称', 'id': 'huowu'},
            {'name': '型号规格', 'id': 'xhgg'},
            {'name': '合同金额', 'id': 'htje'},
          ],
          'id': '1',
          'indeterminate': false,
          'checkAll': false
        }, {
          'name': '分类二', 'items': [
            {'name': '项目名称', 'id': 'projectname'},
            {'name': '采购编号', 'id': 'supcode'},
            {'name': '合同编号', 'id': 'contractcode'},
            {'name': '甲方名称', 'id': 'parta'},
            {'name': '乙方名称', 'id': 'partb'},
            {'name': '货物名称', 'id': 'huowu'},
            {'name': '型号规格', 'id': 'xhgg'},
            {'name': '合同金额', 'id': 'htje'},
            {'name': '项目名称1', 'id': 'projectname1'},
            {'name': '采购编号1', 'id': 'supcode1'},
            {'name': '合同编号1', 'id': 'contractcode1'},
            {'name': '甲方名称1', 'id': 'parta1'},
            {'name': '乙方名称1', 'id': 'partb1'},
            {'name': '货物名称1', 'id': 'huowu1'},
            {'name': '型号规格1', 'id': 'xhgg1'},
            {'name': '合同金额1', 'id': 'htje1'},
            {'name': '项目名称2', 'id': 'projectname2'},
            {'name': '采购编号2', 'id': 'supcode2'},
            {'name': '合同编号2', 'id': 'contractcode2'},
            {'name': '甲方名称2', 'id': 'parta2'},
            {'name': '乙方名称2', 'id': 'partb2'},
            {'name': '货物名称2', 'id': 'huowu2'},
            {'name': '型号规格2', 'id': 'xhgg2'},
            {'name': '合同金额2', 'id': 'htje2'},
            {'name': '项目名称3', 'id': 'projectname3'},
            {'name': '采购编号3', 'id': 'supcode3'},
            {'name': '合同编号3', 'id': 'contractcode3'},
            {'name': '甲方名称3', 'id': 'parta3'},
            {'name': '乙方名称3', 'id': 'partb3'},
            {'name': '货物名称3', 'id': 'huowu3'},
            {'name': '型号规格3', 'id': 'xhgg3'},
            {'name': '合同金额3', 'id': 'htje3'}
          ],
          'id': '2',
          'indeterminate': false,
          'checkAll': false
        }, {
          'name': '分类三', 'items': [
            {'name': '项目名称', 'id': 'projectname'},
            {'name': '采购编号', 'id': 'supcode'},
            {'name': '合同编号', 'id': 'contractcode'},
            {'name': '甲方名称', 'id': 'parta'},
            {'name': '乙方名称', 'id': 'partb'},
            {'name': '货物名称', 'id': 'huowu'},
            {'name': '型号规格', 'id': 'xhgg'},
            {'name': '合同金额', 'id': 'htje'}
          ],
          'id': '3',
          'indeterminate': false,
          'checkAll': false
        }
        ],
        checkedBodyItems: {'1': [], '2': []},
        //{'1':['projectname','supcode','contractcode'],'1':['projectname','supcode','contractcode']}
        addedModelType: 'head',
        showModelListDialog: false,
        isShowNewModelInput: false,
        newModelName: '',
        modelList: [],
        //合同信息
        contractData: {},
        loading: false,
        menuListData: []
      }
    },
    components: {
      draggable,
      leftMenu
    },
    methods: {
      //合同条目添加到合同模块之后，从中条目中删除
      removeContractItems(){
        //合同模块
        var contractItems = this.contractHeadItems
          , toRemoveItems = this.checkedHeadItems;
        if (this.addedModelType == 'body') {
          contractItems = this.contractBodyItems;
          toRemoveItems = this.checkedBodyItems;
        }
        for (var i = 0; i < contractItems.length; i++) {
          var classifyId = contractItems[i].id
            , toRemoveClassifyItems = toRemoveItems[classifyId];
          for (var j = 0; j < contractItems[i].items.length; j++) {
            if (toRemoveClassifyItems instanceof Array && toRemoveClassifyItems.indexOf(contractItems[i].items[j].id) >= 0) {
              contractItems[i].items.splice(j, 1);
              j--;
            }
          }
        }
      },
      //清空checkedHeadItems和checkedBodyItems
      removeCheckedModelItems(){
        var checkedItems = this.checkedHeadItems;
        if (this.addedModelType == 'body') {
          checkedItems = this.checkedBodyItems;
        }
        for (var classify in checkedItems) {
          if (this.addedModelType == 'head') {
            this.checkedHeadItems[classify] = [];
          } else {
            this.checkedBodyItems[classify] = [];
          }
        }

      },
      //显示添加模块弹出框
      showCheckModelDialog(flag){
        this.addedModelType = flag;
        //获取选中的合同条目
        var checkedModelItems = this.getCheckedModelItemsByType();
        if (this.addedModelType == 'head') {
          if (this.crossClassifyValid(checkedModelItems) == 0) {
            this.$Message.warning('请选择合同条目...');
            return;
          }
        } else {
          if (this.crossClassifyValid(checkedModelItems) == 0) {
            this.$Message.warning('请选择合同条目...');
            return;
          }
          if (this.crossClassifyValid(checkedModelItems) > 1) {
            this.$Message.warning('不能跨分类选择...');
            return;
          }
        }
        this.getModuleList();
        this.isShowNewModelInput = false;
        this.showModelListDialog = true;
      },
      //点击模块列表项，添加条目到模块
      checkModel(modelId){
        var checkedModelItems = this.getCheckedModelItemsByType();
        var modelList = this.getModelListByType();
        var _this = this;
        modelList.map(function (item) {
          if (item.id == modelId) {
            for (var classifyId in checkedModelItems) {
              item.modelItems = item.modelItems.concat(checkedModelItems[classifyId]);
            }
            item.width = _this.getWidth(item.modelItems.length);
          }
        })
        _this.removeContractItems()
        _this.removeCheckedModelItems();
        this.showModelListDialog = false;
      },
      //显示添加模块输入框
      showNewModelInput(){
        this.isShowNewModelInput = true;
        this.$refs.newModelInput.focus();
        this.newModelName = '';
      },
      //点击确定添加模块
      addNewModelSubmit(){
        if (this.newModelName == '') {
          this.$Message.warning('请输入模块名称...');
          return;
        }
        //合同模块
        var modelList = this.getModelListByType();
        //合同模块内容
        var checkedModelItems = this.getCheckedModelItemsByType();
        this.showModelListDialog = false;
        var modelObj = {'name': this.newModelName, 'id': modelList.length, 'modelItems': []}
        for (var classifyId in checkedModelItems) {
          modelObj.modelItems = modelObj.modelItems.concat(checkedModelItems[classifyId]);
          modelObj['classifyId'] = classifyId;
        }
        modelObj.width = this.getWidth(modelObj.modelItems.length);
        modelList.push(modelObj);
        this.removeContractItems();
        this.removeCheckedModelItems();
      },
      //模块删除
      removeModel(flag, modelId){
        //合同模块
        var modelList = this.headModelList, recycleItems = [], contractItems = this.contractHeadItems;
        if (flag == 'body') {
          modelList = this.bodyModelList;
          contractItems = this.contractBodyItems;
        }
        recycleItems = this.getRecycleModelItems(modelList, modelId);
        recycleItems.map(rItem => {
          contractItems.map(cItem => {
            if (rItem.classifyId == cItem.id) {
              delete rItem.classifyId;
              cItem.items.push(rItem);
            }
          })
        })
        if (flag == 'head') {
          this.headModelList = modelList.filter(function (item) {
            return item.id != modelId;
          })
        }
        if (flag == 'body') {
          this.bodyModelList = modelList.filter(function (item) {
            return item.id != modelId;
          })
        }
      },
      //模块item删除
      removeModelItem(flag, itemId, modelId, classifyId){
        //存在分类ID则为表体数据
        var toRecItem, moduleList = this.headModelList,
          contractItems = this.contractHeadItems;
        if (flag == 'body') {
          moduleList = this.bodyModelList;
          contractItems = this.contractBodyItems;
        }
        //删除对应合同模块的item
        moduleList.map(modelItem => {
          if (modelItem.id == modelId) {
            //重置table宽度
            modelItem.width = parseInt(modelItem.width) - 150 + 'px';
            modelItem.modelItems = modelItem.modelItems.filter(item => {
              //获取要回收的item
              if (item.id == itemId) {
                toRecItem = item;
              }
              return item.id !== itemId
            });
          }
        });
        //回收到对应分类的items
        contractItems.map(item => {
          if (item.id == classifyId) {
            item.items.push(toRecItem);
          }
        });
        //如果当前合同模块的item为空，则删除当前模块
        if (flag == 'head') {
          this.headModelList = moduleList.filter(modelItem => {
            return modelItem.modelItems.length > 0;
          });
        } else {
          this.bodyModelList = moduleList.filter(modelItem => {
            return modelItem.modelItems.length > 0;
          });
        }
      },
      //获取表体宽度
      getWidth(len){
        return parseInt(len * 150) + parseInt(len) + 1 + 'px';
      },
      //根据类型（表头、表体）获取已选中的合同条目
      getCheckedModelItemsByType(){
        var checkedItems = this.checkedHeadItems, modelItems = this.contractHeadItems, checkedItemsObjList = {};
        if (this.addedModelType == 'body') {
          checkedItems = this.checkedBodyItems;
          modelItems = this.contractBodyItems;
        }
        for (var i = 0; i < modelItems.length; i++) {
          var checkedClassifyItems = checkedItems[modelItems[i].id]
            , classfifyItems = modelItems[i].items;
          for (var j = 0; j < checkedClassifyItems.length; j++) {
            for (var n = 0; n < classfifyItems.length; n++) {
              if (checkedClassifyItems[j] == classfifyItems[n].id) {
                if (!checkedItemsObjList[modelItems[i].id]) {
                  checkedItemsObjList[modelItems[i].id] = [];
                }
                //为模块的条目添加分类ID，删除模块或者条目时，根据此分类ID匹配
                classfifyItems[n].classifyId = modelItems[i].id;
                checkedItemsObjList[modelItems[i].id].push(classfifyItems[n]);
              }
            }
          }
        }

        return checkedItemsObjList;
      },
      //根据类型（表头、表题）获取已添加模块列表
      getModelListByType(){
        var modelList = this.headModelList;
        if (this.addedModelType == 'body') {
          modelList = this.bodyModelList;
        }
        return modelList;
      },
      //根据分类ID（页签ID）获取该页签数据
      getContractItemsByClassifyId(flag, classifyId){
        var contractItems = this.contractHeadItems;
        if (flag == 'body') {
          contractItems = this.contractBodyItems;
        }
        return contractItems.filter(function (item) {
          return item.id == classifyId;
        }).length > 0 ? contractItems.filter(function (item) {
          return item.id == classifyId;
        })[0] : {};
      },
      //全选复选框状态处理
      handleCheckAll(flag, classifyId){
        var currentItems = this.getContractItemsByClassifyId(flag, classifyId),
          checkedItems = this.checkedHeadItems;
        if (flag == 'body') {
          checkedItems = this.checkedBodyItems;
        }
        if (currentItems.indeterminate) {
          currentItems.checkAll = false;
        } else {
          currentItems.checkAll = !currentItems.checkAll;
        }
        currentItems.indeterminate = false;
        if (currentItems.checkAll) {
          checkedItems[classifyId] = currentItems.items.map(function (item) {
            return item.id;
          });
        } else {
          checkedItems[classifyId] = [];
        }
      },
      //复选框状态处理
      checkAllGroupChange (flag, classifyId) {
        var currentItems = this.getContractItemsByClassifyId(flag, classifyId);
        var currentCheckedItems = this.checkedHeadItems[classifyId];
        if (flag == 'body') {
          currentCheckedItems = this.checkedBodyItems[classifyId];
        }
        if (currentCheckedItems.length === currentItems.items.length) {
          currentItems.indeterminate = false;
          currentItems.checkAll = true;
        } else if (currentCheckedItems.length > 0) {
          currentItems.indeterminate = true;
          currentItems.checkAll = false;
        } else {
          currentItems.indeterminate = false;
          currentItems.checkAll = false;
        }
      },
      //验证是否跨分类选择合同条目
      crossClassifyValid(checkedModelItems){
        var classifies = 0;
        for (var item in checkedModelItems) {
          if (checkedModelItems[item].length > 0) {
            classifies++;
          }
        }
        return classifies;
      },
      //删除模块时，获取要回收的模块item
      getRecycleModelItems(modelList, modelId){
        var recycleItems = [];
        modelList.map(function (item) {
          if (item.id == modelId) {
            recycleItems = [].concat(item.modelItems);
          }
        });
        return recycleItems;
      },
      //提交合同模板数据
      submit(){
        this.loading = true;
        this.formatRequestData();
        var templetUrl = api.templet()
        var _this = this;
        debugger
        this.ajax.post(templetUrl, this.contractData, (data) => {
          _this.loading = false;
          if (data.error_code == 200) {
            _this.$Message.success('保存成功');
          }
        });
      },
      //格式化合同条目数据
      formatResponseBtData(resModuleData){
        var headItemData = [], bodyItemData = [], obj = {items: []};
        //合同模块
        resModuleData.billTempletTList.map(module => {
          obj = {items: []}
          obj.id = module.tabCode;
          obj.name = module.tabName;
          //合同字段
          module.billTempletBList.map(item => {
            obj.items.push({
              'id': item.id,
              'name': item.defaultShowName,
              'tableCode': item.tableCode,
              'tableName': item.tableName,
              'hyperLinkFlag': item.hyperLinkFlag,
              'inputLength': item.inputLength,
              'itemKey': item.itemKey,
              'itemType': item.itemType,
              'listShowFlag': item.listShowFlag,
              'dataType': item.dataType,
              'reftype' : item.reftype,
              'showflag' : item.showflag
            });
          });
          obj.indeterminate = false;
          obj.checkAll = false;
          if (module.pos == 0) {
            headItemData.push(obj);
          }
          if (module.pos == 1) {
            bodyItemData.push(obj);
          }
        });
        this.contractBodyItems = bodyItemData;
        this.contractHeadItems = headItemData;
        //保存合同信息
        this.contractData = {
          'billTempletCaption': resModuleData.billTempletCaption,
          'billTempletName': resModuleData.billTempletName,
          'billTypeCode': resModuleData.billTypeCode,
          'billTempletTList': [],
          'billTempletBList': []
        }
      },
      //格式化合同模块数据
      formatResponseSmData(resModuleData){
        var headModuleData = [], bodyModuleData = [], obj = {modelItems: []};
        //合同模块
        resModuleData.billTempletTList.map(module => {
          obj = {modelItems: []}
          obj.id = module.tabCode;
          obj.name = module.tabName;
          //合同字段
          debugger
          module.billTempletBList.map(item => {
            obj.modelItems.push({
              'id': item.id,
              'name': item.defaultShowName,
              'tableCode': item.tableCode,
              'tableName': item.tableName,
              'hyperLinkFlag': item.hyperLinkFlag,
              'inputLength': item.inputLength,
              'itemKey': item.itemKey,
              'itemType': item.itemType,
              'listShowFlag': item.listShowFlag,
              'classifyId': item.tableCode,
              'dataType': item.dataType,
              'reftype' : item.reftype,
              'showflag' : item.showflag
            });
          });
          obj.indeterminate = false;
          obj.checkAll = false;
          if (module.pos == 0) {
            headModuleData.push(obj);
          }
          if (module.pos == 1) {
            //表体以表格形式展示，须设置表格宽度才能支持滚动条
            obj.width = this.getWidth(obj.modelItems.length);
            obj.classifyId = module.tabCode;
            bodyModuleData.push(obj);
          }
        });
        this.headModelList = headModuleData;
        this.bodyModelList = bodyModuleData;
      },
      //格式化向后台传递参数数据
      formatRequestData(){
        this.buildContractData('head');
        this.buildContractData('body');
      },
      //构建合同数据（保存合同模板参数数据）
      buildContractData(flag){
        var moduleData = this.headModelList,
          contractData = this.contractData, obj = {};
        if (flag == 'body') {
          moduleData = this.bodyModelList;
        }
        moduleData.map((module, index) => {
          obj = {};
          //合同表头表题标示
          obj.pos = flag == 'head' ? 0 : 1;
          obj.smTableCode = flag + index;
          obj.tabIndex = index;
          obj.smTableName = module.name;
          //保存模块的tabcode
          if (flag == 'head') {
            obj.tabCode = 'head' + index;
            obj.tabName = module.name;
          } else {
            obj.tabCode = module.classifyId;
            obj.tabName = module.name;
          }
          if (contractData.billTempletTList && contractData.billTempletTList instanceof Array) {
            contractData.billTempletTList.push(obj);
          }
          module.modelItems.map((modelItem, index2) => {
            obj = {};
            obj.defaultShowName = modelItem.name;
            obj.hyperLinkFlag = modelItem.hyperLinkFlag;
            obj.inputLength = modelItem.inputLength;
            obj.itemKey = modelItem.itemKey;
            obj.listShowFlag = modelItem.listShowFlag;
            obj.showflag = modelItem.showflag;
            obj.reftype = modelItem.reftype;
            obj.smTableCode = flag + index;
            obj.smTableName = flag + index;
            obj.tableCode = modelItem.tableCode;
            obj.tableName = modelItem.tableName;
            obj.pos = flag == 'head' ? 0 : 1;
            obj.dataType = modelItem.dataType;
            if (contractData.billTempletBList && contractData.billTempletBList instanceof Array) {
              contractData.billTempletBList.push(obj);
            }
          })
        })
      },
      //初始化CheckedItems
      initCheckedItems(){
        var headCheckedObj = {}, bodyCheckedObj = {};
        this.contractHeadItems.map(item => {
          headCheckedObj[item.id] = [];
        });
        this.contractBodyItems.map(item => {
          bodyCheckedObj[item.id] = [];
        });
        this.checkedHeadItems = headCheckedObj;
        this.checkedBodyItems = bodyCheckedObj;
      },
      //获取已添加的模块列表
      getModuleList(){
        var modelList = [];
        if (this.addedModelType == 'head') {
          modelList = [].concat(this.headModelList);
        } else {
          modelList = [];
          for (var classifyId in this.checkedBodyItems) {
            if (this.checkedBodyItems[classifyId].length > 0) {
              for (var i = 0; i < this.bodyModelList.length; i++) {
                if (this.bodyModelList[i].classifyId == classifyId) {
                  modelList.push(this.bodyModelList[i]);
                }
              }
            }
          }
        }
        this.modelList = modelList;
      },
      //获取表体数据
      getSmData(billCode){
//        var billCode = this.$route.query.billCode;
        var smTempletUrl = api.templet() + '/' + billCode;
        return axios.get(smTempletUrl);
      },
      //获取表头数据
      getBtData(billCode){
//        var billCode = this.$route.query.billCode;
        var btTempletUrl = api.btTemplet() + '/' + billCode;
        return axios.get(btTempletUrl);
      },
      syncNcTempData(){
        var billCode = this.$route.query.billCode;
        var btTempletUrl = api.loadTemplet() + '?code=' + billCode;
        var _this = this;
        var p = new Promise(function (resove, reject) {
          axios.get(btTempletUrl).then(function (res) {
            if (res.data.error_code != 200) {
              reject(res);
            }
            _this.$Message.success('同步完成！')
            resove(res);
          })
        }).then(function (res) {
          _this.getContractData();
        }).catch(function (error) {
          if (error.message) {
            _this.$Message.error(error.message)
          }
          else if (error.data.error_msg) {
            _this.$Message.error(error.data.error_msg)
          }
        });
      },
      getContractData(billCode){
        var _this = this;
        axios.all([_this.getBtData(billCode), _this.getSmData(billCode)])
          .then(axios.spread(function (btData, smData) {
            //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
            if (btData.data.error_code != 200) {
              _this.$Message.error(btData.data.error_msg)
              return;
            }
            if (smData.data.error_code != 200) {
              _this.$Message.error(smData.data.error_msg)
              return;
            }
            if (btData.data.data) {
              _this.formatResponseBtData(btData.data.data);
              _this.initCheckedItems();
            }
            if (smData.data.data) {
              _this.formatResponseSmData(smData.data.data);
            }else{
              _this.headModelList = [];
              _this.bodyModelList = [];
            }
          })).catch(function (error) {
          _this.$Message.error(error.message)
        })
      },
      getMenuList(){
        const url = api.contractList(),
          data = {
            start: 0,
            length: 10,
            search: ''
          };
        var _this = this;
        this.ajax.get(url, data, (data) => {
          var obj = {};
          if (data.data.list instanceof Array) {
            data.data.list.map(item => {
              obj = {};
              obj.text = item.templetCaption;
              obj.templetCode = item.templetCode;
              obj.isActive = false;
              this.menuListData.push(obj);
            })
          }
        });
      },
      handleChange(index){
        var billCode;
        this.menuListData.map(function (v, i) {
          if (index == i) {
            v.isActive = true;
            billCode = v.templetCode;
          } else {
            v.isActive = false;
          }
        });
        this.getContractData(billCode);
      }
    },
    computed: {
      noContractHeadData()
      {
        return this.headModelList.length == 0;
      },
      noContractBodyData()
      {
        return this.bodyModelList.length == 0;
      },
      noContractData(){
        return this.modelList.length == 0;
      },
      isShowAddNewModel(){
        if (this.addedModelType == 'head') {
          return true;
        }
        var classifyId, isHasCurrentClassifyModel = true;
        for (var item in this.checkedBodyItems) {
          if (this.checkedBodyItems[item].length > 0) {
            classifyId = item;
          }
        }
        for (var i = 0; i < this.bodyModelList.length; i++) {
          if (this.bodyModelList[i].classifyId == classifyId) {
            isHasCurrentClassifyModel = false;
          }
        }
        return isHasCurrentClassifyModel;
      }
    },
    created () {
      this.getMenuList();
//      this.getContractData();
    }
  }
</script>
<style scoped lang="less">
  @import "../assets/css/contract-maker.less";
</style>
