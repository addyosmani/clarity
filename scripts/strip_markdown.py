#!/usr/bin/env python3
"""
strip_markdown.py — reduce a markdown draft to the prose a reader actually reads.

Removes YAML frontmatter, fenced and inline code, images, HTML comments, tables,
heading markers, list markers, blockquote markers, and emphasis marks. Link text
is kept and the URL dropped, since the reader reads the text.

Usage:
    python3 strip_markdown.py draft.md > draft.txt
    python3 strip_markdown.py draft.md | python3 prose_stats.py -
"""

import re
import sys


def strip(text):
    # YAML frontmatter
    text = re.sub(r"\A---\n.*?\n---\n", "", text, flags=re.S)
    # HTML comments
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    # Fenced code
    text = re.sub(r"^```.*?^```", "", text, flags=re.S | re.M)
    text = re.sub(r"^~~~.*?^~~~", "", text, flags=re.S | re.M)
    # Indented code blocks
    text = re.sub(r"^(?: {4}|\t).*$", "", text, flags=re.M)
    # Images before links, so alt text goes with the image
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    # Links: keep the text
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]*)\]\[[^\]]*\]", r"\1", text)
    # Reference definitions
    text = re.sub(r"^\s*\[[^\]]+\]:\s+\S+.*$", "", text, flags=re.M)
    # Inline code
    text = re.sub(r"`+([^`]*)`+", r"\1", text)
    # Tables
    text = re.sub(r"^\s*\|.*$", "", text, flags=re.M)
    # Horizontal rules
    text = re.sub(r"^\s*(?:[-*_]\s*){3,}$", "", text, flags=re.M)
    # Headings, blockquotes, list markers
    text = re.sub(r"^\s{0,3}#{1,6}\s+", "", text, flags=re.M)
    text = re.sub(r"^\s{0,3}>\s?", "", text, flags=re.M)
    text = re.sub(r"^\s{0,3}(?:[-*+]|\d+\.)\s+", "", text, flags=re.M)
    # Emphasis marks
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"__([^_]+)__", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"(?<![\w_])_([^_]+)_(?![\w_])", r"\1", text)
    text = re.sub(r"~~([^~]+)~~", r"\1", text)
    # Residual HTML tags
    text = re.sub(r"</?[a-zA-Z][^>]*>", "", text)
    # Collapse blank runs
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def main():
    if len(sys.argv) < 2 or sys.argv[1] == "-":
        text = sys.stdin.read()
    else:
        with open(sys.argv[1], encoding="utf-8") as fh:
            text = fh.read()
    sys.stdout.write(strip(text))


if __name__ == "__main__":
    main()
