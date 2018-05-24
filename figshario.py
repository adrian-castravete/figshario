class Figshario:

    def __init__(self):
        self.running = False
        Figshario.last_game = self

    def start(self):
        self.running = True

    def stop(self):
        self.running = False

    def update(self, tick):
        print(tick)

    def draw(self):
        pass

    @classmethod
    def stop_last(cls):
        cls.last_game.stop()


# pylint: disable=undefined-variable
def main():
    game = Figshario()
    game.start()

    def anim_frame(tick):
        if game.running:
            game.update(tick)

        if game.running:
            game.draw()

        if game.running:
            requestAnimationFrame(anim_frame)

    requestAnimationFrame(anim_frame)
# pylint: enable=undefined-variable


if __name__ == '__main__':
    main()
