#!/usr/bin/env python3
"""
Seed Book 5 data into the database
"""

import json
import mysql.connector
import os
import re

def get_db_connection():
    """Get database connection from environment"""
    db_url = os.environ.get('CENTRAL_DATABASE_URL', '')
    
    if not db_url:
        raise Exception("CENTRAL_DATABASE_URL not found in environment")
    
    # Parse mysql://user:pass@host:port/database
    match = re.match(r'mysql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)', db_url)
    if not match:
        raise Exception(f"Invalid DATABASE_URL format")
    
    user, password, host, port, database = match.groups()
    
    return mysql.connector.connect(
        host=host,
        port=int(port),
        user=user,
        password=password,
        database=database,
        ssl_disabled=False
    )

def seed_book5():
    """Seed Book 5 data"""
    seed_file = '/home/ubuntu/influx-assistants/content/book5/book5_seed.json'
    
    with open(seed_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Insert lessons
        print("Inserting lessons...")
        for lesson in data['lessons']:
            cursor.execute("""
                INSERT INTO lessons (book_id, unit_id, lesson_number, title, audio_count)
                VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE title = VALUES(title)
            """, (5, lesson['unit_id'], lesson['number'], lesson['title'], lesson['audio_count']))
        
        conn.commit()
        print(f"  - Inserted {len(data['lessons'])} lessons")
        
        # Get lesson IDs
        cursor.execute("SELECT id, lesson_number FROM lessons WHERE book_id = 5")
        lesson_ids = {row[1]: row[0] for row in cursor.fetchall()}
        
        # Insert vocabulary
        print("Inserting vocabulary...")
        vocab_count = 0
        for vocab in data['vocabulary']:
            lesson_id = lesson_ids.get(vocab['lesson_id'])
            if lesson_id:
                cursor.execute("""
                    INSERT INTO lesson_vocabulary (lesson_id, word)
                    VALUES (%s, %s)
                """, (lesson_id, vocab['word']))
                vocab_count += 1
        
        conn.commit()
        print(f"  - Inserted {vocab_count} vocabulary items")
        
        # Insert chunks
        print("Inserting chunks...")
        chunk_count = 0
        for chunk in data['chunks']:
            lesson_id = lesson_ids.get(chunk['lesson_id'])
            if lesson_id:
                cursor.execute("""
                    INSERT INTO lesson_chunks (lesson_id, expression, chunk_type)
                    VALUES (%s, %s, 'expression')
                """, (lesson_id, chunk['expression']))
                chunk_count += 1
        
        conn.commit()
        print(f"  - Inserted {chunk_count} chunks")
        
        # Insert examples
        print("Inserting examples...")
        example_count = 0
        for example in data['examples']:
            lesson_id = lesson_ids.get(example['lesson_id'])
            if lesson_id:
                cursor.execute("""
                    INSERT INTO lesson_examples (lesson_id, sentence)
                    VALUES (%s, %s)
                """, (lesson_id, example['sentence']))
                example_count += 1
        
        conn.commit()
        print(f"  - Inserted {example_count} examples")
        
        print("\n✅ Book 5 data seeded successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    seed_book5()
