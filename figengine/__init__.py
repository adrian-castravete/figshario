from .scene import FigScene


class FigEngine:

    def __init__(self):
        self.width = 320
        self.height = 200

        self.running = False

        self._scene_stack = []

        cvs = document.createElement('canvas')
        cvs.width = 320
        cvs.height = 200

        ctx = cvs.getContext('2d')

        self.canvas = cvs
        self.context = ctx

    def start(self):
        self.running = True

    def stop(self):
        self.running = False

    def update(self, tick):
        if self._scene_stack:
            self._scene_stack[len(self._scene_stack) - 1].update(tick)

    def draw(self):
        g = self.context

        g.fillStyle = '#000'
        g.fillRect(0, 0, self.width, self.height)

        for scene in self._scene_stack:
            scene.draw(g)

    @classmethod
    def stop_last(cls):
        cls.last_game.stop()


    def push_scene(self, scene):
        self._scene_stack.push(scene)

    def pop_scene(self):
        return self._scene_stack.pop()

