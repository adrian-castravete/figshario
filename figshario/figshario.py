from flask import Flask, render_template


class FigsharioServer(Flask):

    DEFAULT_PORT = 8086

    def __init__(self, config):
        super(FigsharioServer, self).__init__(__name__)
        self.port = config.get('port', self.DEFAULT_PORT)
        self.debug = config.get('debug', False)
        self.add_url_rule('/', 'game', self.game_requested)

    def game_requested(self):
        return render_template('engine.html')
