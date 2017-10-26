class FigEngine

  constructor: (@canvas) ->
    @running = false
    @autoResize = true
    @clearColour = '#000000'

    if not @canvas
      @canvas = document.createElement 'canvas'
      document.body.appendChild @canvas
    @context = @canvas.getContext '2d'

    if @autoResize
      @onResize()

  start: ->
    @attachEvents()
    @running = true
    @update()
    @draw()

  stop: ->
    @detachEvents()
    @running = false

  attachEvents: ->
    window.addEventListener 'resize', @onResize

  detachEvents: ->
    window.removeEventListener 'resize', @onResize

  onResize: =>
    width = window.innerWidth
    height = window.innerHeight

    if @autoResize
      @resize width, height

  resize: (@width, @height) ->
    @canvas.width = @width
    @canvas.height = @height

  draw: ->
    g = @context
    g.save()
    g.fillStyle = @clearColour
    g.fillRect 0, 0, @width, @height
    g.restore()

  update: ->
