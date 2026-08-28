#!/usr/bin/env python3
"""Validate Clarity's compact runtime, routes, samples, and behavioral evals."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
RUNTIME_FILES = [
    ROOT / "SKILL.md",
    ROOT / "references" / "interview.md",
    ROOT / "references" / "edit.md",
    ROOT / "references" / "longform.md",
    ROOT / "references" / "medium.md",
    ROOT / "references" / "review.md",
]
REQUIRED_FILES = RUNTIME_FILES + [
    ROOT / "commands" / "clarity-interview.md",
    ROOT / "commands" / "clarity-rewrite.md",
    ROOT / "commands" / "clarity-review.md",
    ROOT / "evals" / "cases.json",
    ROOT / "evals" / "JUDGE.md",
    ROOT / "samples" / "README.md",
    ROOT / "samples" / "how-ai-works.before.md",
    ROOT / "samples" / "how-ai-works.after.md",
    ROOT / "samples" / "what-it-means-to-be-human.before.md",
    ROOT / "samples" / "what-it-means-to-be-human.after.md",
]
RETIRED_REFERENCES = {
    "references/calibration.md",
    "references/craft.md",
    "references/critique.md",
    "references/tells.md",
}
REQUIRED_CATEGORIES = {
    "factual_fidelity",
    "medium_fit",
    "false_positive",
    "authorship",
    "mode_boundary",
    "instruction_integrity",
}


def words(path: Path) -> int:
    return len(re.findall(r"\b[\w'-]+\b", path.read_text(encoding="utf-8")))


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)
    print(f"FAIL  {message}")


def passed(message: str) -> None:
    print(f"PASS  {message}")


def main() -> int:
    failures: list[str] = []

    missing = [str(path.relative_to(ROOT)) for path in REQUIRED_FILES if not path.is_file()]
    if missing:
        fail(f"missing required files: {', '.join(missing)}", failures)
    else:
        passed(f"{len(REQUIRED_FILES)} required files exist")

    if any(not path.is_file() for path in RUNTIME_FILES):
        fail("cannot measure runtime because a runtime file is missing", failures)
    else:
        root_words = words(ROOT / "SKILL.md")
        runtime_words = sum(words(path) for path in RUNTIME_FILES)
        if root_words > 1500:
            fail(f"SKILL.md is {root_words} words; budget is 1500", failures)
        else:
            passed(f"SKILL.md is {root_words} words (budget 1500)")
        if runtime_words > 5000:
            fail(f"runtime is {runtime_words} words; budget is 5000", failures)
        else:
            passed(f"runtime is {runtime_words} words (budget 5000)")

    skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    if not re.search(r"^---\n.*?^name:\s*clarity\s*$.*?^---$", skill, re.M | re.S):
        fail("SKILL.md frontmatter is missing a valid clarity name", failures)
    elif not re.search(r'^\s+version:\s*["\']\d+\.\d+\.\d+["\']\s*$', skill, re.M):
        fail("SKILL.md metadata.version is missing or not semantic", failures)
    else:
        passed("SKILL.md frontmatter includes name and semantic version")

    searchable = [ROOT / "SKILL.md", ROOT / "README.md", *ROOT.glob("commands/*.md")]
    retired_hits = []
    for path in searchable:
        text = path.read_text(encoding="utf-8")
        retired_hits.extend(
            f"{path.relative_to(ROOT)} -> {retired}"
            for retired in RETIRED_REFERENCES
            if retired in text
        )
    if retired_hits:
        fail(f"retired references remain: {', '.join(retired_hits)}", failures)
    else:
        passed("runtime routes contain no retired references")

    try:
        payload = json.loads((ROOT / "evals" / "cases.json").read_text(encoding="utf-8"))
        cases = payload["cases"]
    except (OSError, json.JSONDecodeError, KeyError, TypeError) as exc:
        fail(f"eval case file is invalid: {exc}", failures)
        cases = []

    ids = [case.get("id") for case in cases if isinstance(case, dict)]
    categories = {case.get("category") for case in cases if isinstance(case, dict)}
    required_case_fields = {
        "id", "mode", "category", "prompt", "input", "requirements", "prohibitions"
    }
    malformed = [
        case.get("id", f"case {index}")
        for index, case in enumerate(cases)
        if not isinstance(case, dict)
        or not required_case_fields.issubset(case)
        or not case.get("requirements")
        or not case.get("prohibitions")
    ]
    if len(cases) < 10:
        fail(f"eval suite has {len(cases)} cases; minimum is 10", failures)
    elif len(ids) != len(set(ids)):
        fail("eval case ids are not unique", failures)
    elif malformed:
        fail(f"malformed eval cases: {', '.join(map(str, malformed))}", failures)
    elif not REQUIRED_CATEGORIES.issubset(categories):
        missing_categories = sorted(REQUIRED_CATEGORIES - categories)
        fail(f"eval categories missing: {', '.join(missing_categories)}", failures)
    else:
        passed(f"{len(cases)} behavioral eval cases cover all required categories")

    if failures:
        print(f"\n{len(failures)} validation failure(s)")
        return 1
    print("\nClarity package validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
