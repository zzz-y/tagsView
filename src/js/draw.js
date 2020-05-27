import * as d3 from 'd3'
import $ from 'jquery'
import { min, max, forOwn, cloneDeep } from 'lodash'
import { drawStraight, translatePath } from './drawStraight'
import store from '@/store'

let svg = null
let drawingMode = '' // 绘制图形类别：矩形、椭圆、直线
let drawingModeId = 0
let textPosition = {}
let scale = 1 // 缩放比例
let currentShape = null // 当前绘制图形
const current = store.state.editImage.currentImage
let coords = {
  sP: null, // 起点偏移,{ offsetX: num, offsetY: num }
  eP: null, // 终点偏移
}

/* 绘制初始化 */
export function drawInit () {
  if (svg) {
    svg.remove()
  }
  drawingModeId = 0
  drawingMode = ''
  coords = {
    sP: null,
    eP: null,
  }
  svg = d3.select('#svg-container')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .on('mousedown', handleMouseDown)
    .on('mousemove', handleMouseMove)
    .on('mouseup', handleMouseUp)
}

/* 切换绘制模式 */
export function toggleDrawingMode (shapeId) {
  drawingModeId = shapeId
  switch (shapeId) {
    case 1:
      drawingMode = 'move'
      break
    case 2:
      drawingMode = 'path'
      break
    case 3:
      drawingMode = 'rect'
      break
    case 4:
      drawingMode = 'ellipse'
      break
    case 5:
      drawingMode = 'text'
      break
    case 6:
      drawingMode = 'tag'
      break
  }
}

// 缩放系数变化时，重绘所有图形
export function scaleGraphics () {
  const created = cloneDeep(store.state.notation.created)
  drawInit()
  drawCreated(created)
}

/* 绘制已创建的批注项图形 */
export function drawCreated (data) {
  const g = []
  data.forEach((d) => {
    const graph = JSON.parse(d.address)
    const param = graphicParamFormat(scaleParamRecover(graph.coords), graph.drawingMode)
    const graphic = svg.append(graph.drawingMode)
      .attr('stroke', graph.color)
      .attr('stroke-width', graph.lineWidth || 2)
      .attr('fill', 'transparent')
    forOwn(param, (value, key) => {
      graphic.attr(key, value)
    })
    graphic.attr('id', d.id)
      .on('dblclick', function (d, i, nodes) {
        store.commit('selectNotation', +nodes[i].id)
      })
    g.push(graphic)
  })
  store.commit('updateCreated', {
    data,
    graph: g,
  })
}

/* 改变缩放比例 */
export function changeScale (s) {
  scale = s
}

function handleMouseDown () {
  if (drawingMode) {
    coords.sP = {
      offsetX: d3.event.offsetX,
      offsetY: d3.event.offsetY
    }
    if (drawingModeId < 2) {
      console.log('move')
    } else if (drawingModeId < 5) {
      currentShape = svg.append(drawingMode)
    } else {
      if ($('#textInput').css('display') === 'none') {
        textPosition = {
          x: d3.event.offsetX,
          y: d3.event.offsetY
        }
        $('#textInput').text('')
        $('#textInput').css('display', 'block').css('top', (d3.event.offsetY + 24)).css('left', d3.event.offsetX)
        $('#textInput')[0].click()
      } else {
        $('#textInput').css('display', 'none')
        currentShape = svg.append(drawingMode)
        const timestampId = Date.now()
        currentShape = drawGraphic(drawingMode).attr('id', timestampId)
        textPosition = { x: 0, y: 0 }
        console.log(currentShape.node().getComputedTextLength())
      }
    }
  }
}

function handleMouseMove () {
  svg.style('cursor', drawingMode ? 'crosshair' : '')
  if (drawingMode && coords.sP && drawingModeId < 5 && drawingModeId > 1) {
    coords.eP = {
      offsetX: d3.event.offsetX,
      offsetY: d3.event.offsetY
    }
    drawGraphic(drawingMode)
  }
  return
}

function handleMouseUp () {
  console.log('mouse up')
  if (drawingMode && coords.sP && drawingModeId < 5 && drawingModeId > 1) {
    coords.eP = {
      offsetX: d3.event.offsetX,
      offsetY: d3.event.offsetY
    }
    if (!isParamsValid(coords, drawingMode)) {
      currentShape.remove()
    } else {
      const timestampId = Date.now()
      currentShape = drawGraphic(drawingMode)
        .attr('id', timestampId)
    }
  }
  coords = {
    sP: null,
    eP: null
  }
  svg.style('cursor', '')
}

function scaleParamFormatted (coordsObj) {
  return {
    sP: {
      offsetX: coordsObj.sP.offsetX / scale,
      offsetY: coordsObj.sP.offsetY / scale
    },
    eP: {
      offsetX: coordsObj.eP.offsetX / scale,
      offsetY: coordsObj.eP.offsetY / scale
    },
  }
}

function scaleParamRecover (coordsObj) {
  return {
    sP: {
      offsetX: coordsObj.sP.offsetX * scale,
      offsetY: coordsObj.sP.offsetY * scale
    },
    eP: {
      offsetX: coordsObj.eP.offsetX * scale,
      offsetY: coordsObj.eP.offsetY * scale
    },
  }
}

function isParamsValid (coords, drawingMode) {
  const funcMap = {
    rect: function () {
      return Math.abs(coords.sP.offsetX - coords.eP.offsetX)
        && Math.abs(coords.sP.offsetY - coords.eP.offsetY)
    },
    ellipse: function () {
      return Math.abs(coords.sP.offsetX - coords.eP.offsetX)
        && Math.abs(coords.sP.offsetY - coords.eP.offsetY)
    },
    path: function () {
      return (Math.abs(coords.sP.offsetX - coords.eP.offsetX)
        + Math.abs(coords.sP.offsetY - coords.eP.offsetY)) > 5
    }
  }
  return funcMap[drawingMode]()
}

// 图形参数格式化
function graphicParamFormat (coords, drawingMode) {
  const funcMap = {
    rect: function () {
      return {
        x: min([coords.sP.offsetX, coords.eP.offsetX]),
        y: min([coords.sP.offsetY, coords.eP.offsetY]),
        width: Math.abs(coords.sP.offsetX - coords.eP.offsetX),
        height: Math.abs(coords.sP.offsetY - coords.eP.offsetY),
      }
    },
    ellipse: function () {
      return {
        cx: Math.abs(coords.sP.offsetX + coords.eP.offsetX) / 2,
        cy: Math.abs(coords.sP.offsetY + coords.eP.offsetY) / 2,
        rx: Math.abs(coords.sP.offsetX - coords.eP.offsetX) / 2,
        ry: Math.abs(coords.sP.offsetY - coords.eP.offsetY) / 2,
      }
    },
    path: function () {
      return {
        source: {
          x: coords.sP.offsetX,
          y: coords.sP.offsetY
        },
        target: {
          x: coords.eP.offsetX,
          y: coords.eP.offsetY,
        }
      }
    },
    text: function () {
      return cloneDeep(textPosition)
    },
    tag: function () {
      return {
        x: coords.sP.offsetX,
        y: coords.sP.offsetY,
      }
    },
  }
  return funcMap[drawingMode](coords)
}

function drawGraphic (drawingMode) {
  const maps = {
    rect: drawRect,
    ellipse: drawEllipse,
    path: drawLine,
    text: drawText,
    tag: drawTag,
  }
  const params = graphicParamFormat(coords, drawingMode)
  return maps[drawingMode](params)
}

function drawRect (params) {
  return currentShape
    .attr('x', params.x)
    .attr('y', params.y)
    .attr('width', params.width)
    .attr('height', params.height)
    .attr('stroke', current.rectColor)
    .attr('stroke-width', current.strokeWidth)
}

function drawEllipse (params) {
  return currentShape
    .attr('cx', params.cx)
    .attr('cy', params.cy)
    .attr('rx', params.rx)
    .attr('ry', params.ry)
    .attr('stroke', current.ellipseColor)
    .attr('stroke-width', current.strokeWidth)
}

function drawLine (params) {
  return currentShape
    .attr('stroke-width', current.strokeWidth)
    .attr('stroke', current.pathColor)
    .attr('fill', current.pathColor)
    .attr('d', d => drawStraight(params.source, params.target, 0))
    .attr('transform', () => translatePath(params))
}

function drawText (params) {
  currentShape
    .attr('x', params.x)
    .attr('y', params.y)
    .attr('font-size', current.text.fontSize)
    .text($('#textInput').text())
    .style('fill', current.text.color)
  wrapWord($('#svg-container').width() - textPosition.x)
}

function wrapWord (width) {
  const text = currentShape
  const words = $('#textInput').text().split('').reverse()
  let word
  let line = []
  let lineNumber = 0
  const lineHeight = text.node().getBoundingClientRect().height
  const x = +text.attr('x')
  const y = +text.attr('y')
  let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y)
  while (word = words.pop()) {
    line.push(word)
    tspan.text(line.join(''))
    if (tspan.node().getComputedTextLength() > width) {
      line.pop()
      tspan.text(line.join(''))
      line = [word]
      tspan = text.append('tspan').attr('x', x).attr('y', ++lineNumber * lineHeight + y).text(word)
    }
  }
}

function drawTag (params) {
  return currentShape
    .attr('x', params.x)
    .attr('y', params.y)
    .attr('width', params.width)
    .attr('height', params.height)
    .attr('stroke', current.rectColor)
    .attr('stroke-width', current.strokeWidth)
}
