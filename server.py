#!/usr/bin/env python3

"""figshario game engine"""


import json
from argparse import ArgumentParser

from figshario import FigsharioServer


def main():
    parser = ArgumentParser(__doc__.split('\n')[0])
    parser.add_argument('-c', '--config', type=str,
                        help="Use a different configuration file than 'config.json'.")
    parser.add_argument('-d', '--debug', action='store_true',
                        help="Force enable debug mode.")
    parser.add_argument('-e', '--editor', action='store_true',
                        help="Enable editor capabilities.")

    args = parser.parse_args()

    config_file = 'config.json'
    if args.config is not None:
        config_file = args.config

    try:
        with open(config_file) as fin:
            config = json.load(fin)
    except json.JSONDecodeError:
        config = {}

    if args.editor:
        config['editor'] = True
    if args.debug:
        config['debug'] = True

    server = FigsharioServer(config)
    server.run()

if __name__ == '__main__':
    main()
