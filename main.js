'use strict'

var DSU_HORIZONTAL_RESOLUTION = 180
var DSU_VERTICAL_RESOLUTION = 50
var DSU_LED_ON_COLOR = 'hsla(0, 100%, 50%, 1)'
var DSU_LED_OFF_COLOR = 'hsla(0, 100%, 10%, 1)'

var canvas = document.getElementById('led')
var context = canvas.getContext('2d')

// Gets the current width and height from browser layout engine
var canvasWidth = Math.floor(canvas.getBoundingClientRect().width)
var canvasHeight = Math.floor(canvas.getBoundingClientRect().height)

// Fixes rounding issues later
canvas.style.width = canvasWidth + 'px'
canvas.style.height = canvasHeight + 'px'

// Sets canvas to the proper dimensions and at the correct pixel density
var ratio = getDevicePixelRatio(context)
canvas.width = canvasWidth * ratio
canvas.height = canvasHeight * ratio
context.scale(ratio, ratio)

// Figure out how big to display an LED light at
// It will never be less than 1 pixel
var ledWidth = canvasWidth / DSU_HORIZONTAL_RESOLUTION
var ledHeight = canvasHeight / DSU_VERTICAL_RESOLUTION
var ledRadius = Math.max(Math.min(0.65 * ledWidth, 0.65 * ledHeight), 1) / 2

// draw random dots
// for (var i = 0; i < DSU_HORIZONTAL_RESOLUTION * DSU_VERTICAL_RESOLUTION; i++) {
//   var posX = i % DSU_HORIZONTAL_RESOLUTION
//   var posY = Math.floor(i / DSU_HORIZONTAL_RESOLUTION)
//   var centerX = (ledWidth / 2) + (posX * ledWidth)
//   var centerY = (ledHeight / 2) + (posY * ledHeight)
//   var bit = Math.floor(Math.random() * 1.15)
//   drawLED(context, centerX, centerY, ledRadius, bit)
// }

// Scroll random dots!!
var screen = makeEmptyScreenBuffer()

var randomness = 1.15
// for (var i = 0; i < DSU_HORIZONTAL_RESOLUTION * DSU_VERTICAL_RESOLUTION; i++) {
//   var posX = i % DSU_HORIZONTAL_RESOLUTION
//   var posY = Math.floor(i / DSU_HORIZONTAL_RESOLUTION)
//   var bit = Math.floor(Math.random() * 1.15)
//   screen[posY][posX] = bit
// }

// drawScreen(screen, context)

// Words
function makeScreen () {
  screen = drawLineOnScreen(screen, 'San Jose', 1, 3)
  screen = drawLineOnScreen(screen, '1, 5 min', 1, 3, { align: 'right' })
  screen = drawLineOnScreen(screen, '12 car train', 1, 13)
  screen = drawLineOnScreen(screen, 'lake tahoe', 1, 30)
  screen = drawLineOnScreen(screen, '3, 9 min', 1, 30, { align: 'right' })
  screen = drawLineOnScreen(screen, '15 car train', 1, 40)

  drawScreen(screen, context)
}

makeScreen()

window.setInterval(function () {
  shiftUp(screen, context)
}, 350)

window.setInterval(function () {
  makeScreen()
}, 20000)

// Creates an empty two-dimensional array of length
// of the vertical dimension of the screen (this makes)
// it easier to do vertical scrolling.
function makeEmptyScreenBuffer () {
  var buffer = Array(DSU_VERTICAL_RESOLUTION)
  for (var i = 0; i < buffer.length; i++) {
    buffer[i] = Array(DSU_HORIZONTAL_RESOLUTION)
  }
  return buffer
}

function drawLineOnScreen (screen, string, x, y, options) {
  var dots = getDots(string)
  options = options || {}
  if (options.align === 'right') {
    x = DSU_HORIZONTAL_RESOLUTION - x - dots.length
  }
  return drawDotsOnScreen(screen, dots, x, y)
}

function drawDotsOnScreen (screen, dots, x, y) {
  for (var m = 0; m < dots.length; m++) {
    for (var n = 0; n < dots[m].length; n++) {
      screen[y + n][x + m] = dots[m][n]
    }
  }
  return screen
}

function getDots (string) {
  var array = getStringCodePoints(string)
  return getDotsFromCodePoints(array)
}

function getStringCodePoints (string) {
  var array = []
  string = string.trim().toUpperCase()

  // Split the string on spaces
  var words = string.split(' ')

  // Convert a string into its code points
  for (var i = 0; i < words.length; i++) {
    var word = []
    for (var j = 0; j < words[i].length; j++) {
      word.push(words[i].charCodeAt(j))
    }
    array.push(word)
  }
  return array
}

function getDotsFromCodePoints (array) {
  var line = []
  for (var i = 0; i < array.length; i++) {
    var word = array[i]
    var length = 0

    if (i > 0) {
      line = line.concat(FONT[32], FONT.kerning)
    }

    // Add the next word
    for (var j = 0; j < word.length; j++) {
      var codePoint = word[j]
      var dotMatrix = FONT[codePoint]
      if (dotMatrix.length === 0) {
        dotMatrix = FONT.default
      }
      length += dotMatrix.length
      if (j > 0) {
        line = line.concat(FONT.kerning)
      }
      line = line.concat(dotMatrix)
    }
  }
  return line
}

function shiftUp (screen, context) {
  var newRow = Array(DSU_HORIZONTAL_RESOLUTION)
  screen.shift()
  screen.push(newRow)
  drawScreen(screen, context)
}

function shiftDown (screen, context) {
  var newRow = []
  for (var i = 0; i < DSU_HORIZONTAL_RESOLUTION; i++) {
    newRow.push(Math.floor(Math.random() * randomness))
  }
  screen.unshift(newRow)
  screen.pop()
  drawScreen(screen, context)
}

function drawScreen (screen, ctx) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < screen.length; y++) {
    for (var x = 0; x < screen[y].length; x++) {
      var centerX = (ledWidth / 2) + (x * ledWidth)
      var centerY = (ledHeight / 2) + (y * ledHeight)
      drawLED(ctx, centerX, centerY, ledRadius, screen[y][x])
    }
  }
}

function drawLED (ctx, x, y, radius, bit) {
  ctx.fillStyle = bit ? DSU_LED_ON_COLOR : DSU_LED_OFF_COLOR
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()
}

function getDevicePixelRatio (ctx) {
  var devicePixelRatio = window.devicePixelRatio || 1
  var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                          ctx.mozBackingStorePixelRatio ||
                          ctx.msBackingStorePixelRatio ||
                          ctx.oBackingStorePixelRatio ||
                          ctx.backingStorePixelRatio || 1
  return devicePixelRatio / backingStoreRatio
}
