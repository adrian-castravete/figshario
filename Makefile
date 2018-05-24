all: build

configure:
	pip3 install transcrypt

build:
	transcrypt -bmn figshario.py

minify:
	transcrypt -b figshario.py

server:
	python3 -m http.server 8086

# vim: set sw=8 ts=8 noet:
