<template>
  <el-row :gutter="20">
    <el-form :model="searchData">
      <el-col :span="4">
        <el-form-item label="时间范围"></el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="团队名称"></el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="员工名称"></el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="员工等级"></el-form-item>
      </el-col>
      <el-col :span="8" style="text-align: right;">
        <el-button type="text" icon="el-icon-delete">清空筛选条件</el-button>
        <el-input placeholder="请输入搜索关键字" v-model="searchData.param" class="input-with-select" style="width:200px" size="mini">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-form>
  </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    props: {
      searchData: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    watch: {
      searchData: {
        handler: () => {
          console.log(111);
        },
        deep: true
      }
    }
  };

</script>
<style lang="less">
</style>
