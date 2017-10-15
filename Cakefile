fs = require 'fs'
{exec} = require 'child_process'
watch = require 'watch-fs'


subProjects = ['engine', 'game']
targetFileName = 'app'


projectConfig = (project) ->
  sourceCoffeeDir = "#{project}/src/coffee-script"
  targetJsDir = "#{project}/src/js"

  targetCoffeeFile = "#{sourceCoffeeDir}/#{targetFileName}.coffee"
  targetJsFile = "#{targetJsDir}/#{targetFileName}.js"

  coffeeOpts = "--bare --output #{targetJsFile} --compile #{targetCoffeeFile}"

  {
    sourceCoffeeDir
    targetCoffeeFile
    targetJsFile
    coffeeOpts
  }


buildSubProject = (project) ->
  console.log "Building #{project}"
  config = projectConfig project
  files = walkCollect config.sourceCoffeeDir, '.coffee'
  contents = []
  remaining = files.length

  for file, index in files
    fs.readFile file, 'utf8', (error, fileContents) ->
      if error
        console.error "Error reading #{file}:\n#{error}"
        return

      contents.push fileContents
      if --remaining == 0
        finishedReading()

  finishedReading = ->
    fs.writeFile config.targetCoffeeFile, contents.join('\n\n'), 'utf8', (error) ->
      if error
        console.error "Error writing #{config.targetCoffeeFile}:\n#{error}"
        return

      exec "coffee #{config.coffeeOpts}", (error, stdout, stderr) ->
        if error
          console.error "Failed to launch coffee\n#{error}"
          return

        console.log "Compiled #{config.targetJsFile}"
        fs.unlink config.targetCoffeeFile, (error) ->
          console.error "Failed to unlink #{config.targetCoffeeFile}:\n#{error}"


walkCollect = (dir, exts) ->
  exts ?= ''
  if not Array.isArray exts
    exts = [exts]

  fileList = []
  files = fs.readdirSync(dir)
  for file in files
    path = "#{dir}/#{file}"
    stat = fs.statSync path
    if stat.isDirectory()
      subFileList = walkCollect path, exts
      fileList = fileList.concat subFileList
    else
      for ext in exts
        if file.match ".*#{ext}$"
          fileList.push path
          break

  fileList


watchSubProject = (project) ->
  config = projectConfig project
  console.log "Watching for changes in #{config.sourceCoffeeDir}"

  watcher = new watch.Watcher {
    paths: [config.sourceCoffeeDir]
    filters: {
      includeFile: (name) ->
        name.match ".*\.coffee$"
    }
  }

  watcher.on 'create', (path) ->
    console.log "Project #{project}, file #{path} created"
    buildSubProject project

  watcher.on 'change', (path) ->
    console.log "Project #{project}, file #{path} changed"
    buildSubProject project

  watcher.on 'delete', (path) ->
    console.log "Project #{project}, file #{path} deleted"
    buildSubProject project

  watcher.start (error, failed) ->
    console.log "Watcher starterd for project #{project}."
    if error
      console.error "Watcher error: #{error}"
      console.error "Items failed: #{failed}"


task 'build', 'Build the subprojects into single Javascript files', ->
  for project in subProjects
    buildSubProject project

task 'watch', 'Watch source directories for changes', ->
  for project in subProjects
    watchSubProject project
