#!/usr/bin/env python3
"""
Detailed analysis of Book 5 content - Extract chunks, vocabulary, collocations, equivalences
"""

import json
import os
import re
from pathlib import Path

def analyze_lesson(lesson_data):
    """Analyze a single lesson to extract structured content"""
    texts = lesson_data.get('all_texts', [])
    slides = lesson_data.get('slides', [])
    
    result = {
        'lesson_number': lesson_data.get('lesson_number'),
        'file': lesson_data.get('file'),
        'unit': '',
        'title': '',
        'vocabulary': [],
        'chunks': [],
        'key_phrases': [],
        'collocations': [],
        'equivalences': [],
        'examples': [],
        'audio_count': len(lesson_data.get('audio_files', []))
    }
    
    # Extract unit and title from first slide
    if slides and len(slides) > 0:
        first_slide = slides[0].get('texts', [])
        for i, text in enumerate(first_slide):
            if text.startswith('Unit'):
                result['unit'] = text
            elif text not in ['Lesson', 'Unit'] and len(text) > 3:
                result['title'] = text
    
    # Process all texts to find patterns
    full_text = ' '.join(texts)
    
    # Find vocabulary items (words in HELPING YOU sections)
    vocab_pattern = r'HELPING\s+YOU\s+([A-Z\s/\(\)]+)'
    for match in re.finditer(vocab_pattern, full_text):
        vocab = match.group(1).strip()
        if vocab and vocab not in result['vocabulary']:
            result['vocabulary'].append(vocab)
    
    # Find "is similar to" patterns (synonyms/equivalences)
    similar_pattern = r'(\w+)\s+is\s+similar\s+to\s+(\w+)'
    for match in re.finditer(similar_pattern, full_text, re.IGNORECASE):
        equiv = f"{match.group(1)} = {match.group(2)}"
        if equiv not in result['equivalences']:
            result['equivalences'].append(equiv)
    
    # Find "means almost the same as" patterns
    means_pattern = r'(\w+)\s+means\s+(?:almost\s+)?the\s+same\s+as\s+(\w+)'
    for match in re.finditer(means_pattern, full_text, re.IGNORECASE):
        equiv = f"{match.group(1)} = {match.group(2)}"
        if equiv not in result['equivalences']:
            result['equivalences'].append(equiv)
    
    # Find key phrases (to + verb patterns)
    phrase_patterns = [
        r'to\s+(\w+\s+\w+(?:\s+\w+)?)',  # to + 2-3 words
        r"I'd\s+like\s+to\s+(\w+)",
        r"I've\s+been\s+(\w+ing)",
    ]
    
    for pattern in phrase_patterns:
        for match in re.finditer(pattern, full_text, re.IGNORECASE):
            phrase = match.group(0).strip()
            if len(phrase) > 5 and phrase not in result['key_phrases']:
                result['key_phrases'].append(phrase)
    
    # Find chunks (common expressions)
    chunk_indicators = [
        'no matter', 'full of', 'pass away', 'heading for', 'headed to',
        'keep it to', 'speak your mind', 'get to know', 'get acquainted',
        'show off', 'beat around the bush', 'get straight to the point',
        'team player', 'well-off', 'by sight', 'at times',
        'envious of', 'envy of', 'confident about', 'confidence in',
        'faithful to', 'unfaithful to', 'prejudice against', 'prejudiced against',
        'stare at', 'belong to', 'belongs to'
    ]
    
    for chunk in chunk_indicators:
        if chunk.lower() in full_text.lower():
            if chunk not in result['chunks']:
                result['chunks'].append(chunk)
    
    # Find example sentences (sentences with punctuation)
    for text in texts:
        if len(text) > 15 and any(p in text for p in ['.', '?', '!']):
            # Clean up the text
            clean_text = text.strip()
            if clean_text and clean_text not in result['examples'] and not clean_text.isupper():
                result['examples'].append(clean_text)
    
    # Find collocations (verb + noun, adj + noun patterns)
    collocation_patterns = [
        r'(make|take|have|get|do|give|keep)\s+a\s+(\w+)',
        r'(racial|sexual|religious|class|political|cultural)\s+prejudice',
        r'(self-confident|self-assured|well-groomed|big headed|bad tempered)',
    ]
    
    for pattern in collocation_patterns:
        for match in re.finditer(pattern, full_text, re.IGNORECASE):
            colloc = match.group(0).strip()
            if colloc not in result['collocations']:
                result['collocations'].append(colloc)
    
    return result

def main():
    content_dir = '/home/ubuntu/influx-assistants/content/book5'
    output_file = os.path.join(content_dir, 'book5_analysis.json')
    
    all_lessons = []
    
    # Process each lesson file
    for i in range(1, 31):
        lesson_file = os.path.join(content_dir, f'lesson_{i:02d}.json')
        if os.path.exists(lesson_file):
            with open(lesson_file, 'r', encoding='utf-8') as f:
                lesson_data = json.load(f)
            
            analysis = analyze_lesson(lesson_data)
            all_lessons.append(analysis)
            
            print(f"Lesson {i:02d}: {analysis['title'][:40] if analysis['title'] else 'No title'}")
            print(f"  - Vocabulary: {len(analysis['vocabulary'])} items")
            print(f"  - Chunks: {len(analysis['chunks'])} items")
            print(f"  - Examples: {len(analysis['examples'])} items")
            print(f"  - Audio files: {analysis['audio_count']}")
    
    # Sort by lesson number
    all_lessons.sort(key=lambda x: x['lesson_number'])
    
    # Save analysis
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'book': 'Book 5',
            'total_lessons': len(all_lessons),
            'lessons': all_lessons
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Analysis saved to {output_file}")
    
    # Print summary statistics
    total_vocab = sum(len(l['vocabulary']) for l in all_lessons)
    total_chunks = sum(len(l['chunks']) for l in all_lessons)
    total_examples = sum(len(l['examples']) for l in all_lessons)
    total_audio = sum(l['audio_count'] for l in all_lessons)
    
    print(f"\n📊 Summary:")
    print(f"  - Total vocabulary items: {total_vocab}")
    print(f"  - Total chunks: {total_chunks}")
    print(f"  - Total examples: {total_examples}")
    print(f"  - Total audio files: {total_audio}")

if __name__ == '__main__':
    main()
