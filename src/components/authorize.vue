<template>
  <div class="layout">
    <Row class="layout-content">
      <i-col span="4" class="left-menu">
        <ul class="all-items">
          <li v-for="(item, index) in allItems" :class="{active: item.isActive}" :key="timeNow"
              @click="changeActive(index,item)" v-text="item.projectName">sss
          </li>
        </ul>
      </i-col>
      <i-col span="20">
        <Card :bordered="false" dis-hover>
          <div slot="title" class="first-title">
            <span class="project-name">此项目供应商</span>
            <Button type="success" @click="openEntrance" class="mar-r10">添加</Button>
            <Button type="error" @click="deleteList">删除</Button>
            <span style="margin-left:10px;">开始时间：<DatePicker v-model="startTime" type="date" placeholder="选择日期"
                                                             style="width: 200px;display: inline-block;"
                                                             :format="yyyy-MM-dd" readonly></DatePicker></span>
            <span>结束时间：<DatePicker v-model="endTime" type="date" placeholder="选择日期"
                                   style="width: 200px;display: inline-block"
                                   :format="yyyy-MM-dd" readonly></DatePicker></span>
          </div>
          <div class="btn-warp">
            <Modal
              v-model="entrance"
              title="添加供应商"
              width="auto"
              :closable="false"
              :mask-closable="false"
            >
              <p slot="header" style="height: auto;text-align:left">
                <span><Input v-model="openSearch" icon="ios-search" placeholder="输入名称搜索..."
                             style="width:300px;"></Input></span>
                <span><Button type="success" @click="getSupplierList()">查询</Button></span>
              </p>
              <Table height="260" :columns="columnsEn" :data="dataEn" @on-selection-change="selectRows"></Table>
              <div style="margin: 10px;overflow: hidden">
                <p style="float: left;line-height: 32px;font-size: 14px;">
                  当前展示 {{ listFrom1 }} 到 {{ listFrom1 + listTo1 }} 条，共 {{ listTotal1 }} 条
                </p>
                <div style="float: right;">
                  <Page :total="listTotal" :current="1" @on-change="changePage"></Page>
                </div>
              </div>

              <div slot="footer">
                <Button type="text" @click="closeEntrance" size="large">关闭</Button>
                <Button type="primary" @click="okEntrance" size="large">确定</Button>
              </div>

            </Modal>
          </div>

          <Table :columns="columnsLs" :data="dataLs" @on-selection-change="deSelectRows"></Table>
          <div style="margin: 10px;overflow: hidden">
            <p style="float: left;line-height: 32px;font-size: 14px;">
              当前展示 {{ listFrom }} 到 {{ listFrom + listTo }} 条，共 {{ listTotal }} 条
            </p>
            <div style="float: right;">
              <Page :total="listTotal" :current="1" @on-change="changePage"></Page>
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
  import api from '../utils/api';

  export default {
    data () {
      return {
        timeNow: new Date().getTime(),
        curProjectId: '',
        curProjectName: '',
        curGroup: '',
        curOrg: '',
        openSearch: '',
        entrance: false,
        allItems: [
          {text: '首创世界花园项目', isActive: false},
          {text: '中央电视塔项目', isActive: true},
          {text: '方正科技大厦项目', isActive: false},
          {text: '中关村软件园三期项目', isActive: false},
          {text: '轨道交通14号线西段项目', isActive: false}
        ],
        selectedList: [],  // 选中的行
        columnsLs: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '供应商名称',
            key: 'supplierName'
          },
          {
            title: '营业执照号',
            key: 'corpRegNo'
          },
          {
            title: '公司法人',
            key: 'corporation'
          },
          {
            title: '主要供应类型',
            key: 'vendorType'
          },
          {
            title: '注册日期',
            key: 'corpRegDate'
          },
          {
            title: '地址',
            key: 'corpAddress'
          }
        ],
        dataLs: [],  // 列表数据
        columnsEn: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '供应商名称',
            key: 'supplierName'
          },
          {
            title: '营业执照号',
            key: 'corpRegNo'
          },
          {
            title: '公司法人',
            key: 'corporation'
          },
          {
            title: '主要供应类型',
            key: 'vendorType'
          },
          {
            title: '注册日期',
            key: 'corpRegDate'
          },
          {
            title: '地址',
            key: 'corpAddress'
          }
//                    ,
//                    {
//                        title: '操作',
//                        key: 'action',
//                        width: 150,
//                        align: 'center',
//                        render: (h, params) => {
//                        return h('div', [
//                                            h('Button', {
//                                                props: {
//                                                    type: 'primary',
//                                                    size: 'small'
//                                                },
//                                                style: {
//                                                    marginRight: '5px'
//                                                },
//                                                on: {
//                                                    click: () => {
//                                                    this.openSelect(params.row.id)
//                                            }
//                                    }
//                            }, '选择')
//                        ]);
//                        }
//                        }
        ],
        dataEn: [],  // 列表数据
        listFrom: 0,  // 起始位置
        listTo: 10,  // 列表长度
        listTotal: 0, // 列表总条数
        listFrom1: 0,  // 起始位置
        listTo1: 10,  // 列表长度
        listTotal1: 0,  // 列表总条数
        startTime: "",
        endTime: ""
      }
    },
    methods: {
      loadProjectSuppliers(){
        const url = api.getProSupList();
        // nsw  查询项目和甲方关系列表
        var data = {
          start: this.listFrom,
          length: 10,
          projectId: this.curProjectId
        };
        this.listTo = 10;
        this.ajax.get(url, data, (data) => {
          this.dataLs = data.data.list;
          var sTime = new Date(data.startTime);
          var eTime = new Date(data.endTime);
          this.startTime = sTime.getFullYear + '/' + (sTime.getMonth() + 1) + '/' + sTime.getDate();
          this.endTime = eTime.getFullYear + '/' + (eTime.getMonth() + 1) + '/' + eTime.getDate();
          for (let data of this.dataLs) {
            if (data.vendorType == 1) {
              data.vendorType = '物资';
            }
            if (data.vendorType == 2) {
              data.vendorType = '分包';
            }
            if (data.vendorType == 3) {
              data.vendorType = '租赁';
            }
            if (data.vendorType == 4) {
              data.vendorType = '其他';
            }
          }
          this.listTotal = data.data.total;
          if (data.data.list.length < this.listTo) {
            this.listTo = data.data.list.length
          }

        })
        ;
        // nsw
      },
      openSelect(supId){
        const url = api.addProject2Supplier(),
          data = {
            pk_project: this.curProjectId,
            projectName: this.curProjectName,
            supplierId: supId,
            pkGroup: this.curGroup,
            pkOrg: this.curOrg
          };

        this.ajax.post(url, data, function (data) {
          if (200 == data.error_code
          ) {
            this.$Message.success('操作成功');
            this.getSupplierList();
          }
          else {
            this.$Message.error(data.error_msg);
          }
        })
        ;
      },
      getList () {  // 获取列表
        const url = api.proSupplierList(),
          data = {
            start: this.listFrom,
            length: this.listTo,
//                        search: ''
            pk_project: this.curProjectId,
          };

        this.ajax.get(url, data, function (data) {
          this.dataLs = data.data.list;
          this.listTotal = data.data.total;

          if (data.data.list.length < this.listTo) {
            this.listTo = data.data.list.length
          }
        })
        ;
      },
      getProjectList () {  // 获取列表
        const url = api.getProjectList(), _this = this;
        this.ajax.get(url, null, function (data) {
          _this.allItems = data.data;
          /*  this.allItems.map((item, i) => {
           if(i == 0) {
           item.isActive = true;
           } else {
           item.isActive = false;
           }
           });*/

        })
        ;
      },
      changePage (n) {  // 切换分页，重载数据
        this.listTo = 10;
        this.listFrom = this.listTo * (n - 1);
        this.getList();
      },
      getSupplierList () {  // 获取列表
        this.listTo1 = 10;
        const url = api.proSupplierList(),
          data = {
            start: this.listFrom1,
            length: 10,
            pk_project: this.curProjectId,
            supplierName: this.openSearch
          };
        this.ajax.post(url, data, (data) => {
          this.dataEn = data.data.list;
          for (let data of this.dataEn) {
            if (data.vendorType == 1) {
              data.vendorType = '物资';
            }
            if (data.vendorType == 2) {
              data.vendorType = '分包';
            }
            if (data.vendorType == 3) {
              data.vendorType = '租赁';
            }
            if (data.vendorType == 4) {
              data.vendorType = '其他';
            }
          }
          this.listTotal1 = data.data.total;

          if (data.data.list.length < this.listTo1) {
            this.listTo1 = data.data.list.length
          }
        })
        ;
      },
      openEntrance() {
        if ('' == this.curProjectId) {
          this.$Message.error('请选择项目!');
        } else {
          const url = api.projectAbledValid();
          var reqData = {'projectId': this.curProjectId}
          this.ajax.get(url, reqData, (data) => {
            if (data.error_code == 200) {
              if (data.data) {
                this.getProjectCharge();
              }else{
                this.$Message.error('已超出使用期限，请续费使用！');
              }
            }
            else {
              this.$Message.error(data.error_msg);
            }
          });
        }
      },
      getProjectCharge(){
        const url = api.getProjectCharge();
        this.ajax.get(url, null, (data) => {
          if (data.error_code == 200
          ) {
            this.getSupplierList();
            this.entrance = true;
          }
          else {
            this.$Message.error(data.error_msg);
          }
        })
        ;
      },
      deleteList() {
        if (this.selectedList.length) {
          const url = api.delProSupplier();
          var data = {
            selectedList: this.selectedList,
            projectId: this.curProjectId
          };
          this.ajax.post(url, data, function (data) {
            this.$Message.success('删除成功!');
            this.closeEntrance();
            /*this.listTo = 10;
             this.getList();*/
          })
          ;
        } else {
          this.$Message.info('没有选中!');
        }

      },
      changeActive(index, item) {
        //pk_project,proName

        //this.allItems[index].isActive = true;
        this.curProjectId = item.pk_project;
        this.curProjectName = item.projectName;
        this.curGroup = item.pkGroup;
        this.curOrg = item.pkOrg;

        this.allItems.map((item, i) => {
          if (i == index
          ) {
            item.isActive = true;

          }
          else {
            item.isActive = false;
          }
        })
        ;
        this.timeNow = new Date().getTime();
        this.loadProjectSuppliers();

      },
      selectRows (selection) {  // 选中的行
        for (let i = selection.length - 1; i >= 0; i--) {
          this.selectedList.unshift({
            supplierId: selection[i].id, pk_project: this.curProjectId, projectName: this.curProjectName,
            pkGroup: this.curGroup, pkOrg: this.curOrg
          });
        }
      },
      deSelectRows (selection) {  // 选中的行（删除）
        console.log(selection)
        this.selectedList = [];
        for (let i = selection.length - 1; i >= 0; i--) {
          this.selectedList.unshift({supplierId: selection[i].id});
        }
      },
      closeEntrance() {
        this.entrance = false;
        this.loadProjectSuppliers();
      },
      okEntrance() {  // 确认
        if (this.selectedList.length) {
          const url = api.addProject2Supplier();

          this.ajax.post(url, this.selectedList, (data) => {
            this.$Message.success('保存成功!');
            this.closeEntrance();
            /*this.listTo = 10;
             this.getList();*/
          })
          ;
        } else {
          this.$Message.info('没有选中!');
        }
      }
    },
    created () {
      //this.getList();
      this.getProjectList();
    }
  }
</script>

<style scoped>
  @import "../assets/css/control.css";
</style>
