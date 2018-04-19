local fkfig = {}
fkfig.__index = fkfig

function fkfig.create()
  local instance = {
    width = 320,
    height = 200,
    ram = {},
    running = false,
    canvas = nil,
  }

  setmetatable(instance, fkfig)
  instance:initialize()

  return instance
end

function fkfig:initialize()
  local document = js.global.document
  local c = document:createElement'canvas'

  c.width = self.width
  c.height = self.height

  self.canvas = c
  self.context = c:getContext'2d'
end

function fkfig:start()
  self.running = true
end

function fkfig:stop()
  self.running = false
end

function fkfig:update(tick)
  if not self.running then
    return
  end
  if not self.oldTick then
    self.oldTick = tick
  end

  local diff = (tick - self.oldTick)
  if diff > 0 then
    self.fps = 1000 // diff
  end
  self.oldTick = tick
end

function fkfig:draw()
  if not self.running then
    return
  end

  local g = self.context
  g:clearRect(0, 0, self.width, self.height)
  g:fillText(self.fps, 0, 12)
end

function fkfig:dump(o, i, seen)
  if not i then
    i = ''
    seen = {}
  end
  seen[o] = true
  local keys = {}
  local n = 1
  for k in pairs(o) do
    keys[n] = k
    n = n + 1
  end
  table.sort(keys)
  for k, v in ipairs(keys) do
    local out = i..v
    v = o[v]
    if not seen[v] then
      local vtype = type(v)
      if vtype=='table' then
        print(out..': <table>')
        dump(v, i..'\t', seen)
      elseif vtype=='number' then
        print(out..': <'..math.type(v)..'> '..v)
      elseif vtype=='function' then
        print(out..': <function>')
      elseif vtype=='userdata' then
        print(out..': <userdata>')
      else
        print(out..': <'..vtype..'> '..v)
      end
    end
  end
end

return fkfig
