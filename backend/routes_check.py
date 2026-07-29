"""Quick script to print all registered routes."""
import main

for route in main.app.routes:
    methods = getattr(route, 'methods', None)
    path = getattr(route, 'path', '?')
    if methods:
        for m in methods:
            print(f"{m:8} {path}")
    else:
        print(f"{'WS':8} {path}")
