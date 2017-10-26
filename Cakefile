fs = require 'fs'
{exec} = require 'child_process'
watch = require 'watch-fs'


subProjects = ['engine', 'game']
targetFileName = 'app'


projectConfig = (project) ->
  sourceCoffeeDir = "#{project}/coffee-script"
  targetJsDir = "#{project}/js"

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

  console.log("Compiled the following list:")
  for file in files
    console.log("  #{file}")
  for file, index in files
    fs.readFile file, 'utf8', (error, fileContents) ->
      if error
        console.error "Error reading #{file}:\n#{error}"
        return

      contents.push fileContents
      if --remaining == 0
        finishedReading()

  finishedReading = ->
    callback = (error) ->
      if error
        console.error "Error writing #{config.targetCoffeeFile}:\n#{error}"
        return

      exec "coffee #{config.coffeeOpts}", (error, stdout, stderr) ->
        if error
          console.error "Failed to launch coffee\n#{error}"
          return

        console.log "Compiled #{config.targetJsFile}"
        fs.unlink config.targetCoffeeFile, (error) ->
          if error
            message = "Failed to unlink #{config.targetCoffeeFile}:\n#{error}"
            console.error error

    fileName = config.targetCoffeeFile
    contents = contents.join('\n\n')

    fs.writeFile fileName, contents, 'utf8', callback


walkCollect = (dir, exts) ->
  exts ?= ''
  if not Array.isArray exts
    exts = [exts]

  fileList = []
  files = fs.readdirSync(dir)
  for file in files
    path = "#{dir}/#{file}"

    if fs.existsSync "./#{path}"
      stat = fs.statSync path

      if stat.isDirectory()
        subFileList = walkCollect path, exts
        fileList = fileList.concat subFileList

      else
        for ext in exts
          if file.match ".*#{ext}$"
            # Exclude emacs backup files
            if file and !file.match ".*\/?\.\#[^\/]+$"
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
    if !path.match "#{config.targetCoffeeFile}$"
      console.log "Project #{project}, file #{path} created"
      buildSubProject project

  watcher.on 'change', (path) ->
    if !path.match "#{config.targetCoffeeFile}$"
      console.log "Project #{project}, file #{path} changed"
      buildSubProject project

  watcher.on 'delete', (path) ->
    if !path.match "#{config.targetCoffeeFile}$"
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
