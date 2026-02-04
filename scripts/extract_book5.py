#!/usr/bin/env python3
"""
Extract content from Book 5 PPSX files
"""

import zipfile
import xml.etree.ElementTree as ET
import os
import json
import re
from pathlib import Path

def extract_text_from_xml(xml_content):
    """Extract all text from PowerPoint XML"""
    # Remove namespace prefixes for easier parsing
    xml_content = re.sub(r'xmlns[^"]*"[^"]*"', '', xml_content)
    xml_content = re.sub(r'<a:', '<', xml_content)
    xml_content = re.sub(r'</a:', '</', xml_content)
    xml_content = re.sub(r'<p:', '<', xml_content)
    xml_content = re.sub(r'</p:', '</', xml_content)
    
    texts = []
    # Find all text elements
    for match in re.finditer(r'<t[^>]*>([^<]+)</t>', xml_content):
        text = match.group(1).strip()
        if text and len(text) > 1:
            texts.append(text)
    
    return texts

def extract_ppsx_content(ppsx_path):
    """Extract content from a PPSX file"""
    result = {
        'file': os.path.basename(ppsx_path),
        'slides': [],
        'texts': [],
        'audio_files': [],
        'media_files': []
    }
    
    try:
        with zipfile.ZipFile(ppsx_path, 'r') as zip_ref:
            # List all files
            for name in zip_ref.namelist():
                # Extract slide content
                if name.startswith('ppt/slides/slide') and name.endswith('.xml'):
                    try:
                        content = zip_ref.read(name).decode('utf-8', errors='ignore')
                        texts = extract_text_from_xml(content)
                        slide_num = re.search(r'slide(\d+)', name)
                        if slide_num:
                            result['slides'].append({
                                'number': int(slide_num.group(1)),
                                'texts': texts
                            })
                        result['texts'].extend(texts)
                    except Exception as e:
                        pass
                
                # Find audio files
                if 'media' in name and any(ext in name.lower() for ext in ['.mp3', '.wav', '.m4a', '.wma']):
                    result['audio_files'].append(name)
                
                # Find other media
                if 'media' in name:
                    result['media_files'].append(name)
    
    except Exception as e:
        result['error'] = str(e)
    
    # Sort slides by number
    result['slides'].sort(key=lambda x: x['number'])
    
    return result

def analyze_lesson_content(texts):
    """Analyze texts to identify chunks, vocabulary, etc."""
    analysis = {
        'chunks': [],
        'vocabulary': [],
        'collocations': [],
        'equivalences': [],
        'examples': []
    }
    
    # Common chunk patterns
    chunk_patterns = [
        r"I'm going to",
        r"I'll",
        r"gonna",
        r"wanna",
        r"gotta",
        r"have to",
        r"has to",
        r"used to",
        r"get used to",
        r"be used to",
        r"would rather",
        r"had better",
        r"might as well",
        r"as long as",
        r"in order to",
        r"so that",
        r"even though",
        r"as if",
        r"as though",
    ]
    
    full_text = ' '.join(texts)
    
    # Find chunks
    for pattern in chunk_patterns:
        if re.search(pattern, full_text, re.IGNORECASE):
            analysis['chunks'].append(pattern)
    
    # Find equivalences (PT → EN patterns)
    equiv_pattern = r'([A-Za-záàâãéèêíïóôõöúçñ\s]+)\s*[→=]\s*([A-Za-z\s\']+)'
    for match in re.finditer(equiv_pattern, full_text):
        analysis['equivalences'].append(f"{match.group(1).strip()} → {match.group(2).strip()}")
    
    # Count examples (sentences with common structures)
    example_count = len([t for t in texts if len(t) > 20 and any(c in t for c in ['.', '?', '!'])])
    analysis['examples_count'] = example_count
    
    return analysis

def main():
    upload_dir = '/home/ubuntu/upload'
    output_dir = '/home/ubuntu/influx-assistants/content/book5'
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Find all Book 5 files
    ppsx_files = []
    for f in os.listdir(upload_dir):
        if f.startswith('B5') and (f.endswith('.ppsx') or f.endswith('.ppsm')):
            ppsx_files.append(os.path.join(upload_dir, f))
    
    ppsx_files.sort()
    
    all_lessons = []
    
    for ppsx_path in ppsx_files:
        print(f"Processing: {os.path.basename(ppsx_path)}")
        
        # Extract lesson number from filename
        match = re.search(r'B5[_L]*(\d+)', os.path.basename(ppsx_path))
        lesson_num = int(match.group(1)) if match else 0
        
        content = extract_ppsx_content(ppsx_path)
        analysis = analyze_lesson_content(content['texts'])
        
        lesson_data = {
            'lesson_number': lesson_num,
            'file': content['file'],
            'slide_count': len(content['slides']),
            'audio_files': content['audio_files'],
            'media_count': len(content['media_files']),
            'all_texts': content['texts'],
            'slides': content['slides'],
            'analysis': analysis
        }
        
        all_lessons.append(lesson_data)
        
        # Save individual lesson file
        lesson_file = os.path.join(output_dir, f'lesson_{lesson_num:02d}.json')
        with open(lesson_file, 'w', encoding='utf-8') as f:
            json.dump(lesson_data, f, ensure_ascii=False, indent=2)
        
        print(f"  - Slides: {len(content['slides'])}")
        print(f"  - Texts: {len(content['texts'])}")
        print(f"  - Audio files: {len(content['audio_files'])}")
    
    # Save summary
    summary_file = os.path.join(output_dir, 'book5_summary.json')
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump({
            'total_lessons': len(all_lessons),
            'lessons': [{
                'number': l['lesson_number'],
                'file': l['file'],
                'slides': l['slide_count'],
                'audio_count': len(l['audio_files']),
                'text_count': len(l['all_texts'])
            } for l in all_lessons]
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Processed {len(all_lessons)} lessons")
    print(f"📁 Output: {output_dir}")

if __name__ == '__main__':
    main()
