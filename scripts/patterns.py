#!/usr/bin/env python3
"""Capture immutable frontend methods and find only approved, scope-matched versions."""
import argparse
import hashlib
import json
import os
import re
import stat
import tempfile
from datetime import datetime, timezone
from pathlib import Path

DEFAULT_LIBRARY = Path.home() / '.local' / 'share' / 'frontend-skill' / 'patterns'
IDENTIFIER = re.compile(r'^[a-z0-9]+(?:[.-][a-z0-9]+)*$')
BLOCKED_DIRS = {'.git', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', 'build'}
BLOCKED_NAMES = {'.env', '.envrc', '.npmrc', '.netrc', '.pypirc', 'auth.json',
                 'credentials.json', 'credentials.yaml', 'credentials.yml', 'cookies.json',
                 'cookies.txt', 'id_rsa', 'id_ed25519'}
SECRET_PATTERNS = [
    rb'-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----',
    rb'\bsuiprivkey1[a-z0-9]{40,}', rb'\bhbr(?:adm)?_[A-Za-z0-9_-]{20,}',
    rb'\b(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{25,}',
    rb'\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}', rb'\bAKIA[0-9A-Z]{16}\b',
    rb'(?i)\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s:/]+:[^\s@]+@',
    rb'''(?i)\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|authorization)["']?\s*[:=]\s*["'][^"'\r\n]{8,}["']''',
    rb'(?i)[?&](?:access_token|token|api_key|sig|signature)=[^\s&#"\x27]{8,}',
]


def identifier(value):
    if not isinstance(value, str) or len(value) > 64 or not IDENTIFIER.fullmatch(value):
        raise ValueError('Pattern IDs/versions must be short lowercase identifiers without path segments')
    return value


def require_text(obj, key):
    if not isinstance(obj.get(key), str) or not obj[key].strip():
        raise ValueError('Required nonempty text field: ' + key)


def check_secrets(raw, label):
    if any(re.search(pattern, raw) for pattern in SECRET_PATTERNS):
        raise ValueError('Potential credential detected in ' + label + '; nothing captured; inspect selected content')


def safe_file(base, relative):
    if not isinstance(relative, str) or not relative or '\\' in relative:
        raise ValueError('Use nonempty relative POSIX file paths')
    p = Path(relative)
    if p.is_absolute() or '..' in p.parts or p.as_posix() != relative or relative == '.':
        raise ValueError('Unsafe relative file path')
    current = base
    for part in p.parts:
        current = current / part
        if current.is_symlink():
            raise ValueError('Symlinks are not captured or followed')
    resolved = current.resolve(strict=True)
    if not resolved.is_relative_to(base.resolve()) or not resolved.is_file():
        raise ValueError('Selected path is not a file inside the declared root')
    return current


def check_source_name(relative):
    parts = Path(relative).parts
    low = parts[-1].lower()
    if (any(p in BLOCKED_DIRS for p in parts) or low in BLOCKED_NAMES
            or low.startswith('.env.') or low.endswith(('.pem', '.p12', '.pfx', '.key', '.pyc'))):
        raise ValueError('Credential/config/cache/build path is excluded: ' + relative)


def records(root):
    if not root.exists():
        return []
    found = []
    for p in sorted(root.glob('*/*/pattern.json')):
        if any(q.is_symlink() for q in (p, p.parent, p.parent.parent)):
            raise ValueError('Symlink in design library')
        m = json.loads(p.read_text())
        if m.get('id') != p.parent.parent.name or m.get('version') != p.parent.name:
            raise ValueError('Pattern metadata identity differs from its directory')
        identifier(m['id']); identifier(m['version'])
        if m.get('status') not in {'candidate', 'approved', 'retired'}:
            raise ValueError('Invalid pattern status')
        datetime.fromisoformat(m['captured_at'])
        found.append((m, p.parent))
    return found


def scope_key(scope):
    if not isinstance(scope, dict) or scope.get('kind') not in {'project', 'global'}:
        raise ValueError('Scope must explicitly be project or global')
    if scope['kind'] == 'project':
        require_text(scope, 'project')
        return ('project', scope['project'])
    require_text(scope, 'evidence')
    return ('global', None)


def capture(spec_path, source, root):
    spec = json.loads(spec_path.read_text())
    if not isinstance(spec, dict):
        raise ValueError('Specification must be a JSON object')
    check_secrets(json.dumps(spec, ensure_ascii=False).encode(), 'capture specification')
    pid = identifier(spec.get('id')); version = identifier(spec.get('version'))
    require_text(spec, 'title')
    status = spec.get('status')
    if status not in {'candidate', 'approved', 'retired'}:
        raise ValueError('Status must be candidate, approved or retired')
    if spec.get('kind') not in {'reference', 'implementation'}:
        raise ValueError('Kind must be reference or implementation')
    scope = scope_key(spec.get('scope'))
    evidence = spec.get('approval', {})
    if not isinstance(evidence, dict):
        raise ValueError('Approval evidence must be an object')
    if status in {'approved', 'retired'}:
        require_text(evidence, 'evidence')
    if status == 'approved':
        for key in ('applicability', 'recipe'):
            require_text(spec, key)
        for field, keys in [('provenance', ('source', 'license')), ('validation', ('observed', 'limits'))]:
            if not isinstance(spec.get(field), dict):
                raise ValueError('Required object: ' + field)
            for key in keys:
                require_text(spec[field], key)
        if not isinstance(spec.get('dependencies'), list):
            raise ValueError('Approved methods must declare dependencies, including an empty list when none')
    tags = spec.get('tags', [])
    if not isinstance(tags, list) or any(not isinstance(x, str) or not x.strip() for x in tags):
        raise ValueError('Tags must be nonempty strings')
    files = spec.get('files', [])
    if not isinstance(files, list) or any(not isinstance(f, str) for f in files) or len(set(files)) != len(files):
        raise ValueError('Files must be a unique explicit list of relative paths')
    if status == 'approved' and spec['kind'] == 'implementation' and not files:
        raise ValueError('An approved implementation needs actual payload files')
    if root.is_symlink():
        raise ValueError('Library root cannot be a symlink')
    root = root.resolve()
    target = root / pid / version
    if target.exists() or target.is_symlink():
        raise ValueError('Version already exists; choose a new version instead of overwriting')
    if root.is_symlink() or (root / pid).is_symlink():
        raise ValueError('Library directories cannot be symlinks')
    for previous, _ in records(root):
        if previous['id'] == pid and scope_key(previous['scope']) != scope:
            raise ValueError('Scope is immutable within an ID; use a new ID for a different project/global scope')
    source = source.resolve(strict=True)
    payload = []
    for relative in files:
        check_source_name(relative)
        path = safe_file(source, relative)
        before = path.stat(); raw = path.read_bytes(); after = path.stat()
        if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
            raise ValueError('Source changed while being captured; retry from a stable file')
        check_secrets(raw, relative)
        payload.append((relative, raw, stat.S_IMODE(before.st_mode) & 0o777))
    m = dict(spec)
    m.update(schema=1, captured_at=datetime.now(timezone.utc).isoformat(), files=[])
    for relative, raw, mode in payload:
        m['files'].append({'path': relative, 'size': len(raw), 'sha256': hashlib.sha256(raw).hexdigest(), 'mode': mode})
    parent = root / pid
    parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    with tempfile.TemporaryDirectory(prefix='.capture-', dir=str(parent)) as temporary:
        stage = Path(temporary) / 'version'
        stage.mkdir(mode=0o700)
        for relative, raw, mode in payload:
            out = stage / 'payload' / relative
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_bytes(raw); out.chmod(mode)
        (stage / 'pattern.json').write_text(json.dumps(m, ensure_ascii=False, indent=2) + '\n')
        os.rename(str(stage), str(target))
    return {'captured': True, 'id': pid, 'version': version, 'status': status,
            'scope': spec['scope'], 'files': len(payload), 'path': str(target)}


def verify(root, pid, version):
    identifier(pid); identifier(version)
    directory = root / pid / version
    manifest = safe_file(root, pid + '/' + version + '/pattern.json')
    m = json.loads(manifest.read_text())
    if m.get('id') != pid or m.get('version') != version:
        raise ValueError('Pattern identity mismatch')
    payload_root = directory / 'payload'
    if payload_root.is_symlink() or (m['files'] and not payload_root.is_dir()):
        raise ValueError('Payload root must be a real directory, never a symlink')
    expected = set()
    for f in m['files']:
        path = safe_file(payload_root, f['path'])
        if f['path'] in expected:
            raise ValueError('Duplicate payload path')
        expected.add(f['path'])
        raw = path.read_bytes()
        if (len(raw) != f['size'] or hashlib.sha256(raw).hexdigest() != f['sha256']
                or stat.S_IMODE(path.stat().st_mode) != f['mode']):
            raise ValueError('Payload integrity/permissions differ: ' + f['path'])
    actual = set()
    for path in payload_root.rglob('*'):
        if path.is_symlink():
            raise ValueError('Unexpected symlink in payload')
        if path.is_file():
            actual.add(path.relative_to(payload_root).as_posix())
    if actual != expected:
        raise ValueError('Payload file set differs from the manifest')
    return {'verified': True, 'id': pid, 'version': version, 'files': len(expected)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--library', type=Path, default=DEFAULT_LIBRARY,
                        help='Path to the design library (default: %(default)s)')
    sub = parser.add_subparsers(dest='command', required=True)
    cap = sub.add_parser('capture'); cap.add_argument('--spec', type=Path, required=True); cap.add_argument('--source', type=Path, required=True)
    sub.add_parser('list')
    find = sub.add_parser('find'); find.add_argument('query'); find.add_argument('--project', required=True)
    check = sub.add_parser('verify'); check.add_argument('id'); check.add_argument('version')
    args = parser.parse_args()
    try:
        root = args.library.absolute()
        if root.is_symlink():
            raise ValueError('Library root cannot be a symlink')
        if args.command == 'capture':
            result = capture(args.spec, args.source, root)
        elif args.command == 'verify':
            result = verify(root, args.id, args.version)
        else:
            all_records = records(root)
            if args.command == 'list':
                result = [{'id': m['id'], 'version': m['version'], 'title': m['title'], 'status': m['status'],
                           'kind': m['kind'], 'scope': m['scope'], 'path': str(p)} for m, p in all_records]
            else:
                latest = {}
                for m, p in all_records:
                    if m['status'] == 'candidate':
                        continue
                    if m['id'] not in latest or m['captured_at'] > latest[m['id']][0]['captured_at']:
                        latest[m['id']] = (m, p)
                result = []
                words = args.query.casefold().split()
                for m, p in latest.values():
                    if m['status'] != 'approved':
                        continue
                    scope = scope_key(m['scope'])
                    if scope[0] == 'project' and scope[1] != args.project:
                        continue
                    text = ' '.join(str(m.get(k, '')) for k in ('id', 'title', 'tags', 'applicability', 'recipe')).casefold()
                    query = args.query.casefold()
                    score = sum(w in text for w in words) + 2 * sum(tag.casefold() in query for tag in m.get('tags', []))
                    if words and not score:
                        continue
                    result.append({'id': m['id'], 'version': m['version'], 'title': m['title'], 'kind': m['kind'],
                                   'scope': m['scope'], 'score': score, 'path': str(p), 'verify_before_reuse': True})
                result.sort(key=lambda m: (-m['score'], m['id']))
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (ValueError, OSError, KeyError, TypeError) as error:
        print(json.dumps({'error': str(error)}, ensure_ascii=False))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
