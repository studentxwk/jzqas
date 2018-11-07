const host = '';
const path = '/supplier-admin-web';

export default {
  rootUrl() {  // root
    return host + path
  },
  login() {  // 登录接口
    return host + path + '/common/login'
  },
  register() {  // 注册接口
    return host + path + '/sm/sm_user/register'
  },
  register2() {  // 注册接口2
    return host + path + '/sm/sm_user/register2'
  },
  userInfo() {  // 获得userModel
    return host + path + '/sm/sm_user/userInfo'
  },
  saveUserBasic() {  // save user  supplier/firstparty
    return host + path + '/sm/sm_user/saveUser'
  },
  userEditPsw() {  // user password edit
    return host + path + '/sm/sm_user/password/edit'
  },
  ownerInfoLs(supId, status) {  // 甲方信息列表 [status 列表：0；申请列表：1]
    return host + path + '/sm/supplier/fp/' + supId + '/' + status
  },
  sureApply() {  // 供应商申请入场 确认
    return host + path + '/sm/supplier/apply/'
  },
  supplyInfoLs() {  // 供应商信息列表
    return host + path + '/sm/sp/getSupplierList'
  },
  supplyRatify() {  // 供应商管理（批准）
    return host + path + '/sm/fp/supplier/agree'
  },
  smTemplet(){
    return host + path + '/cn/supplier/getTemplet' //供应商登录 获取定制合同模板
  },
  templet(){
    return host + path + '/sm/templet'
  },
  loadTemplet(){
    return host + path + '/bt/loadtemplet'
  },
  // 合约管理(甲方登录)
  contractList() {
    return host + path + '/sm/templet/list'  // 合同列表（列表）
  },
  btTemplet(){
    return host + path + '/sm/templet/loadtemplet' // 查询预制模板
  },
  // 合约管理(供应商登录)
  getContractListData(){
    return host + path + '/cn/supplier/compactList' // 查询合同列表
  },
  contractSave(){
    return host + path + '/cn/supplier/saveCompact'; // 编辑合同信息
  },
  contractSubmit(){
    return host + path + '/cn/supplier/submitCompactInfo'; //提交合同数据到NC
  },
  getContractData(){
    return host + path + '/cn/supplier/compactInfo'  // 查询合同信息
  },
  getNClist(){
    return host + path + '/cn/supplier/ncSelect'; //nc系统 下拉select(废弃)
  },
  getReceiveList(){
    return host + path + '/in/receiveList'; // 收款单列表
  },
  // 获取结算列表
  getSettleListData(){
    return host + path + '/se/settleList'
  },
  //获取开票列表信息
  getOpenListData(){
    return host + path + '/oi/openinvList'
  },
  //保存开票信息
  saveOpenInfo(){
    //debugger;
    return host + path + '/oi/saveOpeninv'
  },
  //提交開票信息
  submitOpen(openid){
    return host + path + '/oi/submitOpeninv/' + openid
  },
  //刪除開票信息
  delOpenData(id){
    return host + path + '/oi/deleteOpeninv/' + id;
  },
  //根据开票id获取开票信息
  getOpenDataById(openId){
    return host + path + '/oi/getOpenById/' + openId;
  },
  //修改开票信息
  modifyOpenInfo(){
    return host + path + '/oi/modifyOpenInfo'
  },
  //项目下拉菜单
  getProjectList(){
    return host + path + '/cn/supplier/projectSelect'
  },
  //合同下拉菜单
  getContractTypeList(){
    return host + path + '/cn/supplier/typeSelect'  //废弃
  },
  //保存结算信息
  saveSubsettle(){
    return host + path + '/se/saveSettle'
  },
  getRefUrl(){
    return host + path + '/pu/ref/list'   //公共引用控制url
  },
  //结算提交到nc
  submitSettle(id){
    return host + path + '/se/submitSettle/' + id
  },
  //根据id查询结算对象信息
  getSettleById(id){
    return host + path + '/se/getSettleById/' + id
  },
  //删除结算信息
  deleteSettle(id){
    return host + path + '/se/deleteSettle/' + id
  },
  getApplyFirstPar(){
    return host + path + '/sm/fp/noFpFirstpar'    // 供应商 列表  and 申请入场 获取甲方列表
  },
  getApplySup(){
    return host + path + '/sm/fp/supApply'    // 申请入场
  },
  getSupplyType() {
    return host + path + '/bd/supplyType'    // 获取主要供应类型
  },
  getProjectList() {
    return host + path + '/sm/permission/getProjectInfo'    // 获取甲方 项目
  },
  addProject2Supplier() {
    return host + path + '/sm/permission/userPermissions'    // 授权供应商项目信息
  },
  getFreeSupplierList(){
    return host + path + '/sm/sp/getSupplier'; // 查询没有和甲方建立关系的供应商
  },
  proSupplierList(){
    return host + path + '/sm/permission/getSupplierList'; // 项目授权查询供应商
  },
  getProSupList(){
    return host + path + '/sm/permission/getProSupList'; // 项目授权查询项目和供应商关系
  },
  delCompact(){
    return host + path + '/cn/delete'; // delete compact
  },
  //获取登录用户类型
  getUserType(){
    return host + path + '/pu/userType';
  },

  getNotice() {
    return host + path + '/no/getNoticeList';  // 消息查询
  },
  editNotice() {
    return host + path + '/no/editNotice'; // 修改消息状态
  },
  //chart public url
  ChartUrl(){
    return host + path + '/pu/ct/data';
  },
  photoUrl(){
    return host + path + '/pu/file/upload';
  },
  saveHead() {
    return host + path + '/pu/file/saveUpload'; // 保存头像
  },
//手机获取验证码
  getPhoneCode(){
    return host + path + '/sm/phone/getPhoneCode';
  },

  //修改手机号
  modifyPhone(){
    return host + path + '/sm/phone/modifyPhone';
  },
  //查询用户名是否存在
  validName(){
    return host + path + '/sm/resetPassword/validName';
  },
  //验证码是否正确
  validCode(){
    return host + path + '/sm/resetPassword/validCode';
  },
  //验证码是否正确
  updatePassword(){
    return host + path + '/sm/resetPassword/updatePassword';
  },
  //获取所有甲方
  getAllFpList(){
    return host + path + '/sm/all/firstparty';
  },
  //获取授权项目数列表
  getProjectLimitsList(){
    return host + path + '/sm/projectLimits/list';
  },
  //保存授权项目数
  saveLimitNum() {
    return host + path + '/sm/projectLimit';
  },

  //删除授权项目数
  delProjectLimit() {
    return host + path + '/sm/delProjectLimit';
  },
  //修改授权项目数
  updateLimitNum() {
    return host + path + '/sm/updateLimitNum';
  },
  //判断授权项目数量是否足够
  getProjectCharge(){
    return host + path + '/sm/projectCharge';
  },
  //删除授权项目下的供应商
  delProSupplier(){
    return host + path + '/sm/permission/delProSupplier';
  },

  //获取用户
  getAllUser(){
    return host + path + '/sm/sm_user/getAllUser';
  },
  //获取注册供应商信息
  getSupplierList(){
    return host + path + '/sm/sm_user/getSupplierList';
  },
  //添加用户
  saveUserInfo(){
    return host + path + '/sm/sm_user/saveUserInfo';
  },
  //获取用户
  getUserInfo(){
    return host + path + '/sm/sm_user/';
  },
  //删除用户
  delUserInfo(){
    return host + path + '/sm/delUser/';
  },
  //用户唯一性校验
  userUnique(){
    return host + path + '/sm/sm_user/username_unique';
  },
  //供应商审批
  approveSupplier(){
    return host + path + '/sm/sm_user/approveSupplier/';
  },
  //根据id查询注册供应商信息
  getSupplierTempById(id){
    return host + path + '/sm/sm_user/getSupplierTempById/' + id
  },
  // 查询所有项目
  getAllProject(){
    return host + path + '/sm/projectBill/getProCostList'
  },
  //项目计税页，选择NC系统
  getFirProject(){
    return host + path + '/sm/projectBill/getFirProject';
  },
  //项目计税页，选择项目
  AllProjectInfo(){
    return host + path + '/sm/projectBill/AllProjectInfo';
  },
  //新增计税
  addProCost(){
    return host + path + '/sm/projectBill/addProCost';
  },
  //修改计费
  getProCost(){
    return host + path + '/sm/projectBill/getProCost';
  },
  projectAbledValid(){
    return host + path + '/sm /permission/getProjectTime';
  }
}
