<template>
    <div class="layout">
        <div class="layout-content">
            <Card :bordered="false" dis-hover>
                <div slot="title" class="first-title">
                    <span class="project-name">甲方列表</span>
                    <Button type="success" @click="openEntrance">申请入场</Button>
                </div>
                <div class="btn-warp">
                    <Modal
                            v-model="entrance"
                            title="申请入场"
                            width="auto"
                            :closable="false"
                            :mask-closable="false"
                    >
                        <p slot="header" style="height: auto;text-align:left">
                            <span><Input v-model="openSearch" icon="ios-search" placeholder="输入名称搜索..." style="width:300px;"></Input></span>
                            <span><Button type="success" @click="getApplyList()">查询</Button></span>
                        </p>
                        <Table height="260" :columns="columnsEn" :data="dataEn" @on-selection-change="selectRows"></Table>
                        <div style="margin: 10px;overflow: hidden">
                            <p style="float: left;line-height: 32px;font-size: 14px;">
                                当前展示 {{ listFrom1 }} 到 {{ listFrom1 + listTo1 }} 条，共 {{ listTotal1 }} 条
                            </p>
                            <div style="float: right;">
                                <Page :total="listTotal1" :current="1" @on-change="changePage1"></Page>
                            </div>
                        </div>
                        <div slot="footer">
                            <Button type="text" @click="closeEntrance" size="large">取消</Button>
                            <!--<Button type="primary" @click="okEntrance" size="large">确定</Button>-->
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
                openSearch:'',
                entrance: false,
                selectedList: [],  // 选中的行
                columnsLs: [
                    {
                        title: '甲方名称',
                        key: 'corpName'
                    },
                    {
                        title: '网址',
                        key: 'url'
                    },
                    {
                        title: '创建时间',
                        key: 'ts'
                    }
                ],
                dataLs: [],  // 列表数据
                dataEn: [],  // 入场列表数据
                listFrom: 0,  // 起始位置
                listTo: 10,  // 列表长度
                listTotal: 0 , // 列表总条数
                listFrom1: 0,  // 入场起始位置
                listTo1: 10,  // 入场列表长度
                listTotal1: 0 , // 入场列表总条数
                columnsEn: [
                    {
                        title: '甲方名称',
                        key: 'corpName'
                    },
                    {
                        title: '网址',
                        key: 'url'
                    },
                    {
                        title: '创建时间',
                        key: 'ts'
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
                                    this.openSelect(params.row.id)
                            }
                    }
            }, '选择')
        ]);
        }
        }
        ]
        }
        },
        methods: {
            getList () {  // 获取列表
                const url = api.getApplyFirstPar();
                var liData = {
                    start: this.listFrom,
                    length: 10,
                    sqlKey: '1'
                }

                this.ajax.post(url, liData, (data) => {
                    this.dataLs = data.data.list;
                this.listTotal = data.data.total;

                if (data.data.list.length < this.listTo) {
                    this.listTo = data.data.list.length
                }
            });
            },
            getApplyList () {  // 获取入场列表
                const url = api.getApplyFirstPar();
                var appData = {
                    start: this.listFrom1,
                    length: 10,
                    sqlKey: null,
                    firstName: this.openSearch
                }

                this.ajax.post(url, appData, (data) => {
                    this.dataEn = data.data.list;
                this.listTotal1 = data.data.total;

                if (data.data.list.length < this.listTo1) {
                    this.listTo1 = data.data.list.length
                }
            });
            },
            changePage (n) {  // 切换分页，重载数据
                this.listTo = 10;
                this.listFrom = this.listTo * (n - 1);
                this.getList();
            },
            changePage1 (n) {  // 切换分页，重载数据
                this.listTo1 = 10;
                this.listFrom1 = this.listTo1 * (n - 1);
                this.getApplyList();
            },
            openEntrance() {
                this.getApplyList();
                this.entrance = true;
            },
            selectRows (selection) {  // 选中的行
                this.selectedList = selection;
            },
            closeEntrance() {
                this.entrance = false;
            },
            openSelect(id) {  // 确认入场
                //alert(id);
                const url = api.getApplySup();
                var params = {
                    id: id
                };
                this.ajax.post(url, params, (data) => {
                    if (data.error_code == 200) {
                        this.$Message.success('操作成功!');
                        this.closeEntrance();
                        this.getList();
                    }else{
                        this.$Message.error(data.error_msg);
                    }

            });

            }
        },
        created () {
            this.getList();
        }
    }
</script>

<style scoped>
    @import  "../assets/css/control.css";
</style>