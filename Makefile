all: build

configure:
	pip3 install transcrypt

build:
	transcrypt -xp figshario -xp figengine -bmn starter.py

minify:
	transcrypt -b starter.py

server:
	python3 -m http.server 8086

# vim: set sw=8 ts=8 noet:
