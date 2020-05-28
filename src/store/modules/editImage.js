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
      console.log(state.currentSvg)
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
    // 新增工作区
    addWorkArea ({ commit }, data) {
      commit('SET_WORK_AREA', data)
    },
    // 切换工作区
    changeWorkTabs ({ commit, state }, tabsValue) {
      const index = state.workTabList.findIndex(e =>
        e.name === state.workTabsValue)
      commit('SET_MODEL_CONFIG', index)
      commit('SET_BRUSHED_NODES', {
        index,
        data: _.cloneDeep(brushSelectedNodes.list)
      })
      commit('SET_TAB_VALUE', tabsValue)
      clearTimeout(timedOut)
      new Promise((resolve) => {
        clearAll()
        resolve()
      }).then(() => {
        const currentWorkArea = state.workTabList.find(e => e.name === state.workTabsValue)
        if (Object.keys(currentWorkArea.modelConfig).length > 0) {
          openModel(currentWorkArea.modelConfig)
        }
        brushSelectedNodes.list = _.cloneDeep(currentWorkArea.brushSelectedNodes)
        currentWorkArea.brushSelectedNodes.forEach((d) => {
          d3.selectAll(`#g${d.id}`)
            .selectAll('.calculateBg')
            .attr('stroke', variables.primaryColor)
        })
        commit('SET_CIRCULATE_STATUS', currentWorkArea.circulateStatus)
        if (!state.tabCirculateStatus.start) {
          $('.back-drop').addClass('active')
          if (state.tabCirculateStatus.submitId) {
            getStatus()
          }
        } else {
          $('.back-drop').removeClass('active')
        }
      })
    },
    // 删除工作区
    deleteWorkArea ({ commit, state }, targetName) {
      commit('DELETE_WORK_AREA', targetName)
    },
    updateCopyNodes ({ commit }, data) {
      commit('SET_COPY_NODES', data)
    },
    // 更新当前工作区保存状态
    updateModel ({ commit, state }, data) {
      const index = state.workTabList.findIndex(e =>
        e.name === state.workTabsValue)
      commit('SET_SAVED_MODEL', { index, data })
    },
    // 更新当前工作区鼠标状态
    updateCursor ({ commit, state }, data) {
      const index = state.workTabList.findIndex(e =>
        e.name === state.workTabsValue)
      commit('SET_CURSOR_STATUS', { index, data })
    },
  }
}

export default editImage
