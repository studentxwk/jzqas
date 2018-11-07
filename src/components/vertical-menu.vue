<template>
  <div class="vertical-menu">
    <ul class="all-items">
      <li v-for="(item, index) in menuListData" :class="{active: item.isActive}" @click="handleChange(index)"
          v-text="item.text"></li>
    </ul>
  </div>
</template>
<script>

  export default {
    data () {
      return {}
    },
    props: {
      menuListData: {
        type: Array,
        default: [{'text': '首创世界花园项目', 'isActive': false}, {'text': '中央电视塔项目', 'isActive': true}],
        required: true
      }
    },
    methods:{
      handleChange(index){
          //console.log(index);
          this.$emit('handleChange',index)
      }
    }
  }
</script>
<style scoped>
  .all-items .active {
    background-color: #43cf61;
    color: #fff;
  }

  .all-items li {
    line-height: 44px;
    color: #55626e;
    text-align: left;
    padding-left: 20px;
    cursor: pointer;
    font-size: 14px;
  }
</style>
