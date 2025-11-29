from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.config import get_settings

settings = get_settings()

BACKEND_ROOT = Path(__file__).resolve().parents[1]


def _resolve_database_url(raw_url: str) -> str:
    """Ensure sqlite URLs point to the backend directory, not the cwd."""
    if raw_url.startswith("sqlite://"):
        # Strip the scheme and normalize the file path
        path_part = raw_url.replace("sqlite:///", "", 1)
        if path_part == ":memory:":
            return raw_url

        db_path = Path(path_part)
        if not db_path.is_absolute():
            db_path = BACKEND_ROOT / db_path
        db_path.parent.mkdir(parents=True, exist_ok=True)
        return f"sqlite:///{db_path.as_posix()}"

    return raw_url


db_url = _resolve_database_url(settings.DATABASE_URL)

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Session:
    """Dependency for getting DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

