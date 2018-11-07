<template>
    <div class="contractManage layout-content" style="padding:0;">
        <div class="contractList">
            <Form :model="formItem" :label-width="100">
                <div class="contractListOpt" style="line-height: normal;text-align:left;">
                    <Button type="ghost" style="width: 100px;" @click="cancle">取 消</Button>
                    <Button v-if="itemStatus" type="success" @click="approve(1)"
                            style="width: 100px;margin-left: 10px;">审批通过
                    </Button>
                    <Button v-if="itemStatus" type="warning" @click="approve(2)"
                            style="width: 100px;margin-left: 10px;">审批不通过
                    </Button>
                </div>

                <Collapse v-model="model2" style="margin-right: 20px;">
                    <Panel name="1" style="text-align: left">
                        审批信息
                        <div slot="content" style="padding: 0 20px">
                            <Form-item label="审批意见">
                                <Input v-if="formItem.status == 0" v-model="formItem.auditopinion" type="textarea"
                                       :autosize="{minRows: 3,maxRows: 5}" style="width:300px;float: left;"></Input>
                                <Input v-if="formItem.status != 0" v-model="formItem.auditopinion" type="textarea"
                                       :autosize="{minRows: 3,maxRows: 5}" style="width:300px;float: left;"
                                       readonly></Input>
                            </Form-item>
                        </div>
                    </Panel>
                </Collapse>
                <Collapse v-model="model" style="margin-right: 20px;">
                    <Panel name="1" style="text-align: left">
                        用户信息
                        <div slot="content" style="padding: 0 20px">
                            <Form-item label="用户名" style="float: left;">
                                <Input v-model="formItem.userCode" type="text" style="width:300px" readonly></Input>
                            </Form-item>
                            <Form-item label="手机号码">
                                <Input v-model="formItem.phone" type="text" style="width:300px;float: left;"
                                       readonly></Input>
                            </Form-item>
                        </div>
                    </Panel>
                </Collapse>
                <Collapse v-model="model1" style="margin-right: 20px;">
                    <Panel name="1" style="text-align: left">
                        供应商信息
                        <div slot="content" style="padding: 0 20px">
                            <Form-item label="公司名称" style="float: left;">
                                <Input v-model="formItem.supplierName" type="text" style="width:300px" readonly></Input>
                            </Form-item>
                            <Form-item label="营业执照号">
                                <Input v-model="formItem.corpRegNo" type="text" style="width:300px;float: left;"
                                       readonly></Input>
                            </Form-item>
                            <Form-item label="公司法人" style="float: left;">
                                <Input v-model="formItem.corporation" type="text" style="width:300px" readonly></Input>
                            </Form-item>
                            <!-- <Form-item label="主要供应类型">
                               <Input v-model="formItem.vendorType" type="text"  style="width:300px;float: left;" readonly></Input>
                             </Form-item>-->
                            <Form-item label="主要供应类型">
                                <Select v-model="formItem.vendorType" style="width:300px;float: left;">
                                    <Option disabled v-for="item in supplyTypeList" v-bind:value="item.ienumValue"
                                            v-bind:key="item.ienumValue">{{ item.vdisplayName }}
                                    </Option>
                                </Select>
                            </Form-item>
                            <Form-item label="企业地址" style="float: left;">
                                <Input v-model="formItem.corpAddress" type="text" style="width:300px" readonly></Input>
                            </Form-item>
                            <Form-item label="电话">
                                <Input v-model="formItem.phoneNum" type="text" style="width:300px;float: left;"
                                       readonly></Input>
                            </Form-item>
                            <Form-item label="传真" style="float: left;">
                                <Input v-model="formItem.faxNum" type="text" style="width:300px" readonly></Input>
                            </Form-item>
                        </div>
                    </Panel>
                </Collapse>
            </Form>
        </div>
    </div>
</template>
<script>
    import router from '../router';
    import api from '../utils/api';

    export default {
        data() {
            return {
                itemStatus: false,
                supplyTypeList: [],
                formItem: {
                    id: '',
                    userCode: '',
                    phone: '',
                    supplierName: '',
                    corpRegNo: '',
                    corporation: '',
                    vendorType: '',
                    corpAddress: '',
                    phoneNum: '',
                    faxNum: '',
                    status: '',
                    auditopinion: ''
                },
                model: '1',
                model1: '1',
                model2: '1',
            }
        },
        methods: {
            // 主要供应类型获取列表
            getSupplyTypeList() {
                const url = api.getSupplyType();
                this.ajax.get(url, null, (data) => {
                    this.supplyTypeList = data.data;
                });
            },
            //审批
            approve(approveStatus) {
                const url = api.approveSupplier();
                var data = {
                    id: this.formItem.id,
                    status: approveStatus,
                    auditopinion: this.formItem.auditopinion
                };
                this.ajax.post(url, data, (data) => {
                    this.$Message.success('审批成功');
                    this.$router.push({
                        path: "/SystemManage/supplierApprove"
                    });
                }, (data) => {
                    this.$Message.error(data.error_msg);
                });
            },
            cancle() {
                history.back();
            },
            //查询要查看的数据
            getDetailMessage(id) {
                this.formItem.id = id;
                const url = api.getSupplierTempById(id);
                this.ajax.post(url, null, (data) => {
                    this.formItem = data.data;
                    if(this.formItem.status == 0) {
                        this.itemStatus = true;
                    }
                });
            },
        },
        created() {
            //查看
            var approveId = this.$route.query.id;
            this.getDetailMessage(approveId);
            this.getSupplyTypeList();
        }
    }
</script>
<style scoped lang="less">
    @import "../assets/css/contract-manage.less";

    .error_border {
        border: 1px #ff3300;
    }

    .error_border2 {
        border: 1px solid #ff3300;
    }
</style>