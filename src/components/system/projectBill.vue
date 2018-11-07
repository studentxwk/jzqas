<template>
    <div class="projectBill layout-content">
        <Row>
            <Col span="12">
            <div class="opt1">
                <div class="optItem">
                    <span class="lb">NC系统</span>
                    <Select v-model="ncmodel" clearable filterable style="width:200px">
                        <Option v-for="item in nclist" :value="item.id" :key="item.id">{{ item.corpName }}</Option>
                    </Select>
                </div>
            </div>
            </Col>
            <div class="contractListOpt" style="line-height: normal;">
                <div class="contractListOptItem">
                    <span><Input v-model="search" icon="ios-search"  placeholder="输入项目名或项目名关键字" style="width:300px;"></Input></span>
                    <span><Button type="success" @click="getProjectList()">查询</Button></span>
                </div>
            </div>
            </Col>
        </Row>
        <Row>
            <Col span="12">
            <div class="opt1">
                <div class="optItem">
                    <span class="lb">计费开始日期</span>
                    <DatePicker class="input" v-model="beginDate" type="date" placeholder="选择日期"
                                style="width: 200px"></DatePicker>
                </div>
            </div>
            </Col>
            <Col span="12">
            <div class="opt">
                <div class="optItem">
                    <span class="lb">计费结束日期</span>
                    <DatePicker class="input" v-model="endDate" type="date" placeholder="选择日期"
                                style="width: 200px"></DatePicker>
                </div>
            </div>
            </Col>
        </Row>
        <div class="contractList">
        <div class="contractListOpt" style="line-height: normal;">
            <div class="contractListOptItem">
                <span><Input v-model="search" icon="ios-search"  placeholder="输入项目名或项目名关键字" style="width:300px;"></Input></span>
                <span><Button type="success" @click="getProjectList()">查询</Button></span>
            </div>
        </div>
        <Table border :columns="columns7" :data="projectList"></Table>
        <div style="margin: 10px;overflow: hidden">
            <p style="float: left;line-height: 32px;font-size: 14px;">
                当前展示 {{ listFrom }} 到 {{ listFrom + listTo }} 条，共 {{ listTotal }} 条
            </p>
            <div style="float: right;">
                <Page :total="listTotal" :current="1" @on-change="changePage"></Page>
            </div>
        </div>
        </div>
    </div>
    <!--<div class="projectBill layout-content">-->
    <!--<div class="opt">-->
    <!--<div class="optItem">-->
    <!--<span class="lb">NC系统</span>-->
    <!--<Select v-model="ncmodel" clearable filterable style="width:300px">-->
    <!--<Option v-for="item in nclist" :value="item.id" :key="item.id">{{ item.corpName }}</Option>-->
    <!--</Select>-->
    <!--</div>-->
    <!--<div class="optItem">-->
    <!--<span class="lb">授权项目数</span>-->
    <!--<Input type="text" v-model="limitNum" style="width: 300px" placeholder="输入授权项目数"></Input>-->
    <!--</div>-->
    <!--</div>-->

    <!--<div class="opt">-->
    <!--<div class="optItem">-->
    <!--<span class="lb">计费开始日期</span>-->
    <!--<DatePicker class="input" v-model="beginDate" type="date" placeholder="选择日期"></DatePicker>-->
    <!--</div>-->
    <!--<div class="optItem">-->
    <!--<span class="lb">计费结束日期</span>-->
    <!--<DatePicker class="input" v-model="endDate" type="date" placeholder="选择日期"></DatePicker>-->
    <!--</div>-->
    <!--</div>-->

    <!--</div>-->
</template>

<script>
    import router from '../../router';
    import api from '../../utils/api';
    import axios from 'axios';

    export default {
        data() {
            return {
                columns7: [
                    {
                        title: '项目名称',
                        align: 'center',
                        key: 'projectName'
                    }
                ],
                search: '',
                ncmodel: '',
                limitNum: '',
                beginDate: '',
                endDate: '',
                projectList: [],
                nclist: [],
                listFrom: 0,  // 起始位置
                listTo: 10,  // 列表长度
                listTotal: 0  // 列表总条数
            }
        },
        methods: {
            getNClist() {
                const url = api.getAllFpList();
                this.ajax.get(url, null, (data) => {
                    console.log(data);
                    this.nclist = data.data;
                });
            },
            getProjectList() {
                const Url = api.getAllProject();
                var Data = {
                    start: this.listFrom,
                    length: 10,
                    search: this.search,
                };
                this.ajax.get(Url, Data, (data) => {
                    this.projectList = data.data.list;
                    this.listTotal = data.data.total;
                    if (data.data.length < this.listTo) {
                        this.listTo = data.data.length;
                    }
                });
            },
            changePage (n) {  // 切换分页，重载数据
                this.listTo = 10;
                this.listFrom = this.listTo * (n - 1);
                this.getProjectList();
            },
        },
        computed: {},
        created() {
            this.getNClist();
            this.getProjectList();
        }
    }
</script>
<style scoped lang="less">
    /*@import "../../assets/css/contract-manage.less";*/
    @import "../../assets/css/control.css";

    .projectBill {
        .opt {
            margin-left: 40px;
            margin-top: 20px;
            height: 20px;
            line-height: 20px;
            .optItem {
                float: left;
                height: 60px;
                margin-left: 10px;
                .lb {
                    display: inline-block;
                    margin-right: 10px;
                    padding-right: 20px;
                    width: 100px;
                    text-align: right;
                }
            }
        }
        .opt1 {
            margin-left: 40px;
            margin-top: 20px;
            height: 20px;
            line-height: 20px;
            .optItem {
                /*float: right;*/
                height: 60px;
                margin-left: 10px;
                .lb {
                    display: inline-block;
                    margin-right: 10px;
                    padding-right: 20px;
                    width: 100px;
                    text-align: right;
                }
            }
        }
        .contractList {
            .contractListOpt {
                height: 50px;
                line-height: 50px;
                .contractListOptItem {
                    float: left;
                    margin-right: 15px;
                }
            }
            padding: 10px;
        }
    }
</style>
