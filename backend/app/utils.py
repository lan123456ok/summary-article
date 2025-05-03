import logging
import sys
from pathlib import Path


logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)


console_handler = logging.StreamHandler(sys.stdout)
file_handler = logging.FileHandler(logs_dir / "app.log")
error_file_handler = logging.FileHandler(logs_dir / "error.log")
error_file_handler.setLevel(logging.ERROR)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    encoding='utf-8',
    handlers=[
        console_handler,
        file_handler,
        error_file_handler
    ]
)

logger = logging.getLogger(__name__)


def setup_logging(name: str) -> logging.Logger:
    return logging.getLogger(name)