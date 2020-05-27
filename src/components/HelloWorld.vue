<template>
  <el-container class="el-container">
    <div class="edit-image">
      <div class="operation-wrapper">
        <el-button type="text"
                   v-for="obj in operationList"
                   :class="active===obj.id?'active':''"
                   @click="shapeToggle(obj.id)">{{obj.name}}</el-button>
      </div>
      <div class="image-wrapper">
        <img src="@/assets/img/2.jpg"/>
      </div>
      <div class="style-config" v-if="active>1&&active<7">
        <span class="stroke-width" v-if="active>1&&active<5">
          <span :class="currentImage.strokeWidth===2?'checked':''"
                @click="changeStrokeWidth(2)">1</span>
          <span :class="currentImage.strokeWidth===4?'checked':''"
                @click="changeStrokeWidth(4)">2</span>
          <span :class="currentImage.strokeWidth===8?'checked':''"
                @click="changeStrokeWidth(8)">3</span>
        </span>
        <span class="font-size-select">
          <el-select v-model="fontSize" @change="changeFontSize">
            <el-option v-for="size in fontSizeList" :key="size" :value="size">{{size}}</el-option>
          </el-select>
        </span>
        <span class="stroke-color">
          <span class="checked" :style="{backgroundColor: checkedColor}"></span>
          <span class="check-group">
            <span v-for="(color,i) in colorList"
                  :key="i"
                  :style="{backgroundColor: color}"
                  @click="changeColor(color)"></span>
          </span>
        </span>
      </div>
      <div id="svg-container"></div>
      <div id="textInput" class="text-input"
           contenteditable="true"
           :style="{
           color: currentImage.text.color,
           fontSize: `${currentImage.text.fontSize}px`
           }"></div>
    </div>
  </el-container>
</template>

<script>
import { drawInit, toggleDrawingMode } from '@/js/draw'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      imageUrl: '',
      active: 0,
      operationList: [
        {
          id: 1,
          name: '移动'
        },
        {
          id: 2,
          name: '箭头'
        },
        {
          id: 3,
          name: '方框'
        },
        {
          id: 4,
          name: '圆形'
        },
        {
          id: 5,
          name: '文本'
        },
        {
          id: 6,
          name: '标签'
        },
      ],
      checkedColor: '',
      colorList: [
        '#ea4c72', '#f5b225', '#48c486', '#4386f5', '#000000', '#ffffff'
      ],
      fontSizeList: [8, 9, 10, 12, 14, 16, 18, 20, 22],
      fontSize: ''
    };
  },
  mounted () {
    drawInit()
  },
  methods: {
    ...mapActions('editImage', [
      'updateStrokeWidth',
      'updateColor',
      'updateFontSize'
    ]),
    shapeToggle (shapeId) {
      this.active = shapeId
      toggleDrawingMode(shapeId)
      switch (shapeId) {
        case 2:
          this.checkedColor = this.currentImage.pathColor
          break
        case 3:
          this.checkedColor = this.currentImage.rectColor
          break
        case 4:
          this.checkedColor = this.currentImage.ellipseColor
          break
        case 5:
          this.checkedColor = this.currentImage.text.color
          this.fontSize = this.currentImage.text.fontSize
          break
        case 6:
          this.checkedColor = this.currentImage.tag.color
          break
        default:
          break
      }
    },
    changeStrokeWidth (width) {
      this.updateStrokeWidth(width)
    },
    changeColor (color) {
      this.checkedColor = color
      this.updateColor({ id : this.active, color })
    },
    changeFontSize () {
      this.updateFontSize(this.fontSize)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    }
  },
  computed: {
    ...mapState('editImage', [
      'currentImage',
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
