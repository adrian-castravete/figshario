class Figshario:

    def __init__(self):
        self.width = 320
        self.height = 200

        self.running = False

        cvs = document.createElement('canvas')
        cvs.width = 320
        cvs.height = 200

        ctx = cvs.getContext('2d')

        self.canvas = cvs
        self.context = ctx

        Figshario.last_game = self

    def start(self):
        self.running = True

    def stop(self):
        self.running = False

    def update(self, tick):
        pass

    def draw(self):
        g = self.context

        g.fillStyle = '#000'
        g.fillRect(0, 0, self.width, self.height)

    @classmethod
    def stop_last(cls):
        cls.last_game.stop()


def main():
    cvs = document.getElementById('paper')
    ctx = cvs.getContext('2d')

    state = {
        'offset_x': 0,
        'offset_y': 0,
        'scale': 2
    }

    game = Figshario()
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


if __name__ == '__main__':
    main()
