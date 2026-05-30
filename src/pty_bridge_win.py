import sys
import os
import subprocess
import threading
import time

try:
    from winpty import PTY
except ImportError:
    sys.stderr.write("pywinpty is not installed. Run: pip install pywinpty\n")
    sys.exit(127)


def main():
    cmd = sys.argv[1:]
    if not cmd:
        sys.exit(1)

    pty = PTY(80, 24)

    # Route through cmd.exe so .cmd/.bat shims (e.g. claude.cmd from npm) are found.
    # CreateProcess alone won't resolve those via PATH + PATHEXT.
    cmdline = f"/c {subprocess.list2cmdline(cmd)}"
    if not pty.spawn("cmd.exe", cmdline=cmdline):
        sys.stderr.write(f"Failed to spawn cmd.exe /c {subprocess.list2cmdline(cmd)}\n")
        sys.exit(1)

    def pipe_stdin():
        try:
            while True:
                data = os.read(sys.stdin.fileno(), 4096)
                if not data:
                    break
                # pywinpty.write() may expect str or bytes depending on build
                try:
                    pty.write(data)
                except TypeError:
                    pty.write(data.decode("utf-8", errors="replace"))
        except Exception:
            pass

    def pipe_resize():
        try:
            with os.fdopen(3, "rb") as f:
                for line in f:
                    try:
                        cols, rows = (int(x) for x in line.decode().strip().split("x"))
                        pty.set_size(cols, rows)
                    except ValueError:
                        pass
        except Exception:
            pass

    threading.Thread(target=pipe_stdin, daemon=True).start()
    threading.Thread(target=pipe_resize, daemon=True).start()

    # Poll for output — call read() with no args to stay compatible across
    # pywinpty builds (some treat the first positional as blocking:bool, not length).
    while True:
        try:
            data = pty.read()
        except Exception as e:
            sys.stderr.write(f"[blackglass pty read error: {e}]\n")
            sys.stderr.flush()
            break
        if data:
            out = data.encode("utf-8") if isinstance(data, str) else data
            sys.stdout.buffer.write(out)
            sys.stdout.buffer.flush()
        elif not pty.isalive():
            break
        else:
            time.sleep(0.01)

    # Drain any remaining output before exit
    try:
        data = pty.read()
        if data:
            out = data.encode("utf-8") if isinstance(data, str) else data
            sys.stdout.buffer.write(out)
            sys.stdout.buffer.flush()
    except Exception:
        pass

    sys.exit(pty.get_exitstatus() or 0)


main()
