from figengine import FigEngine

from figshario import FigsharioMainMenu


def setup():
    cvs = document.getElementById('paper')
    ctx = cvs.getContext('2d')

    state = {
        'offset_x': 0,
        'offset_y': 0,
        'scale': 2
    }

    game = FigEngine()
    game.start()

    def resize():
        iwidth, iheight = window.innerWidth, window.innerHeight
        cvs.width = iwidth
        cvs.height = iheight

        scale = int(max(min(iwidth / game.width, iheight / game.height), 1))
        state['offset_x'] = (iwidth - game.width * scale) >> 1
        state['offset_y'] = (iheight - game.height * scale) >> 1
        state['scale'] = scale

    resize()
    window.addEventListener('resize', resize)

    def anim_frame(tick):
        if game.running:
            game.update(tick)

        if game.running:
            game.draw()

            scale = state['scale']
            ctx.save()
            ctx.translate(state['offset_x'], state['offset_y'])
            ctx.scale(scale, scale)
            ctx.drawImage(game.canvas, 0, 0)
            ctx.restore()

        if game.running:
            window.requestAnimationFrame(anim_frame)

    window.requestAnimationFrame(anim_frame)

    def stop_game():
        game.stop()

    window.stop_game = stop_game

    return game


def main():
    game = setup()
    scene = FigsharioMainMenu(game)
    game.push_scene(scene)


if __name__ == '__main__':
    main()
