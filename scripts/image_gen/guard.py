"""Safe write policy for generated images."""
from __future__ import annotations

import shutil
from dataclasses import dataclass
from pathlib import Path


class OverwriteBlockedError(Exception):
    def __init__(self, path: Path):
        self.path = path
        super().__init__(
            f"Refusing to overwrite existing file: {path}\n"
            f"Use --output {path.with_suffix('.pending.png')} or --yes-overwrite (backs up to .bak)"
        )


@dataclass
class WritePlan:
    target: Path
    will_overwrite: bool
    backup_path: Path | None


def plan_image_write(target: Path, yes_overwrite: bool) -> WritePlan:
    target = target.resolve()
    if not target.exists():
        return WritePlan(target=target, will_overwrite=False, backup_path=None)
    if not yes_overwrite:
        raise OverwriteBlockedError(target)
    backup = target.with_suffix(target.suffix + ".bak")
    return WritePlan(target=target, will_overwrite=True, backup_path=backup)


def apply_backup(plan: WritePlan) -> None:
    if plan.backup_path and plan.target.exists():
        shutil.copy2(plan.target, plan.backup_path)


def write_bytes(plan: WritePlan, data: bytes) -> None:
    if plan.will_overwrite:
        apply_backup(plan)
    plan.target.parent.mkdir(parents=True, exist_ok=True)
    plan.target.write_bytes(data)
