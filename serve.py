# ponytail: dev-only static server; no-cache so edits always show. Prod = any real static host.
from http.server import HTTPServer, SimpleHTTPRequestHandler

class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

HTTPServer(("0.0.0.0", 3000), NoCache).serve_forever()
