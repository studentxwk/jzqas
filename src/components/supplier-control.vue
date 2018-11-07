<template>
    <div class="layout">
        <div class="layout-content">
            <Card :bordered="false" dis-hover>
                <div slot="title" class="first-title">
                    <span class="project-name">我的供应商</span>
                    <Button type="success" @click="openEntrance" class="mar-r10">添加供应商</Button>
                    <span><Input v-model="queryVendor" icon="ios-search"   placeholder="查询供应商" style="width:300px;"></Input></span>
                    <span><Button type="success" @click="getList()">查询</Button></span>
                </div>
                <div class="btn-warp">
                    <Modal
                            v-model="entrance"
                            width="auto"
                            :closable="false"
                            :mask-closable="false"
                    >
                        <p slot="header" style="height: auto;text-align:left">
                            <span><Input v-model="freeSupCol" icon="ios-search" placeholder="输入供应商名称搜索供应商" style="width:300px;"></Input></span>
                            <span><Button type="success" @click="getFreeSupplierList()">查询</Button></span>
                        </p>
                        <Table height="360" :columns="columnsEn" :data="dataEn" @on-selection-change="selectRows"></Table>
                        <div slot="footer">
                            <Button type="text" @click="closeEntrance" size="large">取消</Button>
                            <Button type="primary" @click="okEntrance" size="large">确定</Button>
                        </div>
                    </Modal>
                </div>

                <Table :columns="columnsLs" :data="dataLs"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <p style="float: left;line-height: 32px;font-size: 14px;">
                        当前展示 {{ listFrom }} 到 {{ listFrom + listTo }} 条，共 {{ listTotal }} 条
                    </p>
                    <div style="float: right;">
                        <Page :total="listTotal" :current="1" @on-change="changePage"></Page>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import api from '../utils/api';

    export default {
        data () {
            return {
                entrance: false,
                queryVendor: '',
                freeSupCol: '',
                selectedList: [],  // 选中的行
                columnsLs: [
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
                        width: 40,
                        height: 10,
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
                dataEn: [],  // 列表数据
                listFrom: 0,  // 起始位置
                listTo: 10,  // 列表长度
                listTotal: 0  // 列表总条数
            }
        },
        methods: {
            getList () {  // 获取列表
                this.listTo = 10;
                const url = api.supplyInfoLs(),
                    data = {
                        start: this.listFrom,
                        length: 10,
                        search: this.queryVendor
                    };

                this.ajax.post(url, data, (data) => {
                    this.dataLs = data.data.list;
                    for (let data of this.dataLs){
                        if(data.vendorType == 1){
                            data.vendorType = '物资';
                        }
                        if(data.vendorType == 2){
                            data.vendorType = '分包';
                        }
                        if(data.vendorType == 3){
                            data.vendorType = '租赁';
                        }
                        if(data.vendorType == 4){
                            data.vendorType = '其他';
                        }
                    }
                    this.listTotal = data.data.total;

                    if (data.data.list.length < this.listTo) {
                        this.listTo = data.data.list.length
                    }
                });
            },
            getFreeSupplierList () {  // 获取列表
                const url = api.getFreeSupplierList();

                if(true){
                    var sedata = {
                        searchText: this.freeSupCol,
                    };
                    this.ajax.post(url, sedata, (data) => {
                        this.dataEn = data.data;
                        for (let data of this.dataEn){
                            if(data.vendorType == 1){
                                data.vendorType = '物资';
                            }
                            if(data.vendorType == 2){
                                data.vendorType = '分包';
                            }
                            if(data.vendorType == 3){
                                data.vendorType = '租赁';
                            }
                            if(data.vendorType == 4){
                                data.vendorType = '其他';
                            }
                        }
                        //this.entrance = true;
                    });
                }
            },
            changePage (n) {  // 切换分页，重载数据
                this.listTo = 10;
                this.listFrom = this.listTo * (n - 1);
                this.getList();
            },
            openEntrance() {
                this.entrance = true;
                this.getFreeSupplierList();
            },
            selectRows (selection) {  // 选中的行
                console.log(selection);
                this.selectedList =  [];
                for (let i = selection.length - 1; i >= 0; i--) {


                    this.selectedList.unshift({id: selection[i].id});
                }
            },
            closeEntrance() {
                this.entrance = false;
            },
            okEntrance() {  // 确认
                if(this.selectedList.length) {

                    const url = api.supplyRatify();

                    this.ajax.post(url, this.selectedList, (data) => {
                        if (data.error_code == 200) {
                            this.$Message.success('添加成功!');
                            this.closeEntrance();
                            this.getList();
                        }else{
                            this.$Message.error(data.error_msg);
                        }

                    });
                } else {
                    this.$Message.info('没有选中!');
                }

            }
        },
        created () {
            this.getList();
            //this.getFreeSupplierList();
        }
    }
</script>

<style scoped>
    @import  "../assets/css/control.css";
</style>