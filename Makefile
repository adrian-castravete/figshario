all: browserify

browserify:
	gulp browserify

server:
	python3 -m http.server 8086 || python2 -m SimpleHTTPServer 8086
