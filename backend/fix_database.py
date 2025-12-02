import sqlite3
import os

# Tìm database file
db_path = "data/app.db"  # Hoặc đường dẫn khác tùy config

if not os.path.exists(db_path):
    db_path = "app.db"

if not os.path.exists(db_path):
    print("Database file not found. Creating new one...")
    # Chạy app để tạo database mới
    import sys
    sys.exit(0)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# ========== Fix users table ==========
print("\n=== Fixing users table ===")
cursor.execute("PRAGMA table_info(users)")
user_columns = [col[1] for col in cursor.fetchall()]
print(f"Current users columns: {user_columns}")

users_columns_to_add = {
    "is_active": "INTEGER DEFAULT 1",
    "is_admin": "INTEGER DEFAULT 0",
    "credits": "REAL DEFAULT 0",
}

for col_name, col_type in users_columns_to_add.items():
    if col_name not in user_columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
            print(f"Added column to users: {col_name}")
        except sqlite3.OperationalError as e:
            print(f"Column {col_name} might already exist: {e}")

# ========== Fix usage_logs table ==========
print("\n=== Fixing usage_logs table ===")
cursor.execute("PRAGMA table_info(usage_logs)")
usage_log_columns = [col[1] for col in cursor.fetchall()]
print(f"Current usage_logs columns: {usage_log_columns}")

usage_logs_columns_to_add = {
    "meta_data": "TEXT",
}

for col_name, col_type in usage_logs_columns_to_add.items():
    if col_name not in usage_log_columns:
        try:
            cursor.execute(f"ALTER TABLE usage_logs ADD COLUMN {col_name} {col_type}")
            print(f"Added column to usage_logs: {col_name}")
        except sqlite3.OperationalError as e:
            print(f"Column {col_name} might already exist: {e}")

conn.commit()
conn.close()
print("\n✅ Database fixed!")