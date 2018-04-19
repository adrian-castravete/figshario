local window = js.global
local document = window.document
local fkfig = require 'fkfig'
local paper = document:getElementById 'paper'
local paperContext = paper:getContext '2d'
local engine = fkfig.create()

local offsetX, offsetY, scale = 0, 0, 2

function resize()
  local width = engine.width
  local height = engine.height
  local iWidth = window.innerWidth
  local iHeight = window.innerHeight

  paper.width = iWidth
  paper.height = iHeight

  scale = math.floor(math.max(math.min(iWidth // width, iHeight // height), 1))
  offsetX = math.floor((iWidth - width * scale) / 2)
  offsetY = math.floor((iHeight - height * scale) / 2)
end
window:addEventListener('resize', resize)
resize()

function update(owner, tick)
  local g = paperContext

  engine:update(tick)
  engine:draw()

  g.imageSmoothingEnabled = false
  g:clearRect(0, 0, g.canvas.width, g.canvas.height)
  g:save()
  g:translate(offsetX, offsetY)
  g:scale(scale, scale)
  g:drawImage(engine.canvas, 0, 0)
  g:restore()

  if engine.running then
    window:requestAnimationFrame(update)
  end
end
engine:start()
window:requestAnimationFrame(update)
function window.stopGame()
  engine:stop()
end
