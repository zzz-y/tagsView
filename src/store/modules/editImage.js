import _ from 'lodash'
import * as $ from 'jquery'

const editImage = {
  namespaced: true,
  state: {
    imageList: [],
    initImage: {
      strokeWidth: 2,
      rectColor: '#ea4c72',
      ellipseColor: '#ea4c72',
      pathColor: '#ea4c72',
      text: {
        color: '#ea4c72',
        fontSize: '14px'
      },
      tag: {
        color: '#f5b225',
        background: '#bfbfbf'
      },
    },
    currentImage: {
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
    currentSvg: []
  },
  mutations: {
    SET_STROKE_WIDTH: (state, width) => {
      state.currentImage.strokeWidth = width
    },
    SET_STROKE_COLOR: (state, data) => {
      console.log(data.id)
      switch (data.id) {
        case 2:
          state.currentImage.pathColor = data.color
          break
        case 3:
          state.currentImage.rectColor = data.color
          break
        case 4:
          state.currentImage.ellipseColor = data.color
          break
        case 5:
          state.currentImage.text.color = data.color
          break
        case 6:
          state.currentImage.tag.color = data.color
          break
        default:
          break
      }
    },
    SET_FONT_SIZE: (state, fontSize) => {
      state.currentImage.text.fontSize = fontSize
    },
    SET_CURRENT_SVG: (state, data) => {
      state.currentSvg.push(data)
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
  }
}

export default editImage
