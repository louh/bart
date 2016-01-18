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
for (i = 0; i < DSU_HORIZONTAL_RESOLUTION * DSU_VERTICAL_RESOLUTION; i++) {
  posX = i % DSU_HORIZONTAL_RESOLUTION
  posY = Math.floor(i / DSU_HORIZONTAL_RESOLUTION)
  centerX = (ledWidth / 2) + (posX * ledWidth)
  centerY = (ledHeight / 2) + (posY * ledHeight)
  bit = Math.floor(Math.random() * 1.15)
  drawLED(context, centerX, centerY, ledRadius, bit)
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
