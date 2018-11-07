<template>
  <div class="contractEntry">
    <div class="contractModule" v-for="module in contractHeadModules" :key="module.id">
      <div class="moduleHeader">
        {{module.name}}<span class="extend" :class="{up:!module.slideDown}" @click="slide(module.id)"><i
        class="iconfont icon-down"></i></span>
      </div>
      <ul class="moduleItemList" :class="{ show: module.slideDown, 'hide': !module.slideDown }">
        <li class="moduleItem" v-for="item in module.items">
          <span class="itemName" v-if="item.showFlag != 0">{{item.name}}</span>
          <div class="formItemContainer">
            <Checkbox v-model="item.value" v-if="item.type == 6"></Checkbox>
            <span v-else style="line-height: 32px;">
              {{item.value}}
            </span>
          </div>
        </li>
        <div class="clear">
        </div>
      </ul>
    </div>
    <div class="contractModule">
      <Tabs value="name1" @on-click="clickTab">
        <Tab-pane v-for="module in contractBodyModules" :key="module.id" :label="module.name" :name="module.id">
          <table class="contractBodyTable" :style="{width:module.items.length * 150 + 'px'}">
            <tr>
              <th v-if="module.tabCode == 'fbfyd' && billCode == 'H5A1'" class="tbHeader" style="width:100px;">
                等级标示
              </th>
              <th v-for="item in module.items" class="tbHeader">{{item.name}}</th>
            </tr>
            <tr v-for="(moduleData,index) in contractBodyModulesData[module.id]"
                v-show="moduleData.show == true || moduleData.show == undefined"
                @click="rowSelected(moduleData.tabCode,moduleData.grade,module.id)">
              <td class='level' v-if="module.tabCode == 'fbfyd' && billCode == 'H5A1'"
                  :class="{selected:moduleData.selected}">
                <span v-if='moduleData.pgrade' :style="{'left':moduleData.leftPx+'px'}">
					      </span>
                <div v-else>
                  <span class="sButton" v-show='moduleData.spread'
                        @click='showOrHide("show",module.id,moduleData.grade)'>+</span>
                  <span class="sButton" v-show='!moduleData.spread'
                        @click='showOrHide("hide",module.id,moduleData.grade)'>-</span>
                </div>
              </td>
              <td v-for="(md,key) in moduleData.tdData" @dblclick="edit(module.id,key,index)"
                  :class="{selected:moduleData.selected}"><span v-if="!md.isEdit">{{md.value}}</span>
                <Input v-model="md.value" v-if="md.isEdit&&md.type == 0" :placeholder="md.name"
                       @on-blur="editBlur(module.id,key,index)"></Input>
                <Input v-model="md.value" v-if="md.isEdit&&md.type == 2" :placeholder="md.name"
                       @on-blur="editBlur(module.id,key,index)"
                       @input="tbCountAmount(module.id, index, key)"></Input>
                <Checkbox v-model="md.value" v-else-if="md.isEdit&&md.type == 6"></Checkbox>
                <Date-picker v-model="md.value" type="date" placeholder="选择日期"
                             v-else-if="md.isEdit&&md.type == 3" format="yyyy-MM-dd"
                             @on-blur="editBlur(module.id,key,index)"></Date-picker>
              </td>
            </tr>
          </table>
        </Tab-pane>
      </Tabs>
    </div>
    <div class="btn-warp">
      <Modal
        v-model="openModel"
        width="460"
        :closable="false"
        :mask-closable="false"
        title="项目"
      >
        <p slot="header" style="height: auto;text-align:left">
          <span><Input v-model="openSearch" icon="ios-search" placeholder="输入名称搜索..."
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
  </div>
</template>
<script>
  import api from '../utils/api';
  import axios from 'axios';
  import router from '../router';
  export default {
    data () {
      return {
        hideData: {},
        contractHeadModules: [{
          name: '基本信息',
          id: '123',
          items: [{
            name: '合同名称1',
            id: 'contractName',
            type: 'input'
          }, {
            name: '合同编号1',
            id: 'contractNo',
            type: 'input'
          }, {
            name: '合同金额1',
            id: 'contractMoney',
            type: 'input'
          }, {
            name: '项目名称1',
            id: 'projectName',
            type: 'input'
          }, {
            name: '是否合作过',
            id: 'isConsociation',
            type: 'checkbox'
          }],
          slideDown: true
        }, {
          name: '项目信息',
          id: '456',
          items: [{
            name: '合同名称',
            id: 'contractName',
            type: 'input'
          }, {
            name: '合同编号',
            id: 'contractNo',
            type: 'input'
          }, {
            name: '合同金额',
            id: 'contractMoney',
            type: 'input'
          }, {
            name: '项目名称',
            id: 'projectName',
            type: 'input'
          }, {
            name: '是否合作过',
            id: 'isConsociation',
            type: 'checkbox'
          }],
          slideDown: true
        }],
        contractBodyModules: [
          {
            name: '费用单1',
            id: '123',
            items: [{
              name: '编码1',
              id: 'no',
              type: 'input'
            }, {
              name: '名称1',
              id: 'name',
              type: 'input'
            }, {
              name: '合同金额',
              id: 'contractMoney',
              type: 'input'
            }, {
              name: '项目名称',
              id: 'projectName',
              type: 'input'
            }, {
              name: '是否合作过',
              id: 'isConsociation',
              type: 'checkbox'
            }]
          }, {
            name: '合同条款',
            id: '456',
            items: [{
              name: '编码aa',
              id: 'no',
              type: 'input'
            }, {
              name: '名称1',
              id: 'name',
              type: 'input'
            }, {
              name: '合同金额',
              id: 'contractMoney',
              type: 'input'
            }, {
              name: '项目名称',
              id: 'projectName',
              type: 'input'
            }, {
              name: '是否合作过',
              id: 'isConsociation',
              type: 'checkbox'
            }]
          }
        ],
        reqData: {"rowData": []},
        firstpartyId: '',
        contractBodyModulesData: {
          '123': [{
            tdData: {
              'no': {value: 'no', type: 'number', name: '编号1', isEdit: false},
              'name': {value: 'name', type: 'string', name: '名称1', isEdit: false},
              'contractMoney': {value: 'contractMoney', type: 'number', name: '合同金额', isEdit: false},
              'projectName': {value: 'projectName', type: 'string', name: '项目名称', isEdit: false},
              'isConsociation': {value: 'isConsociation', type: 'string', name: '是否合作过', isEdit: false}
            },
            isChecked: false
          }], '456': [{
            tdData: {
              'no': {value: 'bb', type: 'number', name: '编号1', isEdit: false},
              'name': {value: 'name', type: 'string', name: '名称1', isEdit: false},
              'contractMoney': {value: 'contractMoney', type: 'number', name: '合同金额', isEdit: false},
              'projectName': {value: 'projectName', type: 'string', name: '项目名称', isEdit: false},
              'isConsociation': {value: 'isConsociation', type: 'string', name: '是否合作过', isEdit: false}
            },
            isChecked: false
          }]
        },
        currentTabName: '123',
        checkedAll: false,
        isEdit: false,
        //模板编号
        billCode: '',
        //模板ID
        templateId: '',
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
        openSelected: [],  // 选中的行
        openModel: false,
        openSearch: '',
        openColumn: '',
        openData: [],
        curOpenKey: '',
        curRefKey: '',
        openListFrom: 0,  // 起始位置
        openListTo: 10,  // 列表长度
        openListTotal: 0,  // 列表总条数
        currentRow: ''
      }
    },
    methods: {
      openSelect (params) {  // 选中的行
        var proId = params.row.projectId;
        var proName = params.row.projectName;
        this.hideData[this.curRefKey] = proId;
        this.contractHeadModules.map(module => {
          module.items.map(item => {
            if (item.itemKey == this.curOpenKey) {
              item.value = proName;
            }
          });
        });
        this.openClose();
        //alert('选中操作');
      },
      openClose() {
        this.openModel = false;
      },
      openOk() {  // 确认
        if (this.openSelected.length) {
          alert(save);
        } else {
          alert('没有选中!');
          this.$Message.info('没有选中!');
        }
      },
      open(key, reftype) {
        const openUrl = api.getRefUrl();
        this.curOpenKey = key;
        this.curRefKey = reftype;
        /*this.openColumn = this.proColumn;
         alert(this.openColumn);*/
        this.getOpenList();
        this.openModel = true;
      },
      getOpenList() {
        const openUrl = api.getRefUrl();
        var openData = {
          start: this.openListFrom,
          length: 10,
          openKey: this.curRefKey,
          search: this.openSearch,
          resultType: 'page'
        };
        this.ajax.post(openUrl, openData, (data) => {
          this.openData = data.data.list;
          this.openListTotal = data.data.total;
          if (data.data.list.length < this.openListTo) {
            this.openListTo = data.data.list.length;
          }
        });
      },
      openChangePage(n) {  // 切换分页，重载数据
        this.openListTo = 10;
        this.openListFrom = this.openListTo * (n - 1);
        this.getOpenList();
      },
      //提交合同数据
      submit () {
        this.reqData = {"firstpartyId": this.firstpartyId, "rowData": []};
        //获取表头数据
        //编辑模式传合同id
        if (this.isEdit) {
          this.reqData.id = this.$route.query.contractId;
        }
        this.contractHeadModules.map(module => {
          module.items.map(item => {
            if (item.type == 3) {
              this.reqData[item.itemKey] = this.formatDate(new Date(item.value));
            } else {
              this.reqData[item.itemKey] = item.value;
            }
          });
        });
        //hideData
        for (var hda in this.hideData) {
          this.reqData[hda] = this.hideData[hda];
        }

        //this.reqData.firstpartyId = this.firstpartyId;
        var obj = {};
        //获取表体数据
        for (var key in this.contractBodyModulesData) {
          var rowArray = this.contractBodyModulesData[key];
//          if (!this.reqData[key]) {
//            this.reqData[key] = [];
//          }
          for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
            obj = {};
            for (var rowkey in rowArray[rowIndex].tdData) {
              obj[rowkey] = rowArray[rowIndex].tdData[rowkey].value;
            }
            //rowID
            obj.id = rowArray[rowIndex].id;
            //模块ID
            obj.moduleId = key;
            obj.tabCode = rowArray[rowIndex].tabCode;
            if (rowArray[rowIndex].grade) {
              obj.grade = rowArray[rowIndex].grade;
            }
            if (rowArray[rowIndex].pgrade) {
              obj.pgrade = rowArray[rowIndex].pgrade;
            }
            if (rowArray[rowIndex].leftPx) {
              obj.leftPx = rowArray[rowIndex].leftPx;
            }
            //添加索引用以排序
            if (obj.tabCode == 'fbfyd' && this.billCode == 'H5A1') {
              obj.sortIndex = this.reqData.rowData.filter(function (value) {
                return value.tabCode == 'fbfyd';
              }).length;
            }
            this.reqData.rowData.push(obj);
            //this.reqData[key].push(obj);
          }
        }
        //模板编码
        this.reqData.pk_billtypecode = this.billCode;
        //模板ID
        this.reqData.templateId = this.templateId;
        var contractSaveUrl = api.contractSave(), _this = this;
        console.log('************save***********');
//        console.log(JSON.stringify(this.reqData));
        axios.post(contractSaveUrl, this.reqData).then(function (res) {
          if (res.data.error_code == 200) {
            _this.$Message.success('保存成功');
            router.push({path: "/ContractManage"});

          } else {
            //            this.$Message.success(btData.data.error_msg)
          }
        }).catch(function (error) {
        })
      },
      //表头模块展开关闭
      slide(id)
      {
        this.contractHeadModules.map(module => {
          if (module.id == id) {
            module.slideDown = !module.slideDown;
          }
        });
      }
      ,
      //切换表体tab
      clickTab(tabName)
      {
        this.currentTabName = tabName;
      }
      ,
      //添加行
      addRow()
      {
        var _this = this, obj = {}, rowObj = {};
        this.contractBodyModules.map(module => {
          if (module.id == this.currentTabName) {
            module.items.map(item => {
              obj[item.itemKey] = {value: '', type: item.type, name: item.name, isEdit: true};
            })
            rowObj = {
              'tdData': obj,
              'isChecked': false,
              'tabCode': module.tabCode
            }
            //费用单页签
            if (module.tabCode == 'fbfyd' && _this.billCode == 'H5A1') {
              if (this.contractBodyModulesData.hasOwnProperty(this.currentTabName)) {
                rowObj.grade = this.contractBodyModulesData[this.currentTabName].length + 1;
              } else {
                rowObj.grade = 1;
              }

              rowObj.selected = false;
              rowObj.show = true;
              //子级
              if (this.currentRow) {
                //父级key
                rowObj.pgrade = this.currentRow;
              } else {
                //父级需要spread、show
                rowObj.spread = false;
                rowObj.show = true;
              }
              var left = 0, insertIndex = 0;
              if (this.contractBodyModulesData.hasOwnProperty(this.currentTabName)) {
                this.contractBodyModulesData[this.currentTabName].forEach(
                  function (value, index) {
                    if (value.grade == _this.currentRow) {
                      left = value.leftPx;
                      insertIndex = index;
                    }
                  }
                )
              }
              //树级分割线
              rowObj.leftPx = left > 100 ? 100 : left + 10;
              if (this.contractBodyModulesData.hasOwnProperty(this.currentTabName)) {
                this.contractBodyModulesData[this.currentTabName].splice(insertIndex + 1, 0, rowObj);
              } else {
                this.contractBodyModulesData[this.currentTabName] = [].concat(rowObj);
              }
            } else {
              if (this.contractBodyModulesData.hasOwnProperty(this.currentTabName)) {
                this.contractBodyModulesData[this.currentTabName].push(rowObj);
              } else {
                this.contractBodyModulesData[this.currentTabName] = [].concat(rowObj);
              }
            }
          }
        })
        this.$forceUpdate()
      },
      //点击表格单元格切换编辑模式
      edit(moduleId, itemId, index)
      {
        var curRow = this.contractBodyModulesData[moduleId][index];
        if (curRow.tabCode == 'fbfyd' && this.billCode == 'H5A1') {
          var hasChildren = this.isHasChildren(moduleId, curRow.grade),
            editLimit = ['chargetaxrate', 'combinedprice', 'combinedprice_ntax', 'cost_taxamount', 'price', 'price_ntax'];
          if (editLimit.indexOf(itemId) == -1) {
            curRow['tdData'][itemId].isEdit = true;
          } else {
            if (!hasChildren) {
              curRow['tdData'][itemId].isEdit = true;
            }
          }
        } else {
          curRow['tdData'][itemId].isEdit = true;
        }
        this.$forceUpdate()
      }
      ,
      //光标离开编辑框还原预览模式
      editBlur(moduleId, itemId, index)
      {
        this.contractBodyModulesData[moduleId][index]['tdData'][itemId].isEdit = false;
        this.$forceUpdate()
      }
      ,
      //全选行
      checkAll(checked)
      {
        for (var row in this.contractBodyModulesData) {
          if (row == this.currentTabName) {
            for (var v in this.contractBodyModulesData[row]) {
              this.contractBodyModulesData[row][v].isChecked = checked;
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
          for (var row in this.contractBodyModulesData) {
            if (row == this.currentTabName) {
              for (var v in this.contractBodyModulesData[row]) {
                if (!this.contractBodyModulesData[row][v].isChecked) {
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
      //删除行
      removeRow()
      {
        var modulesData = this.contractBodyModulesData, _this = this, tabId;
        for (var i = 0; i < modulesData[this.currentTabName].length; i++) {
          //费用单
          if (modulesData[this.currentTabName][i].tabCode == 'fbfyd' && _this.billCode == 'H5A1') {
            tabId = this.currentTabName;
            break;
          }
        }
        //费用单，树状结构，需递归删除
        if (tabId == this.currentTabName) {
          _this.removeParent(_this.currentRow, modulesData[tabId]);
        } else {
          for (var i = 0; i < modulesData[this.currentTabName].length; i++) {
            if (modulesData[this.currentTabName][i].isChecked) {
              modulesData[this.currentTabName].splice(i, 1);
              i--;
            }
          }
        }
        this.$forceUpdate();
      },
      removeParent: function (grade, list) {
        var _this = this;
        for (var i = 0; i < list.length; i++) {
          var value = list[i];
          if (value.grade == grade) {
            list.splice(i, 1);
            _this.removeChildren(value.grade, list);
            break;
          }
        }
      },
      removeChildren(grade, list){
        var deletedList = [], _this = this;
        for (var i = 0; i < list.length; i++) {
          var value = list[i];
          if (value.pgrade == grade) {
            deletedList.push(value.grade);
          }
        }
        deletedList.forEach(function (value, index) {
          _this.removeParent(value, list);
        })
      },
      //初始化表体数据
      initBodyData(moduleData)
      {
        this.contractBodyModulesData = {};
        var obj, _this = this;
        if (_this.contractBodyModules.length > 0) {
          this.currentTabName = this.contractBodyModules[0].id;
        }
        _this.contractBodyModules.map(moduleItem => {
          if (!_this.isEdit) {
            obj = {
              'tdData': {},
              'isChecked': false,
              'tabCode': moduleItem.tabCode
            };
            if (moduleItem.tabCode == 'fbfyd' && _this.billCode == 'H5A1') {
              obj.grade = 1;
              obj.selected = false;
              obj.leftPx = 0;
              obj.spread = false;
              obj.show = true;
            }
            moduleItem.items.map(item => {
              obj.tdData[item.itemKey] = {
                'value': '',
                'name': item.name,
                'isEdit': true,
                'type': item.type
              };
            });
            _this.contractBodyModulesData[moduleItem.id] = [obj];
          }
          //如果存在billCode则为编辑，读取数据
          if (_this.isEdit) {
            console.log('*******************获取到数据************');
//            console.log(JSON.stringify(moduleData));
            //遍历每行数据
            moduleData.rowData.map(row => {
              if (row.moduleId == moduleItem.id) {
                obj = {'tdData': {}, 'isChecked': false, 'tabCode': moduleItem.tabCode, 'id': row.id, type: row.type};
                //费用单树状表体
                if (row.tabCode == 'fbfyd' && _this.billCode == 'H5A1') {
                  obj.grade = row.grade;
                  if (row.pgrade) {
                    obj.pgrade = row.pgrade;
                  }
                  if (!row.pgrade) {
                    obj.spread = false;
                  }
                  if (row.leftPx) {
                    obj.leftPx = row.leftPx;
                  }
                  obj.selected = false;
                  obj.show = true;
                }
                //遍历表体字段
                moduleItem.items.map(item => {
                  for (var key in row) {
                    var isExist = false, type = 0;
                    if (item.itemKey == key) {
                      isExist = true;
                      type = item.type;
                    }
                    if (isExist) {
                      var tdDataName = item.name;
                      //alert(key+'==='+row[key])
                      obj.tdData[item.itemKey] = {
                        'value': row[key],
                        'type': type,
                        'name': tdDataName,
                        'isEdit': false
                      };
                    }
                  }
                });
                //alert(JSON.stringify(obj))
                if (this.contractBodyModulesData[moduleItem.id] && this.contractBodyModulesData[moduleItem.id] instanceof Array) {
                  this.contractBodyModulesData[moduleItem.id].push(obj);
                } else {
                  this.contractBodyModulesData[moduleItem.id] = [obj];
                }
              }
            })
          }
        })
      }
      ,
      //初始化表头数据
      initHeadData(moduleData)
      {
        if (moduleData && this.isEdit) {
          this.contractHeadModules.map(module => {
            module.items.map(item => {
              item.value = moduleData[item.itemKey];
            })
          })
          this.hideData.pk_project = moduleData.pk_project;
        }
      }
      ,
      initContractModules(moduleData)
      {
        var moduleObj = {items: []}, itemObj = {}, _this = this;
        //遍历模块
        moduleData.billTempletTList.map(item => {
          moduleObj = {items: []};
          moduleObj.slideDown = true;
          moduleObj.name = item.tabName;
          moduleObj.id = item.id;
          moduleObj.tabCode = item.tabCode;
          //遍历字段
          item.billTempletBList.map(bItem => {
            itemObj = {};
            itemObj.itemKey = bItem.itemKey;
            itemObj.name = bItem.defaultShowName;
            itemObj.id = bItem.id;
            itemObj.type = bItem.dataType;
            itemObj.reftype = bItem.reftype;
            itemObj.showFlag = bItem.showFlag;
            moduleObj.items.push(itemObj);
          });
//              表头
          if (item.pos == 0) {
            _this.contractHeadModules.push(moduleObj);
          }
//            表体
          if (item.pos == 1) {
            _this.contractBodyModules.push(moduleObj);
          }
        })
      }
      ,
      //获取合同模板
      getContractModules(firstPartyId, billCode)
      {
        var smTempletUrl = api.smTemplet() + '/' + firstPartyId + '/' + billCode;
        var _this = this;
        this.contractHeadModules = [];
        this.contractBodyModules = [];
        return axios.get(smTempletUrl);
      }
      ,
      //获取合同数据
      getContractModulesData(contractId)
      {
        var templetDataUrl = api.getContractData() + '/' + contractId;
        var _this = this;
        return axios.get(templetDataUrl);
      }
      ,
      getContractData(firstPartyId, billCode, contractId)
      {
        var _this = this;
        //var loadEve = [_this.getContractModules(firstPartyId,billCode)];

        axios.all([_this.getContractModules(firstPartyId, billCode), _this.getContractModulesData(contractId)]).then(axios.spread(function (modules, ModuleData) {
          if (modules.data.error_code != '200') {
            _this.$Message.error(modules.data.error_msg);
            _this.cancle();
            return;
          }
          if (ModuleData.data.error_code != '200') {
            _this.$Message.error(ModuleData.data.error_msg)
            return;
          }
          //保存模板编号
          _this.billCode = modules.data.data.billTypeCode;
          //保存模板ID
          _this.templateId = modules.data.data.id;
          //合同模块初始化
          _this.initContractModules(modules.data.data);
          //合同数据初始化
          _this.initBodyData(ModuleData.data.data);
          _this.initHeadData(ModuleData.data.data);
        })).catch(function (error) {
          _this.$Message.error(error.message)
        })
      }
      ,
      isExistCell(moduleId, itemKey)
      {
        var isExist = false;
        this.contractBodyModules.map(moduleItem => {
          if (moduleItem.id == moduleId) {
            moduleItem.items.map(item => {
              if (item.itemKey = itemKey) {
                isExist = true;
              }
            });
          }
        });
      }
      ,
      //时间转换
      formatDate(date){
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
      //检测reqData是否已包含要删除的行
      checkDelRowExist(rowId){
        var isExistRow = false;
        this.reqData.deleteRow.map(row => {
          if (row.rowId == rowId) {
            isExistRow = true;
          }
        });
        return isExistRow;
      },
      cancle(){
        router.push({
          path: "/ContractManage"
        });
      },
      rowSelected(tabCode, grade, moduleId){
        if (tabCode == 'fbfyd' && this.billCode == 'H5A1') {
          this.currentRow = grade;
          this.contractBodyModulesData[moduleId].forEach(function (value, index) {
            if (value.grade == grade) {
              value.selected = true;
            } else {
              value.selected = false;
            }
          });
          this.$forceUpdate()
        }
      },
      showOrHide: function (flag, moduleId, grade) {
        var _this = this;
        this.contractBodyModulesData[moduleId].forEach(
          function (value, index) {
            if (value.pgrade == grade) {
              value.show = flag == "show";
              _this.showOrHide(flag, moduleId, value.grade);
            }
            if (value.grade == grade) {
              value.spread = !value.spread;
            }
          }
        );
      },
      tbCountAmount(id, index, key) {// 表体金额互算
//         console.log(id, index, key, this.contractBodyModulesData)
        // 标签页字段
        const tabCode = {
          noTax: 'price_ntax', taxRate: 'chargetaxrate', amount: 'price',
          cPrice: 'combinedprice', cAmount: 'cost_taxamount', cNtax: 'combinedprice_ntax'
        };
        const priceRule = ['price_ntax', 'chargetaxrate', 'price'];
        const cPriceRule = ['combinedprice', 'cost_taxamount', 'combinedprice_ntax'];

        if (this.contractBodyModulesData[id][index].tabCode !== 'fbfyd') {
          return;
        }
        var tdData = this.contractBodyModulesData[id][index]['tdData'],
          // 单价（无税）
          noTax = parseFloat(tdData[tabCode['noTax']].value) || 0,
          // 税率
          taxRate = parseFloat(tdData[tabCode['taxRate']].value) || 0,
          // 单价
          amount = parseFloat(tdData[tabCode['amount']].value) || 0,
          // 合价
          cPrice = parseFloat(tdData[tabCode['cPrice']].value) || 0,
          // 税额
          cAmount = parseFloat(tdData[tabCode['cAmount']].value) || 0,
          // 合价（无税）
          cNtax = parseFloat(tdData[tabCode['cNtax']].value) || 0;

        function round(number) {  // 四舍五入并保留两位小数，toFixed不够精确
          return Math.round(number * 100) / 100;
        }

        // 申请金额=申请金额（无税）*（1+税率）
        // 税额=申请金额-申请金额（无税）
        switch (key) {
          case tabCode['taxRate']:
            if (amount) {
              // 单价（无税）
              noTax = round(amount / (1 + (taxRate / 100)));
            }
            else if (noTax) {
              // 单价
              amount = round(noTax * (1 + (taxRate / 100)));
            }
            break;
          case tabCode['noTax']:
            if (taxRate) {
              // 单价
              amount = round(noTax * (1 + (taxRate / 100)));
            }
            else if (amount) {
              // 税率
              taxRate = round(((amount / noTax) - 1) * 100);
            }
            break;
          case tabCode['amount']:
            if (taxRate) {
              // 单价（无税）
              noTax = round(amount / (1 + (taxRate / 100)));
            }
            else if (noTax) {
              // 税率
              taxRate = round(((amount / noTax) - 1) * 100);
            }
            break;
          //合价
          case tabCode['cPrice']:
            if (cAmount) {
              cNtax = round(cPrice - cAmount);
            }
            else if (cNtax) {
              cAmount = round(cPrice - cNtax);
            }
            break;
          //税额
          case tabCode['cAmount']:
            if (cPrice) {
              cNtax = round(cPrice - cAmount);
            }
            else if (cNtax) {
              cAmount = round(cPrice - cNtax);
            }
            break;
          //合价无税
          case tabCode['cNtax']:
            if (cAmount) {
              cPrice = round(cNtax + cAmount);
            }
            else if (cPrice) {
              cAmount = round(cPrice - cNtax);
            }
            break;
        }
        if (priceRule.indexOf(key) != -1) {
          //单价（无税）
          this.contractBodyModulesData[id][index]['tdData'][tabCode['noTax']].value = noTax;
          //税率%
          this.contractBodyModulesData[id][index]['tdData'][tabCode['taxRate']].value = taxRate;
          //单价
          this.contractBodyModulesData[id][index]['tdData'][tabCode['amount']].value = amount;
        }
        if (cPriceRule.indexOf(key) != -1) {
          //合价（无税）
          this.contractBodyModulesData[id][index]['tdData'][tabCode['cNtax']].value = cNtax;
          //税率%
          this.contractBodyModulesData[id][index]['tdData'][tabCode['cAmount']].value = cAmount;
          //合价
          this.contractBodyModulesData[id][index]['tdData'][tabCode['cPrice']].value = cPrice;
        }
        var curRowData = {};
        if (priceRule.indexOf(key) != -1) {
          curRowData = {'price_ntax': noTax, 'price': amount};
        }
        if (cPriceRule.indexOf(key) != -1) {
          curRowData = {'combinedprice': cPrice, 'combinedprice_ntax': cNtax}
        }
        if (this.contractBodyModulesData[id][index].hasOwnProperty('pgrade')) {
          this.ladderCalculate(id, this.contractBodyModulesData[id][index].grade, this.contractBodyModulesData[id][index].pgrade, curRowData);
        }
      },
      ladderCalculate(moduleId, grade, pgrade, curRowData){
        this.contractBodyModulesData[moduleId].forEach((value) => {
          if (value.pgrade == pgrade && value.grade != grade) {
            for (var key in curRowData) {
              if (value.tdData.hasOwnProperty(key)) {
                curRowData[key] += value.tdData[key].value;
              }
            }
          }
        });
        this.contractBodyModulesData[moduleId].forEach((value) => {
          if (value.grade == pgrade) {
            for (var key in curRowData) {
              if (value.tdData.hasOwnProperty(key)) {
                value.tdData[key].value = curRowData[key];
              }
            }
            if (value.hasOwnProperty('pgrade')) {
              this.ladderCalculate(moduleId, value.grade, value.pgrade, curRowData)
            }
          }
        })
      },
      isHasChildren(moduleId, grade){
        var list = this.contractBodyModulesData[moduleId], hasChildren = false;
        for (var i = 0; i < list.length; i++) {
          if (list[i].pgrade && list[i].pgrade == grade) {
            hasChildren = true;
            break;
          }
        }
        return hasChildren;
      }
    },
    computed: {}
    ,
    created()
    {
      //模板ID或者合同ID
      //var billCode = this.$route.query.billCode;
      this.firstpartyId = this.$route.query.firstPartyId;
      var billCode = this.$route.query.billCode;

      var contractId = this.$route.query.contractId;
      //是否编辑
      var isEdit = this.$route.query.isEdit;
      this.isEdit = isEdit;
      //this.getContractData(billCode, contractId);
      this.getContractData(this.firstpartyId, billCode, contractId);
    }
  }

</script>
<style scoped lang="less">
  @import "../assets/css/contract-entry.less";
  @import "../assets/css/control.css";
</style>
