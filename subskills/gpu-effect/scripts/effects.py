#!/usr/bin/env python3
"""Search the local component catalog and verify vendored source. No dependencies."""
import argparse
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]


def read_json(relative):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def source_path(relative):
    path = (ROOT / relative).resolve()
    if not path.is_relative_to(ROOT.resolve()) or not path.is_file():
        raise ValueError(f"Missing or invalid local file: {relative}")
    return path


def run(args):
    if args.command == "verify":
        manifest = read_json("references/upstream-files.json")
        failures = []
        for record in manifest["files"]:
            relative = "upstream/" + record["path"]
            try:
                actual = hashlib.sha256(source_path(relative).read_bytes()).hexdigest()
                if actual != record["sha256"]:
                    failures.append(f"Changed: {relative}")
            except ValueError as error:
                failures.append(str(error))
        if failures:
            print("\n".join(failures), file=sys.stderr)
            return 1
        print(f"Verified {len(manifest['files'])} upstream files at {manifest['commit']}")
        return 0

    catalog = read_json("references/component-index.json")
    entries = catalog["components"]
    if args.command == "show":
        matches = [item for item in entries if item["name"].casefold() == args.name.casefold()]
        if len(matches) != 1:
            raise ValueError(f"Component not found: {args.name}; use search to find its exact name")
        item = matches[0]
        for key in ["name", "category", "role", "description", "requiresChild"]:
            print(f"{key}: {item.get(key)}")
        print("props: " + ", ".join(item["props"]))
        print("source: " + str(source_path(item["source"])))
        if args.source:
            print(source_path(item["source"]).read_text(encoding="utf-8"))
        return 0

    query = args.query.casefold()
    matches = [item for item in entries if query in
               " ".join(str(item.get(key, "")) for key in
                        ["name", "category", "description", "role"]).casefold()]
    if args.category:
        matches = [item for item in matches if item["category"].casefold() == args.category.casefold()]
    if args.json:
        print(json.dumps(matches, ensure_ascii=False, indent=2))
    else:
        for item in matches:
            print(f"{item['name']} | {item['category']} | {item['role']} | {item['description']}")
        print(f"{len(matches)} matching components")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    search = sub.add_parser("search", help="Search names, descriptions, categories and roles")
    search.add_argument("query", nargs="?", default="")
    search.add_argument("--category")
    search.add_argument("--json", action="store_true")
    show = sub.add_parser("show", help="Show exact component props and local source path")
    show.add_argument("name")
    show.add_argument("--source", action="store_true")
    sub.add_parser("verify", help="Verify all upstream source hashes")
    args = parser.parse_args()
    try:
        return run(args)
    except (ValueError, OSError, KeyError) as error:
        print(f"gpu-effect: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
