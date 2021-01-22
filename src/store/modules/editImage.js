import _ from 'lodash'
import * as $ from 'jquery'

const editImage = {
  namespaced: true,
  state: {
    imageList: [],
    initEdit: {
      strokeWidth: 2,
      rectColor: '#ea4c72',
      ellipseColor: '#ea4c72',
      pathColor: '#ea4c72',
      text: {
        color: '#ea4c72',
        fontSize: 14
      },
      tag: {
        color: '#f5b225',
        background: '#bfbfbf'
      },
    },
    currentEdit: {
      strokeWidth: 2,
      rectColor: '#ea4c72',
      ellipseColor: '#ea4c72',
      pathColor: '#ea4c72',
      text: {
        color: '#ea4c72',
        fontSize: 14
      },
      tag: {
        color: '#f5b225',
        background: '#bfbfbf'
      },
    },
    currentSvg: [],
    currentImage: {}
  },
  mutations: {
    SET_STROKE_WIDTH: (state, width) => {
      state.currentEdit.strokeWidth = width
    },
    SET_STROKE_COLOR: (state, data) => {
      switch (data.id) {
        case 2:
          state.currentEdit.pathColor = data.color
          break
        case 3:
          state.currentEdit.rectColor = data.color
          break
        case 4:
          state.currentEdit.ellipseColor = data.color
          break
        case 5:
          state.currentEdit.text.color = data.color
          break
        case 6:
          state.currentEdit.tag.color = data.color
          break
        default:
          break
      }
    },
    SET_FONT_SIZE: (state, fontSize) => {
      state.currentEdit.text.fontSize = fontSize
    },
    SET_CURRENT_SVG: (state, data) => {
      state.currentSvg.push(data)
    },
    SET_IMAGE_LIST: (state, data) => {
      if (state.currentImage.uid) {
        const index = state.imageList.findIndex(e => e.image.uid === state.currentImage.uid)
        if (index < 0) {
          state.imageList.push({
            edit: state.currentEdit,
            svg: state.currentSvg,
            image: state.currentImage
          })
        } else {
          Object.assign(state.imageList[index], {
            edit: state.currentEdit,
            svg: state.currentSvg,
            image: state.currentImage
          })
        }
        const currentIndex = state.imageList.findIndex(e => e.image.uid === data.uid)
        if (currentIndex < 0) {
          state.currentEdit = _.cloneDeep(state.initEdit)
          state.currentSvg = []
          state.currentImage = _.cloneDeep(data)
        } else {
          state.currentEdit = _.cloneDeep(state.imageList[currentIndex].edit)
          state.currentSvg = _.cloneDeep(state.imageList[currentIndex].svg)
          state.currentImage = _.cloneDeep(state.imageList[currentIndex].image)
        }
      } else {
        state.currentImage = data
      }
    },
    DELETE_CURRENT_SVG: (state, data) => {
      const i = state.currentSvg.findIndex(e => e.id === data.id)
      state.currentSvg.splice(i, 1)
    },
  },
  actions: {
    // 更新边框宽度
    updateStrokeWidth ({ commit, state }, data) {
      commit('SET_STROKE_WIDTH', data)
    },
    // 更新颜色
    updateColor ({ commit, state }, data) {
      commit('SET_STROKE_COLOR', data)
    },
    // 更新文本大小
    updateFontSize ({ commit, state }, data) {
      commit('SET_FONT_SIZE', data)
    },
    // 更新svg中编辑内容
    updateCurrentSvg ({ commit }, data) {
      commit('SET_CURRENT_SVG', data)
    },
    // 删除
    deleteTag ({ commit, state }, data) {
      commit('DELETE_CURRENT_SVG', data)
    },
    // 更新图片列表
    updateImageList ({ commit }, data) {
      commit('SET_IMAGE_LIST', data)
    }
  }
}

export default editImage
