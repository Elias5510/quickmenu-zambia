from pathlib import Path

from django.conf import settings
from django.contrib.staticfiles.finders import BaseFinder
from django.core.files.storage import FileSystemStorage


class FrontendStaticFinder(BaseFinder):
    """Expose the existing frontend files without publishing project source or templates."""

    root_files = ("style.css", "dashboard.css", "script.js", "dashboard.js", "register.js")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.storage = FileSystemStorage(location=settings.BASE_DIR)

    def find(self, path, find_all=False):
        if not self._is_allowed(path) or not self.storage.exists(path):
            return [] if find_all else None
        found = self.storage.path(path)
        return [found] if find_all else found

    def list(self, ignore_patterns):
        for name in self.root_files:
            if self.storage.exists(name):
                yield name, self.storage
        assets = Path(settings.BASE_DIR) / "assets"
        if assets.is_dir():
            for path in assets.rglob("*"):
                if path.is_file():
                    relative = path.relative_to(settings.BASE_DIR).as_posix()
                    if self._is_allowed(relative):
                        yield relative, self.storage

    @classmethod
    def _is_allowed(cls, path):
        normalized = Path(path)
        return (
            ".." not in normalized.parts
            and (
                normalized.as_posix() in cls.root_files
                or normalized.parts[0:1] == ("assets",)
                and normalized.suffix.lower()
                in {".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif"}
            )
        )
