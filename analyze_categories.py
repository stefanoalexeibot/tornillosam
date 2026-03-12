import pandas as pd
import json
import os

file_path = r'c:\Users\brand\Downloads\Tornillosam\Lista_S_02Oct_2024 (1) - copia.xls'

def analyze_names():
    try:
        # Load enough rows to see diversity
        df = pd.read_excel(file_path, usecols=["NOMBRE"])
        
        # Extract first word as category hint
        df['cat_hint'] = df['NOMBRE'].str.split().str[0]
        
        counts = df['cat_hint'].value_counts().head(20).to_dict()
        
        with open('category_analysis.json', 'w', encoding='utf-8') as f:
            json.dump(counts, f, indent=2, ensure_ascii=False)
            
        print("Category analysis saved.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_names()
