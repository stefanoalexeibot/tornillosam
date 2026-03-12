import pandas as pd
import json
import os
from datetime import datetime

file_path = r'c:\Users\brand\Downloads\Tornillosam\Lista_S_02Oct_2024 (1) - copia.xls'

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, (datetime, pd.Timestamp)):
        return obj.isoformat()
    return str(obj)

def get_excel_info():
    try:
        # Load only first 10 rows to get the structure
        df = pd.read_excel(file_path, nrows=10)
        
        # Fill NaN with None for JSON
        df = df.where(pd.notnull(df), None)
        
        info = {
            "columns": df.columns.tolist(),
            "sample_data": df.head(5).to_dict(orient='records'),
            "total_estimate": "Large file (12MB), likely > 10,000 items"
        }
        
        # Use custom serializer
        with open('excel_analysis.json', 'w', encoding='utf-8') as f:
            json.dump(info, f, indent=2, ensure_ascii=False, default=json_serial)
            
        print("Analysis saved to excel_analysis.json")
        print("Columns found:", df.columns.tolist())
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_excel_info()
