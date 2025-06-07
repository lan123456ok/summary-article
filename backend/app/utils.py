import logging
import sys
import io
from pathlib import Path

logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)


class Utf8StreamHandler(logging.StreamHandler):
    def __init__(self, stream=None):
        if stream is None:
            stream = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='backslashreplace')
        super().__init__(stream)


console_handler = Utf8StreamHandler()
console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter)

file_handler = logging.FileHandler(logs_dir / "app.log", encoding='utf-8')
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)

error_file_handler = logging.FileHandler(logs_dir / "error.log", encoding='utf-8')
error_file_handler.setLevel(logging.ERROR)
error_file_handler.setFormatter(file_formatter)

logging.basicConfig(
    level=logging.INFO,
    handlers=[
        console_handler,
        file_handler,
        error_file_handler
    ]
)

logger = logging.getLogger(__name__)


def setup_logging(name: str) -> logging.Logger:
    return logging.getLogger(name)
