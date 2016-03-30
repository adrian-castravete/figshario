all: build

build:
	gulp build

watch:
	gulp watch

server:
	python3 -m http.server 8086 || python2 -m SimpleHTTPServer 8086
