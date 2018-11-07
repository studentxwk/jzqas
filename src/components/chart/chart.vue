<template>
  <div id="myChart" :style="{ height: '500px'}"></div>
</template>
<script>
  import api from '../../utils/api';
  export default {
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted(){
      var par = this.$route.params.id;
      this.getChartData(par);
    },
    methods: {
      getChartData(dataKey){
          const url = api.ChartUrl();
        var reqData = {
          dataKey: dataKey
        };

        this.ajax.post (url, reqData, (data) => {
          if (data.error_code == 200) {
              this.drawLine(data.data);
            }else{
              this.$Message.error('加载失败!');
            }
          });
      },
      drawLine(data){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: data.title,
            subtext: data.subTitle
          },
          tooltip: {

          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          xAxis: {
            type : 'category',
            data: data.xData
          },
          yAxis: {
            type : 'value'
          },
          series: [{
            name: data.seriesName,
            type: data.chartType,
            data: data.yData,
            markPoint : {
              data : [
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
              ]
            },
            markLine : {
              data : [
                {type : 'average', name: '平均值'}
              ]
            }
          }]
        });
      }
    },
    computed: { },
    created() {

    },
    watch: {
      '$route' (to, from) {
        // 对路由变化作出响应...
        var par = this.$route.params.id;
        this.getChartData(par);
      }
    }
  }

</script>

