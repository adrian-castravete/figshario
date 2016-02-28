all: build

build:
	gulp build

watch:
	gulp watch

server:
	python3 server.py

dev:
	python3 server.py --debug --editor

editor:
	python3 server.py --editor
