<template>
  <div class="img-gallery">
    <div class="img-gallery left">
    </div>
    <div class="img-gallery right">
      <div class="right-header clearfix">
        <div class="right-header left">
          <el-input placeholder="请输入项目编号或名称" v-model="searchData" class="input-with-select" size="mini">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="right-header right">
          <el-button type="text" v-show="isCancelEdit" @click="CancelEdit"><i class="gallery_cancel"></i>撤销批量操作</el-button>
          <el-button type="text" @click="edit" v-show="!isEdit"><i class="gallery_edit"></i>批量操作</el-button>
          <el-button type="text" v-show="isEdit" @click="isEdit = false">完成</el-button>
          <el-button type="text" v-show="isEdit" @click="dialogVisible.handler = true">操作</el-button>
          <el-button type="primary" size="mini" @click="lookHistory">历史记录</el-button>
        </div>
      </div>
      <div class="right-body">
        <ul>
          <li v-for="(item,index) in currImgArr">
            <div class="img-box" @dblclick="lookImg(index)">
              <el-checkbox v-model="item.isSelected" v-if="isEdit"></el-checkbox>
              <img :src="item.src" alt="唔系渣渣辉" />
            </div>
            <div class="download-icon" v-if="!item.isDownLoad"></div>
          </li>
        </ul>
      </div>
      <!-- 查看图片弹窗部分 -->
      <el-dialog title="图片浏览" :visible.sync="dialogVisible.view" width="720px" :close-on-click-modal="false">
        <div @mouseover="dialogVisible.footer=true" @mouseout="dialogVisible.footer=false">
          <div class="dialog-body-main">
            <i class="icon previous" v-show="imgObj.last&&dialogVisible.footer" @click="setPrevious"></i>
            <i class="icon next" v-show="imgObj.next&&dialogVisible.footer" @click="setNext"></i>
            <img :src="imgObj.src" class="dialog-body-main-img" alt="唔系渣渣辉" :style="{'transform': 'scale('+imgObj.scale/100+')'}" />
          </div>
          <div class="dialog-footer" v-show="dialogVisible.footer">
            <el-popover trigger="click" class="gallery" placement="top-start">
              <el-slider v-model="imgObj.scale" :vertical="true" :max="400" :min="50" :showTooltip="false"></el-slider>
              <i class="icon gallery_zoom" slot="reference"></i>
            </el-popover>
            <i class="icon gallert_download" v-show="imgObj.isDownlaod"></i>
            <i :class="[{'icon gallery_previous_on':imgObj.last},{'icon gallery_previous_off':!imgObj.last}]" @click="setPrevious"></i>
            <i :class="[{'icon gallery_next_on':imgObj.next},{'icon gallery_next_off':!imgObj.next}]" @click="setNext"></i>
            <el-button type="primary" size="mini" v-for="item in transform[currType]" :key="item.value" round>{{item.label}}</el-button>
            <i :class="[{'icon gallery_return_on':imgObj.history.length},{'icon gallery_return_off':!imgObj.history.length}]"></i>
            <i class="icon gallery_more"></i>
          </div>
        </div>
      </el-dialog>
      <!-- 批量操作 -->
      <el-dialog title="批量操作" :visible.sync="dialogVisible.handler" width="360px" :close-on-click-modal="false">
        <el-radio-group v-model="transformType">
          <el-radio v-for="item in transform[currType]" :key="item.value" :label="item.value" v-if="!item.isshow">{{item.label}}</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible.handler = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="save">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 历史记录 -->
      <el-dialog title="历史记录" :visible.sync="dialogVisible.history" width="720px" :close-on-click-modal="false">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="dialogVisible.history = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import mouseEvent from "../../static/mouseEvent.js";
  export default {
    data() {
      return {
        i: 100,
        searchData: null, // 查询内容
        isEdit: false, // 是否为编辑状态
        isCancelEdit: false, //是否显示撤销按钮
        transformType: "", //转化种类
        dialogVisible: {
          handler: false,
          view: false,
          history: false,
          footer: false
        }, //弹窗显示状态
        imgObj: {
          scale: 100, //缩放比例
          isDownlaod: "", //能否下载
          history: [], //保存之前操作,
          last: "", //上一个
          next: "", //下一个
          index: "",
          src: ""
        }, // 图片对象
        transform: {
          五差: [{
              label: "转普通",
              value: "转普通"
            },
            {
              label: "转七分",
              value: "转七分"
            }
          ],
          普通: [{
              label: "转五差",
              value: "转五差"
            },
            {
              label: "转七分",
              value: "转七分"
            }
          ],
          七分: [{
              label: "转五差",
              value: "转五差"
            },
            {
              label: "转五佳",
              value: "转五佳"
            }
          ],
          五佳: [{
              label: "设第一",
              value: "设第一",
              isshow: true
            }, //只有一张能设第一，无法批量操作
            {
              label: "转五差",
              value: "转五差"
            },
            {
              label: "转七分",
              value: "转七分"
            }
          ]
        }, //图片所有种类转换
        currType: "五佳", // 当前选择的图片种类
        currImgArr: [{
            isSelected: false,
            isDownLoad: true,
            src: require("../assets/icon/gallery_previous.png")
          },
          {
            isSelected: false,
            isDownLoad: false,
            src: require("../assets/icon/下载.jpg")
          },
          {
            isSelected: false,
            isDownLoad: false
          },
          {
            isSelected: false,
            isDownLoad: false
          },
          {
            isSelected: false,
            isDownLoad: false
          },
          {
            isSelected: false,
            isDownLoad: false
          },
          {
            isSelected: false,
            isDownLoad: false
          },
          {
            isSelected: false,
            isDownLoad: false
          },
          {
            isSelected: false,
            isDownLoad: false
          }
        ], // 当前选择的图库
        lastHandlerData: [] //之前操作选择的数据
      };
    },
    mounted() {},
    methods: {
      /* 
       *查询当前树节点下的图库
       */
      searchList() {
        // 此处应有接口，然而没有
      },
      /* 
       *撤销批量操作
       */
      CancelEdit() {
        let str = this.lastHandlerData.join(",");
        // ======此处应有接口，然而没有======
        this.isCancelEdit = false; //隐藏撤销按钮
        this.searchList();
      },
      /* 
       *批量操作
       */
      edit() {
        this.currImgArr.forEach(val => (val.isSelected = false)); //初始化checkbox
        this.isCancelEdit = false; //隐藏撤销按钮
        this.isEdit = true; //显示完成、操作按钮
      },
      /* 
       *保存批量操作
       */
      save() {
        this.lastHandlerData = this.currImgArr.map(val => val.id); //保存操作
        let str = this.lastHandlerData.join(",");

        // ======此处应有接口，然而没有======
        this.searchList();
        this.dialogVisible.handler = false;
        this.isCancelEdit = true; //显示撤销按钮
        this.isEdit = false; //隐藏完成、操作按钮
      },
      /* 
       *查看当前树节点历史记录
       */
      lookHistory() {
        // ======此处应有接口，然而没有======
        this.dialogVisible.history = true;
      },
      /* 
       *查看选中的图片
       */
      lookImg(index) {
        this.imgObj = {
          scale: 100, //缩放比例
          isDownlaod: this.currImgArr[index].isDownLoad, //能否下载
          history: [], //保存之前操作,
          last: index - 1 < 0 ? null : index - 1 + "", //上一个
          next: index + 1 > this.currImgArr.length - 1 ? null : index + 1 + "", //下一个
          index: index,
          src: this.currImgArr[index].src
        }; // 图片对象
        this.dialogVisible.view = true;

        //监听鼠标滚轮事件
        this.$nextTick(_ => {
          let dom = document.getElementsByClassName("dialog-body-main")[0];
          //  左边距最大值
          mouseEvent(dom, "mousewheel", e => {
            if (e.deltaY > 0) {
              if (this.imgObj.scale >= 60) {
                this.imgObj.scale -= 10;
              }
            } else {
              if (this.imgObj.scale <= 390) {
                this.imgObj.scale += 10;
              }
            }
          });
        });
      },
      /* 
       *上一张图
       */
      setPrevious() {
        if (this.imgObj.index - 1 >= 0) {
          this.lookImg(this.imgObj.index - 1);
        }
      },
      /* 
       *下一张图
       */
      setNext() {
        if (this.imgObj.index + 1 <= this.currImgArr.length - 1) {
          this.lookImg(this.imgObj.index + 1);
        }
      }
    }
  };

</script>
<style lang="less">
  @import url("../assets/style/gallery.less");

</style>
