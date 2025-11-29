import sys
import os
from sqlalchemy import text
from app.database import SessionLocal

# Add current directory to path
sys.path.append(os.getcwd())

def migrate():
    db = SessionLocal()
    try:
        # Check if column exists
        result = db.execute(text("PRAGMA table_info(users)")).fetchall()
        columns = [row[1] for row in result]
        
        if 'is_admin' not in columns:
            print("Adding is_admin column to users table...")
            db.execute(text("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0"))
            db.commit()
            print("Migration successful!")
        else:
            print("Column is_admin already exists.")
            
    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
