
fileName, filePath = getfilename()

outBase = fileName:match("[^%.]+")
outName = outBase .. ".chr"
outFull = filePath .. "/" .. outName

width, height = getpicturesize()

function extractChr()
  sanityCheck()

  local out = assert(io.open(outFull, "wb"))
  for j = 1, 64 do
    for i = 1, 16 do
      manageTile(out, i, j)
    end
  end
  assert(out:close())
end

function sanityCheck()
  if width % 8 ~= 0 or height % 8 ~= 0 then
    error("Unexpected picture size. Must have coordinates divisible by 8 and received (" .. width .. "x" .. height .. ")")
  end
end

function manageTile(out, x, y)
  local tile = {}
  for j = 1, 8 do
    local pixels = {}
    for i = 1, 8 do
      local pixel = getpicturepixel((x - 1) * 8 + i - 1, (y - 1) * 8 + j - 1)
      pixel = pixel % 4
      pixels[#pixels + 1] = pixel
    end
    tile[#tile + 1] = pixels
  end

  -- writeFirstPattern(out, tile)
  -- writeSecondPattern(out, tile)
  writeMixedPattern(out, tile)
end

function writeFirstPattern(out, tile)
  for j = 1, 8 do
    local accum = 0
    for i = 1, 8 do
      accum = accum * 2 + tile[j][i] % 2
    end
    out:write(string.char(accum))
  end
end

function writeSecondPattern(out, tile)
  for j = 1, 8 do
    local accum = 0
    for i = 1, 8 do
      accum = accum * 2 + math.floor(tile[j][i] / 2)
    end
    out:write(string.char(accum))
  end
end

function writeMixedPattern(out, tile)
  for j = 1, 8 do
    local accum = 0
    for i = 1, 8 do
      accum = accum * 4 + tile[j][i] % 4
    end
    out:write(string.char(accum % 256))
    out:write(string.char(accum / 256))
  end
end

success, errorStr = pcall(extractChr)
if success then
  messagebox("Success!", "Successfully written " .. outName .. " to " .. filePath .. ".")
else
  messagebox("Error!", errorStr)
end
