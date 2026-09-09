"""Serve Festival Day and proxy Voicebox so Listen works in the browser."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parent
VOICEBOX = "http://127.0.0.1:17493"
PREFIX = "/voicebox"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path.startswith(PREFIX):
            self.proxy()
            return
        self.send_error(404)

    def do_GET(self):
        if self.path.startswith(PREFIX):
            self.proxy()
            return
        super().do_GET()

    def proxy(self):
        dest = VOICEBOX + (self.path[len(PREFIX):] or "/")
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None
        req = urllib.request.Request(dest, data=body, method=self.command)
        if self.headers.get("Content-Type"):
            req.add_header("Content-Type", self.headers["Content-Type"])
        try:
            with urllib.request.urlopen(req, timeout=180) as res:
                payload = res.read()
                self.send_response(res.status)
                content_type = res.headers.get("Content-Type", "application/octet-stream")
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
        except urllib.error.HTTPError as err:
            payload = err.read()
            self.send_response(err.code)
            self.send_header("Content-Type", err.headers.get("Content-Type", "text/plain"))
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except Exception as err:
            msg = str(err).encode()
            self.send_response(502)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(msg)))
            self.end_headers()
            self.wfile.write(msg)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8765), Handler)
    print("Festival Day: http://127.0.0.1:8765/")
    print("Voicebox proxy: http://127.0.0.1:8765/voicebox/")
    server.serve_forever()
