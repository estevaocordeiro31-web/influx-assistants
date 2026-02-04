#!/usr/bin/env python3
"""
Generate seed data for Book 5 content in the database
"""

import json
import os

def clean_vocabulary(vocab_list):
    """Clean and normalize vocabulary items"""
    cleaned = []
    for v in vocab_list:
        # Remove common prefixes and clean up
        v = v.strip()
        if v and len(v) > 2:
            # Remove trailing letters that got concatenated
            v = v.split(' ')[0] if ' ' in v and len(v.split(' ')[-1]) == 1 else v
            cleaned.append(v.upper())
    return list(set(cleaned))

def clean_chunks(chunk_list):
    """Clean and normalize chunks"""
    cleaned = []
    for c in chunk_list:
        c = c.strip().lower()
        if c and len(c) > 3:
            cleaned.append(c)
    return list(set(cleaned))

def generate_seed():
    """Generate seed data from analysis"""
    analysis_file = '/home/ubuntu/influx-assistants/content/book5/book5_analysis.json'
    
    with open(analysis_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Structure for database seed
    seed_data = {
        'book': {
            'id': 5,
            'name': 'Book 5',
            'level': 'Intermediate',
            'description': 'Intermediate level focusing on personality, relationships, colors, crime, permissions, arguments, and storytelling'
        },
        'units': [],
        'lessons': [],
        'vocabulary': [],
        'chunks': [],
        'collocations': [],
        'examples': []
    }
    
    # Define units based on lesson analysis
    units_map = {
        'Unit 1': {'name': 'Friends, Family & Relationships', 'lessons': [1, 2, 3, 4]},
        'Unit 2': {'name': 'Shapes and Colors', 'lessons': [5, 6]},
        'Unit 3': {'name': 'Crime and Punishment', 'lessons': [7, 8]},
        'Unit 4': {'name': 'Permission and Prohibition', 'lessons': [9, 10]},
        'Unit 5': {'name': 'Arguing and Making up', 'lessons': [11, 12]},
        'Unit 6': {'name': 'Storytelling', 'lessons': [13, 14]},
        'Unit 7': {'name': 'Advanced Topics', 'lessons': list(range(15, 31))}
    }
    
    # Add units
    for i, (unit_id, unit_info) in enumerate(units_map.items(), 1):
        seed_data['units'].append({
            'id': i,
            'book_id': 5,
            'name': unit_info['name'],
            'order': i
        })
    
    vocab_id = 1
    chunk_id = 1
    example_id = 1
    
    for lesson in data['lessons']:
        lesson_num = lesson['lesson_number']
        
        # Determine unit
        unit_id = 7  # Default to advanced
        for i, (_, unit_info) in enumerate(units_map.items(), 1):
            if lesson_num in unit_info['lessons']:
                unit_id = i
                break
        
        # Add lesson
        seed_data['lessons'].append({
            'id': lesson_num,
            'book_id': 5,
            'unit_id': unit_id,
            'number': lesson_num,
            'title': lesson['title'],
            'audio_count': lesson['audio_count']
        })
        
        # Add vocabulary
        for vocab in clean_vocabulary(lesson['vocabulary']):
            seed_data['vocabulary'].append({
                'id': vocab_id,
                'lesson_id': lesson_num,
                'word': vocab,
                'type': 'vocabulary'
            })
            vocab_id += 1
        
        # Add chunks
        for chunk in clean_chunks(lesson['chunks']):
            seed_data['chunks'].append({
                'id': chunk_id,
                'lesson_id': lesson_num,
                'expression': chunk,
                'type': 'chunk'
            })
            chunk_id += 1
        
        # Add examples
        for example in lesson.get('examples', []):
            if len(example) > 10:
                seed_data['examples'].append({
                    'id': example_id,
                    'lesson_id': lesson_num,
                    'sentence': example,
                    'type': 'example'
                })
                example_id += 1
    
    return seed_data

def main():
    seed_data = generate_seed()
    
    output_file = '/home/ubuntu/influx-assistants/content/book5/book5_seed.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(seed_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Seed data generated: {output_file}")
    print(f"\n📊 Summary:")
    print(f"  - Units: {len(seed_data['units'])}")
    print(f"  - Lessons: {len(seed_data['lessons'])}")
    print(f"  - Vocabulary items: {len(seed_data['vocabulary'])}")
    print(f"  - Chunks: {len(seed_data['chunks'])}")
    print(f"  - Examples: {len(seed_data['examples'])}")
    
    # Generate SQL insert statements
    sql_file = '/home/ubuntu/influx-assistants/content/book5/book5_seed.sql'
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write("-- Book 5 Seed Data\n\n")
        
        # Insert book
        f.write("-- Insert Book\n")
        f.write(f"INSERT INTO books (id, name, level, description) VALUES (5, 'Book 5', 'Intermediate', 'Intermediate level content');\n\n")
        
        # Insert units
        f.write("-- Insert Units\n")
        for unit in seed_data['units']:
            f.write(f"INSERT INTO units (book_id, name, `order`) VALUES ({unit['book_id']}, '{unit['name']}', {unit['order']});\n")
        
        f.write("\n-- Insert Lessons\n")
        for lesson in seed_data['lessons']:
            title = lesson['title'].replace("'", "''")
            f.write(f"INSERT INTO lessons (book_id, unit_id, number, title) VALUES ({lesson['book_id']}, {lesson['unit_id']}, {lesson['number']}, '{title}');\n")
        
        f.write("\n-- Insert Vocabulary\n")
        for vocab in seed_data['vocabulary']:
            word = vocab['word'].replace("'", "''")
            f.write(f"INSERT INTO vocabulary (lesson_id, word, type) VALUES ({vocab['lesson_id']}, '{word}', 'vocabulary');\n")
        
        f.write("\n-- Insert Chunks\n")
        for chunk in seed_data['chunks']:
            expr = chunk['expression'].replace("'", "''")
            f.write(f"INSERT INTO chunks (lesson_id, expression, type) VALUES ({chunk['lesson_id']}, '{expr}', 'chunk');\n")
    
    print(f"  - SQL file: {sql_file}")

if __name__ == '__main__':
    main()
