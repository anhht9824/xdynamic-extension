import sys
import os
from datetime import datetime

# Add backend directory to path so we can import app modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.database import SessionLocal
from app.services.filter_service import FilterService
from app.models.user import User
from app.repositories.user_repository import UserRepository

def verify_fix():
    db = SessionLocal()
    try:
        print("Starting verification...")
        
        # Get or create a test user
        user_repo = UserRepository(db)
        user = user_repo.get_by_email("test_verify@example.com")
        if not user:
            print("Creating test user...")
            user = user_repo.create(
                email="test_verify@example.com",
                name="Test Verify",
                hashed_password="hashed_password_placeholder"
            )
        
        user_id = user.id
        print(f"Using user ID: {user_id}")
        
        service = FilterService(db)
        
        # 1. Add item to blacklist
        test_url = "verify-persistence.com"
        print(f"Adding {test_url} to blacklist...")
        service.add_item(user_id, "blacklist", test_url)
        
        # 2. Verify it's in the list immediately
        blacklist = service.get_blacklist(user_id)
        found = any(item.url == test_url for item in blacklist)
        print(f"Immediate check: {'Found' if found else 'Not Found'}")
        
        if not found:
            print("FAILED: Item not found immediately after adding.")
            return

        # 3. Create a NEW session to verify persistence
        print("Closing session and opening a new one to verify persistence...")
        db.close()
        db = SessionLocal()
        service = FilterService(db)
        
        blacklist = service.get_blacklist(user_id)
        found = any(item.url == test_url for item in blacklist)
        print(f"Persistence check: {'Found' if found else 'Not Found'}")
        
        if found:
            print("SUCCESS: Item persisted correctly.")
            
            # Cleanup
            print("Cleaning up...")
            item_id = next(item.id for item in blacklist if item.url == test_url)
            service.remove_item(user_id, "blacklist", item_id)
            
            # Verify cleanup
            blacklist = service.get_blacklist(user_id)
            found = any(item.url == test_url for item in blacklist)
            if not found:
                print("Cleanup successful.")
            else:
                print("WARNING: Cleanup failed.")
        else:
            print("FAILED: Item did not persist after session close.")

    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    verify_fix()
