<template>
    <div class="layout">
        <Row class="layout-content">
            <i-col span="4" class="left-menu">
                <h5 class="menus-name">消息展示</h5>
                <ul class="all-items">
                    <li v-for="(item, index) in allItems" :class="{active: item.isActive}" @click="changeActive(item,index)" v-text="item.text"></li>
                </ul>
            </i-col>

            <i-col span="20"  style="padding:33px 0 0 10px">
                <Table :columns="columnsLs" :data="dataLs"></Table>
            </i-col>

        </Row>
    </div>
</template>

<script>
    import api from '../utils/api';
    import router from '../router';

    export default {
        data () {
            return {
                allItems: [
                    {text: '未读消息', isActive: true,value:'1'},
                    {text: '已读消息', isActive: false,value:'0'}
                ],
                columnsLs: [
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '内容',
                        key: 'content'
                    },
                    {
                        title: '消息日期',
                        key: 'createdate'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                        var rowStatus = params.row.status;
                        if (rowStatus == 0) {
                             return '已读';
                        } else {
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
            }, '改为已读')
        ]); }
        }
        }

                ],

            dataLs:[]
            }
        },


        methods: {
            changeActive(item,index) {
                this.allItems.map((item, i) => {
                    if(i == index) {
                      item.isActive = true;
                     }else {
                      item.isActive = false;
                     }
              });
              this.getMessageList(item.value);

          },
          getMessageList(val) {
              var data = {type:val};
              const url = api.getNotice();
              this.ajax.get(url,data,(data) =>{
                  this.dataLs = data.data;
          });
          },
          openSelect(id){
              const url = api.editNotice() + '/' + id;
              this.ajax.post(url,null,(data) => {
                  this.getMessageList(null);
              });
          }
        },
        created() {
            this.getMessageList(null);
        }
    }
</script>
