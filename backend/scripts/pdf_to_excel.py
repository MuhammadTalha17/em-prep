"""
PDF Question Bank to Excel Converter
Extracts questions, options, images, and explanations from structured PDFs
"""

import pdfplumber
import openpyxl
from pathlib import Path
import re
from typing import Dict, List, Optional
from openpyxl.worksheet.datavalidation import DataValidation

def extract_pages(pdf_path: str) -> List[pdfplumber.page.Page]:
    """
    Extract all pages from pdf
    Returns list of page objects
    """
    try:
        pdf = pdfplumber.open(pdf_path)
        pages = pdf.pages
        print(f"Loaded PDF:{len(pages)}pages found")
        return pages
    except Exception as e:
        print(f"Error loading PDF: {e}")
        return []


def extract_question(page_text: str) -> str:
    """
    Extract question text from page
    Question is the first text block before options
    """
    lines = page_text.strip().split('\n')
    question_lines = []

    for line in lines:
        line = line.strip()
        # Stop when we hit options (A., a., A), a) etc.)
        if re.match(r'^[A-Ea-e][\.\)]', line):
            break
        # Skip empty lines and header/footer
        if line and len(line) > 3:
            question_lines.append(line)

    #Join and clean
    question = ' '.join(question_lines)
    return question.strip()

def extract_options(page_text: str) -> Dict[str, str]:
    """
    Extract multiple choice options from page
    Handles formats: A., a., A), a)
    """
    options = {}
    lines = page_text.strip().split('\n')
    
    for line in lines:
        line = line.strip()
        # Match A., a., A), a) at start of line
        match = re.match(r'^([A-Ea-e])[\.\)]\s*(.+)', line)
        if match:
            letter = match.group(1).upper()  # Convert to uppercase
            text = match.group(2).strip()
            options[letter] = text
    
    return options

def extract_and_save_images(pdf_path: str, page_num: int, output_dir: str = "extracted_images") -> Optional[str]:
    """
    Extract and save images from PDF page using PyMuPDF
    """
    import fitz  # PyMuPDF
    from pathlib import Path
    import os
    
    # Make output_dir absolute relative to script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    abs_output_dir = os.path.join(script_dir, output_dir)
    Path(abs_output_dir).mkdir(exist_ok=True)
    
    try:
        doc = fitz.open(pdf_path)
        page = doc[page_num]
        image_list = page.get_images()
        
        if image_list:
            # Get first image
            xref = image_list[0][0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            
            # Save image with absolute path
            img_filename = f"page_{page_num}.png"
            img_path = os.path.join(abs_output_dir, img_filename)
            with open(img_path, "wb") as img_file:
                img_file.write(image_bytes)
            
            doc.close()
            # Return relative path for JSON (backend will construct absolute path)
            return f"{output_dir}/{img_filename}"
    except Exception as e:
        print(f"Warning: Could not extract image from page {page_num}: {e}")
    
    return None

def extract_explanation(page_text: str) -> str:
    """
    Extract explanation text from page
    Explanation usually appears after the repeated question section
    """
    lines = page_text.strip().split('\n')
    explanation_lines = []
    found_second_question = False
    
    # Look for repeated question (after options)
    option_count = 0
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Count options to find where they end
        if re.match(r'^[A-E]\.', line):
            option_count += 1
        
        # After we've seen options twice (8 or 10 lines), start collecting explanation
        if option_count >= 8:  # 4 options × 2 = 8 (or 5 × 2 = 10)
            found_second_question = True
        
        # Collect text after second set of options
        if found_second_question and line and len(line) > 3:
            # Skip option lines
            if not re.match(r'^[A-E]\.', line):
                explanation_lines.append(line)
    
    explanation = ' '.join(explanation_lines)
    return explanation.strip()


def detect_page_type(page) -> str:
    """
    Detect what type of page this is:
    - 'question': Has question + options (A-E)
    - 'image': Mostly image, little text
    - 'answer': Short text with answer (e.g., "C. Emergency thoracotomy")
    - 'explanation': Text after answer page
    """
    text = page.extract_text()
    
    # Count text length
    text_length = len(text.strip())
    
    # Count options (full option list A-E or a-e)
    option_matches = re.findall(r'^[A-Ea-e][\.\)]', text, re.MULTILINE)
    option_count = len(option_matches)
    
    # Check if text starts with a single option (answer page pattern)
    lines = text.strip().split('\n')
    first_line = lines[0].strip() if lines else ""
    is_single_answer = re.match(r'^[A-Ea-e][\.\)]', first_line) and option_count == 1
    
    # Check for category key at bottom (2 uppercase letters)
    has_category_key = False
    for line in reversed(lines[-3:]):  # Check last 3 lines
        if re.match(r'^[A-Z]{2}$', line.strip()):
            has_category_key = True
            break
    
    # Check for images
    has_images = len(page.images) > 0
    
    # Decision logic
    if is_single_answer:
        # Short text starting with single option = answer page
        return 'answer'
    elif has_category_key and option_count >= 4:
        # Has category key and multiple options = question page
        return 'question'
    elif option_count >= 4 and text_length > 100:
        # Has multiple options and substantial text = question page
        return 'question'
    elif has_images and text_length < 50:
        # Mostly image, little text
        return 'image'
    elif text_length > 50:
        # Text without options
        return 'explanation'
    else:
        return 'unknown'

def group_question_pages(pages) -> List[Dict]:
    """
    Group pages into complete questions
    Returns list of dicts with page indices for each question component
    """
    questions = []
    i = 0
    
    while i < len(pages):
        page_type = detect_page_type(pages[i])
        
        # Skip intro/cover pages
        if page_type == 'image' and i < 3:
            i += 1
            continue
        
        # Start of a question
        if page_type == 'question':
            question_group = {
                'question_page': i,
                'image_page': None,
                'answer_page': None,
                'explanation_page': None
            }
            
            i += 1
            
            # Check next pages
            while i < len(pages):
                next_type = detect_page_type(pages[i])
                
                # Image BEFORE answer page = question image
                if next_type == 'image' and question_group['answer_page'] is None:
                    question_group['image_page'] = i
                    i += 1
                # Answer page (short text with single option)
                elif next_type == 'answer' and question_group['answer_page'] is None:
                    question_group['answer_page'] = i
                    i += 1
                # Text/Image AFTER answer page = explanation
                elif (next_type == 'explanation' or next_type == 'image') and question_group['answer_page'] is not None:
                    question_group['explanation_page'] = i
                    i += 1
                    break  # End of this question
                else:
                    break  # Start of next question
            
            questions.append(question_group)  # ← Move this OUTSIDE the inner while loop
        else:
            i += 1
    
    return questions

def extract_complete_question(pdf_path: str, pages, group: Dict) -> Dict:
    """
    Extract all data for a complete question
    """
    question_data = {
        'Question': '',
        'OptionA': '',
        'OptionB': '',
        'OptionC': '',
        'OptionD': '',
        'OptionE': '',
        'CorrectAnswer': '',
        'Category': '',
        'Explanation': '',
        'QuestionImage': 'null',
        'ExplanationImage': 'null',
    }
    
    # Extract question and options
    page_text = pages[group['question_page']].extract_text()
    question_data['Question'] = extract_question(page_text)
    options = extract_options(page_text)
    
    question_data['OptionA'] = options.get('A', '')
    question_data['OptionB'] = options.get('B', '')
    question_data['OptionC'] = options.get('C', '')
    question_data['OptionD'] = options.get('D', '')
    question_data['OptionE'] = options.get('E', '')
    
    # Extract category from question page (category key is at bottom)
    category_key = extract_category_key(page_text)
    category_name = map_category(category_key)
    question_data['Category'] = category_name
    
    # Extract explanation if exists
    if group['explanation_page'] is not None:
        exp_text = pages[group['explanation_page']].extract_text()
        question_data['Explanation'] = exp_text.strip()

    # Extract images if they exist
    if group['image_page'] is not None:
        img_path = extract_and_save_images(pdf_path, group['image_page'])
        question_data['QuestionImage'] = img_path or 'null'
    
    if group['explanation_page'] is not None:
        exp_page = pages[group['explanation_page']]
        if len(exp_page.images) > 0:
            img_path = extract_and_save_images(pdf_path, group['explanation_page'])
            question_data['ExplanationImage'] = img_path or 'null'

    
    
    # Extract correct answer from answer page
    if group['answer_page'] is not None:
        answer_page_text = pages[group['answer_page']].extract_text()
        
        # Extract correct answer letter (A/B/C/D/E)
        correct_answer_letter = extract_correct_answer_letter(answer_page_text, options)
        question_data['CorrectAnswer'] = correct_answer_letter
    
    return question_data

# def generate_excel(question_data: List[Dict], output_file: str = "questions_output.xlsx"):
#     """
#     Generate Excel file from extracted questions
#     """
#     wb = openpyxl.Workbook()
#     ws = wb.active
#     ws.title = "Questions"

#     # Headers
#     headers = ["Question", "OptionA", "OptionB", "OptionC", "OptionD", "OptionE", 
#                "CorrectAnswer", "Category", "Explanation", "QuestionImage", "ExplanationImage", 
#                "ImageCheck"]
#     ws.append(headers)

#     # Add questions with hyperlinks
#     for idx, q in enumerate(question_data, start=2):  # Start at row 2 (after header)
#         row = [
#             q['Question'],
#             q['OptionA'],
#             q['OptionB'],
#             q['OptionC'],
#             q['OptionD'],
#             q['OptionE'],
#             q['CorrectAnswer'],
#             q['Category'],
#             q['Explanation'],
#             q['QuestionImage'],
#             q['ExplanationImage'],
#             f"Q:{q['QuestionImage'] != 'null'} | E:{q['ExplanationImage'] != 'null'}"
#         ]
#         ws.append(row)
#     
#     categories_sheet = wb.create_sheet("Categories")
#     categories = [
#         "Cardiology",
#         "MajorTrauma", 
#         "MinorTrauma", 
#         "Pediatrics", 
#         "Toxicology",
#         "Resuscitation", 
#         "Eye", 
#         "ENT", 
#         "ObstetricAndGynaecology", 
#         "PainAndSedation",
#         "Nephrology", 
#         "Neurology", 
#         "Gastroenterology", 
#         "EnvironmentalEmergencies",
#         "ElderlyCare", 
#         "Dermatology", 
#         "Allergy", 
#         "OncologicalEmergencies",
#         "Musculoskeletal", 
#         "Respiratory", 
#         "SurgicalEmergencies", 
#         "Urology",
#         "Vascular", 
#         "Endocrinology", 
#         "Haemotology", 
#         "InfectiousDiseases",
#         "ProceduralSkills", 
#         "ComplexOrChallengingSituations"
#     ]
#     for cat in categories:
#         categories_sheet.append([cat])
#     
#     # Add dropdown validation to Category column (Column H)
#     dv = DataValidation(type="list", formula1="=Categories!$A$1:$A$28", allow_blank=True)
#     dv.add(f"H2:H{len(question_data) + 1}")  # H is Category column
#     ws.add_data_validation(dv)

#     wb.save(output_file)
#     print(f"✓ Excel file saved: {output_file}")

def generate_json(questions_data: List[Dict], output_file: str = "questions_output.json"):
    """
    Generate JSON file from extracted questions
    Format for direct database import
    """
    import json
    
    formatted_questions = []
    
    for q in questions_data:
        # Format choices as simple dict
        choices = {
            "A": q['OptionA'],
            "B": q['OptionB'],
            "C": q['OptionC'],
            "D": q['OptionD'],
            "E": q['OptionE']
        }
        
        # Remove empty options
        choices = {k: v for k, v in choices.items() if v}
        
        formatted_q = {
            "question_text": q['Question'],
            # "question_type": "radiogroup",
            "choices": choices,
            "correct_answer": q['CorrectAnswer'],
            "category": q['Category'],
            "explanation": q['Explanation'],
            "image_url": q['QuestionImage'] if q['QuestionImage'] != 'null' else None,
            "explanation_image_url": q['ExplanationImage'] if q['ExplanationImage'] != 'null' else None
        }
        
        formatted_questions.append(formatted_q)
    
    # Write to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(formatted_questions, f, indent=2, ensure_ascii=False)
    
    print(f"JSON file saved: {output_file}")
    print(f"Total questions: {len(formatted_questions)}")

# def extract_correct_answer(page) -> str:
#     """
#     Try to extract correct answer from answer page
#     Looks for text in red color or uses heuristics
#     """
#     try:
#         # Get all text with positions
#         words = page.extract_words()
#         
#         # Try to find red text (this is PDF-dependent)
#         # Most PDFs don't expose color info easily in pdfplumber
#         # Fallback: extract all options and compare with question page
        
#         text = page.extract_text()
#         options = extract_options(text)
        
#         # Simple heuristic: if only one option appears differently, it might be the answer
#         # This is unreliable, so we'll just return empty for now
#         return ""
#         
#     except Exception as e:
#         print(f"Warning: Could not extract correct answer: {e}")
#         return ""

# def extract_correct_answer_letter(page_text: str, options: Dict[str, str]) -> str:
#     """
#     Extract correct answer LETTER from answer page
#     Answer page shows only the correct answer text
#     Match it against options to find which letter (A/B/C/D/E)
#     """
#     lines = page_text.strip().split('\n')
#     
#     # Get text before category key (category is at bottom)
#     answer_text = []
#     for line in lines:
#         line = line.strip()
#         # Stop if we hit a category key pattern (2 letters)
#         if re.match(r'^[A-Z][a-z]$', line) or re.match(r'^[A-Z]{2}$', line):
#             break
#         if line and len(line) > 2:
#             answer_text.append(line)
#     
#     answer = ' '.join(answer_text).strip()
#     
#     # Match against options to find which letter
#     for letter, option_text in options.items():
#         # Check if answer contains the option text or vice versa
#         if option_text.lower() in answer.lower() or answer.lower() in option_text.lower():
#             return letter  # Return just the letter (A, B, C, D, or E)
#     
#     # If no match, try to extract letter from start of answer (e.g., "C. Emergency thoracotomy")
#     first_line = lines[0].strip() if lines else ""
#     match = re.match(r'^([A-Ea-e])[\.\)]', first_line)
#     if match:
#         return match.group(1).upper()
    
#     return ""  # No match found

def extract_correct_answer_letter(page_text: str, options: Dict[str, str]) -> str:
    """
    Extract correct answer LETTER from answer page
    Answer page shows only the correct answer text
    Match it against options to find which letter (A/B/C/D/E)
    """
    lines = page_text.strip().split('\n')
    first_line = lines[0].strip() if lines else ""
    
    # First, try to extract letter directly from start (e.g., "C. Emergency thoracotomy")
    match = re.match(r'^([A-Ea-e])[\.\)]\s*', first_line)
    if match:
        return match.group(1).upper()
    
    # Fallback: Get text before category key and match against options
    answer_text = []
    for line in lines:
        line = line.strip()
        if re.match(r'^[A-Z][a-z]$', line) or re.match(r'^[A-Z]{2}$', line):
            break
        if line and len(line) > 2:
            answer_text.append(line)
    
    answer = ' '.join(answer_text).strip()
    
    # Match against options to find which letter
    for letter, option_text in options.items():
        if option_text.lower() in answer.lower() or answer.lower() in option_text.lower():
            return letter
    
    return ""  # No match found

def extract_category_key(page_text: str) -> str:
    """
    Extract 2-letter category key from bottom of answer page
    Returns key like "Ca", "Ma", "RE", "EN", etc.
    """
    lines = page_text.strip().split('\n')
    
    # Category key is at the bottom, look from end
    for line in reversed(lines):
        line = line.strip()
        # Match 2 letters (mixed case, e.g., Ma, Ga, Ca)
        if re.match(r'^[A-Z][a-z]$', line) or re.match(r'^[A-Z]{2}$', line):
            return line
    
    return ""  # No category key found

CATEGORY_MAP = {
    "ca": "Cardiology",
    "ma": "MajorTrauma",
    "mi": "MinorTrauma",
    "pe": "Pediatrics",
    "to": "Toxicology",
    "re": "Resuscitation",
    "ey": "Eye",
    "et": "ENT",
    "og": "ObstetricAndGynaecology",
    "ps": "PainAndSedation",
    "ne": "Nephrology",
    "nu": "Neurology",
    "ga": "Gastroenterology",
    "ee": "EnvironmentalEmergencies",
    "el": "ElderlyCare",
    "de": "Dermatology",
    "al": "Allergy",
    "on": "OncologicalEmergencies",
    "mu": "Musculoskeletal",
    "rr": "Respiratory",
    "su": "SurgicalEmergencies",
    "ur": "Urology",
    "va": "Vascular",
    "en": "Endocrinology",
    "ha": "Haematology",
    "in": "InfectiousDiseases",
    "pr": "ProceduralSkills",
    "cc": "ComplexOrChallengingSituations"
}


def map_category(key: str) -> str:
    """Map category key to full category name (case-insensitive)"""
    if not key:
        return ""
    # Convert to lowercase for case-insensitive lookup
    return CATEGORY_MAP.get(key.lower(), "")

# Update test
if __name__ == '__main__':
    import sys
    
    # Accept PDF path from command line argument
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else "sample_questions.pdf"
    
    pages = extract_pages(pdf_path)
        
    if pages:
        question_groups = group_question_pages(pages)

        # Test page type detection on first 10 pages
        # print("=== PAGE TYPE DETECTION ===")
        # for i in range(min(10, len(pages))):
        #     page_type = detect_page_type(pages[i])
        #     text_preview = pages[i].extract_text()[:50].replace('\n', ' ')
        #     print(f"Page {i+1}: {page_type:12} | {text_preview}...")

        print("\n=== ALL PAGE TYPES ===")
        for i in range(len(pages)):
            page_type = detect_page_type(pages[i])
            text_preview = pages[i].extract_text()[:50].replace('\n', ' ')
            print(f"Page {i+1}: {page_type:12} | {text_preview}...")
        
        # Extract all questions
        all_questions = []
        for idx, group in enumerate(question_groups):
            q_data = extract_complete_question(pdf_path, pages, group)
            all_questions.append(q_data)
        
        print(f"Extracted {len(all_questions)} questions")

        # Debug question 8
        if len(all_questions) >= 8:
            q8 = all_questions[7]  # 0-indexed
            print(f"\n=== DEBUG QUESTION 8 ===")
            print(f"Correct Answer: '{q8['CorrectAnswer']}'")
            
            # Find the answer page for Q8
            group = question_groups[7]
            print(f"Answer page: {group['answer_page']}")
            if group['answer_page'] is not None:
                answer_text = pages[group['answer_page']].extract_text()
                print(f"Answer page text:\n{answer_text}")
        
        # Generate JSON (for backend import)
        generate_json(all_questions)