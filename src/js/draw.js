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
  const created = cloneDeep(store.state.editImage.currentSvg)
  drawInit()
  drawCreated(created)
}

/* 绘制已创建的批注项图形 */
export function drawCreated (data) {
  data.forEach((d) => {
    currentShape = svg.append(d.drawingMode)
    coords = d.coords ? scaleParamRecover(d.coords) : { sP: null, eP: null }
    if (d.textPosition) {
      d.textPosition = {
        x: d.textPosition.x * scale,
        y: (d.textPosition.y - d.fontSize) * scale + d.fontSize,
      }
    }
    currentShape = drawGraphic(d.drawingMode, null, d).attr('id', d.id)
  })
}

/* 改变缩放比例 */
export function changeScale (s) {
  console.log(s)
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
          y: d3.event.offsetY + current.text.fontSize
        }
        $('#textInput').text('')
        $('#textInput').css('display', 'block').css('top', (d3.event.offsetY + 24)).css('left', d3.event.offsetX)
        $('#textInput')[0].click()
      } else {
        $('#textInput').css('display', 'none')
        currentShape = svg.append(drawingMode)
        const timestampId = Date.now()
        currentShape = drawGraphic(drawingMode, timestampId).attr('id', timestampId)
        textPosition = { x: 0, y: 0 }
      }
    }
  }
}

function handleMouseMove () {
  svg.style('cursor', (drawingModeId > 1 && drawingModeId < 5) ? 'crosshair' : '')
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
      currentShape = drawGraphic(drawingMode, timestampId).attr('id', timestampId)
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
    sP: { offsetX: coordsObj.sP.offsetX / scale, offsetY: coordsObj.sP.offsetY / scale },
    eP: { offsetX: coordsObj.eP.offsetX / scale, offsetY: coordsObj.eP.offsetY / scale },
  };
}

function scaleParamRecover (coordsObj) {
  return {
    sP: { offsetX: coordsObj.sP.offsetX * scale, offsetY: coordsObj.sP.offsetY * scale },
    eP: { offsetX: coordsObj.eP.offsetX * scale, offsetY: coordsObj.eP.offsetY * scale },
  };
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
function graphicParamFormat (coords, drawingMode, created) {
  const funcMap = {
    rect: function () {
      return {
        x: min([coords.sP.offsetX, coords.eP.offsetX]),
        y: min([coords.sP.offsetY, coords.eP.offsetY]),
        width: Math.abs(coords.sP.offsetX - coords.eP.offsetX),
        height: Math.abs(coords.sP.offsetY - coords.eP.offsetY),
        color: created ? created.color : current.rectColor,
        strokeWidth: created ? created.strokeWidth : current.strokeWidth,
      }
    },
    ellipse: function () {
      return {
        cx: Math.abs(coords.sP.offsetX + coords.eP.offsetX) / 2,
        cy: Math.abs(coords.sP.offsetY + coords.eP.offsetY) / 2,
        rx: Math.abs(coords.sP.offsetX - coords.eP.offsetX) / 2,
        ry: Math.abs(coords.sP.offsetY - coords.eP.offsetY) / 2,
        color: created ? created.color : current.ellipseColor,
        strokeWidth: created ? created.strokeWidth : current.strokeWidth,
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
        },
        color: created ? created.color : current.pathColor,
        strokeWidth: created ? created.strokeWidth : current.strokeWidth,
      }
    },
    text: function () {
      return {
        x: created ? created.textPosition.x : textPosition.x,
        y: created ? created.textPosition.y : textPosition.y,
        fontSize: created ? created.fontSize : current.text.fontSize,
        text: created ? created.text : $('#textInput').text(),
        color: created ? created.color : current.text.color,
      }
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

function drawGraphic (drawingMode, id, created) {
  const maps = {
    rect: drawRect,
    ellipse: drawEllipse,
    path: drawLine,
    text: drawText,
    tag: drawTag,
  }
  const params = graphicParamFormat(coords, drawingMode, created)
  if (id) {
    if (textPosition.y !== 0) {
      textPosition = {
        x: textPosition.x / scale,
        y: textPosition.y / scale + current.text.fontSize
      }
    }
    store.dispatch('editImage/updateCurrentSvg', Object.assign(params, {
      id,
      drawingMode,
      coords: textPosition.y ? null : scaleParamFormatted(coords),
      textPosition: textPosition.y ? textPosition : null
    }))
  }
  return maps[drawingMode](params)
}

function drawRect (params) {
  return currentShape
    .attr('x', params.x)
    .attr('y', params.y)
    .attr('width', params.width)
    .attr('height', params.height)
    .attr('fill', 'none')
    .attr('stroke', params.color)
    .attr('stroke-width', params.strokeWidth)
}

function drawEllipse (params) {
  console.log(currentShape, params)
  return currentShape
    .attr('cx', params.cx)
    .attr('cy', params.cy)
    .attr('rx', params.rx)
    .attr('ry', params.ry)
    .attr('fill', 'none')
    .attr('stroke', params.color)
    .attr('stroke-width', params.strokeWidth)
}

function drawLine (params) {
  return currentShape
    .attr('stroke-width', params.strokeWidth)
    .attr('stroke', params.color)
    .attr('fill', params.color)
    .attr('d', d => drawStraight(params.source, params.target, 0))
    .attr('transform', () => translatePath(params))
}

function drawText (params) {
  currentShape
    .attr('x', params.x)
    .attr('y', params.y)
    .attr('font-size', params.fontSize)
    .text(params.text)
    .style('fill', params.color)
  wrapWord($('#svg-container').width() - params.x, params.text)
  return currentShape
}

function wrapWord (width, text) {
  const words = text.split('').reverse()
  let word
  let line = []
  let lineNumber = 0
  const lineHeight = currentShape.node().getBoundingClientRect().height
  const x = +currentShape.attr('x')
  const y = +currentShape.attr('y')
  let tspan = currentShape.text(null).append('tspan').attr('x', x).attr('y', y)
  while (word = words.pop()) {
    line.push(word)
    tspan.text(line.join(''))
    if (tspan.node().getComputedTextLength() > width) {
      line.pop()
      tspan.text(line.join(''))
      line = [word]
      tspan = currentShape.append('tspan').attr('x', x).attr('y', ++lineNumber * lineHeight + y).text(word)
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
