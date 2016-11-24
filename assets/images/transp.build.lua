#!/usr/bin/env lua

function inList(needle, haystack)
  for _, item in pairs(haystack) do
    if needle == item then
      return true
    end
  end

  return false
end

function main()
  local proc = io.popen("ls -1")
  local i = 0
  local names = {}

  for item in proc:lines() do
    i = i + 1
    names[i] = item
  end

  for _, item in pairs(names) do
    local match = string.match(item, "(.+)%.c.gif")
    if match and inList(match .. '.a.gif', names) then
      os.execute("convert " .. match .. ".c.gif " .. match .. ".a.gif -alpha off -compose copyopacity -composite png32:" .. match .. ".png")
      print("Converted " .. match)
    end
  end
end

main()
