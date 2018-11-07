<template>
  <div class="contractList">
    <Table :columns="contractListHead" :data="contractListData" border></Table>
  </div>
</template>
<script>
  import router from '../router';
  import api from '../utils/api';
  export default {
    data () {
      return {
        contractListHead: [{
          title: '合同模板名称',
          key: 'templetName'
        },
          {
            title: '合同模板标题',
            key: 'templetCaption'
          },
          {
            title: '合同模板编码',
            key: 'templetCode'
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
                      this.edit(params)
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ],
        contractListData: []
      }
    },
    methods: {
      edit(contract){
        router.push({path: "/contractMaker", query: {billCode: contract.row.templetCode}});
      },
      getList(){
        const url = api.contractList(),
          data = {
            start: 0,
            length: 10,
            search: ''
          };
        var _this = this;
        this.ajax.get(url, data, (data) => {
          _this.contractListData = data.data.list;
        });
      }

    },
    computed: {},
    created () {
      this.getList();
    }
  }

</script>
<style scoped lang="less">
  @import "../assets/css/contract-list.less";
</style>
