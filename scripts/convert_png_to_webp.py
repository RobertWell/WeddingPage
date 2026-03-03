#!/usr/bin/env python3

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def convert_image(source: Path, quality: int, method: int) -> Path:
    if source.suffix.lower() != ".png":
        raise ValueError(f"Expected a PNG file: {source}")

    target = source.with_suffix(".webp")
    with Image.open(source) as image:
        image.save(
            target,
            format="WEBP",
            quality=quality,
            method=method,
            optimize=True,
        )
    return target


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert PNG assets to optimized WebP files."
    )
    parser.add_argument("files", nargs="+", help="PNG files to convert")
    parser.add_argument(
        "--quality",
        type=int,
        default=80,
        help="WebP quality (0-100). Lower is smaller. Default: 80",
    )
    parser.add_argument(
        "--method",
        type=int,
        default=6,
        help="WebP compression effort (0-6). Higher is slower. Default: 6",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    for file_name in args.files:
        source = Path(file_name)
        if not source.is_file():
            raise FileNotFoundError(f"File not found: {source}")
        target = convert_image(source, quality=args.quality, method=args.method)
        print(f"{source} -> {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
