import pandas as pd
import requests
import json
import os
import sys

# Constants
SUPABASE_URL = "https://cebrykkjirpxkbcxhmuo.supabase.co"
SUPABASE_KEY = "sb_publishable_Gls5Tb0FIiz5WeV5tL2_Bw_GQyjDgVP"
FILE_PATH = r'c:\Users\brand\Downloads\Tornillosam\Lista_S_02Oct_2024 (1) - copia.xls'

# Mappings for categories
CAT_MAPPING = {
    "TOR": "Tornillería",
    "TORNILLO": "Tornillería",
    "PIJA": "Pijas",
    "PERNO": "Pernos",
    "TCA": "Tuercas",
    "TUERCA": "Tuercas",
    "OPRES": "Opresores",
    "OPR": "Opresores",
    "RONDANA": "Rondanas",
    "ROND": "Rondanas",
    "VARILLA": "Varillas",
    "BROCA": "Herramientas",
    "DADO": "Herramientas",
    "LLAVE": "Herramientas",
    "GRAPA": "Automotriz",
    "Grapa": "Automotriz",
    "Sensor": "Automotriz"
}

def get_category_id(name, category_cache):
    if name in category_cache:
        return category_cache[name]
    
    # Create category if not exists
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    resp = requests.post(f"{SUPABASE_URL}/rest/v1/categories", 
                         json={"name": name}, 
                         headers=headers)
    
    if resp.status_code in [201, 200, 409]: # 409 if exists but we want ID
        # Fetch it to be sure
        resp = requests.get(f"{SUPABASE_URL}/rest/v1/categories?name=eq.{name}", headers=headers)
        data = resp.json()
        if data:
            category_cache[name] = data[0]['id']
            return data[0]['id']
            
    return None

def import_data():
    try:
        print("Reading Excel...")
        df = pd.read_excel(FILE_PATH)
        print(f"Total products to process: {len(df)}")
        
        # Clean data
        df = df.dropna(subset=['CLAVE', 'NOMBRE', '$ LISTA'])
        
        category_cache = {}
        batch = []
        batch_size = 500
        count = 0
        
        for index, row in df.iterrows():
            name = str(row['NOMBRE'])
            first_word = name.split()[0] if name.split() else "OTROS"
            cat_name = CAT_MAPPING.get(first_word, "Otros")
            
            cat_id = get_category_id(cat_name, category_cache)
            
            # Apply 50% discount as requested
            raw_price = float(row['$ LISTA'])
            final_price = raw_price / 2.0
            
            product = {
                "sku": str(row['CLAVE']),
                "name": name,
                "category_id": cat_id,
                "price": final_price,
                "material": "Acero", # Default or extract from string
                "grade": "Standard",
                "finish": "Zincado",
                "currency": "MXN"
            }
            
            batch.append(product)
            
            if len(batch) >= batch_size:
                count += upload_batch(batch)
                batch = []
                print(f"Imported {count} products...")
                
        if batch:
            count += upload_batch(batch)
            
        print(f"Finish! Total imported: {count}")
        
    except Exception as e:
        print(f"Error: {e}")

def upload_batch(batch):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        # Use upsert based on SKU
        resp = requests.post(f"{SUPABASE_URL}/rest/v1/products", 
                             json=batch, 
                             headers=headers,
                             params={"on_conflict": "sku"})
        
        if resp.status_code not in [201, 200]:
            print(f"Batch upload error: {resp.text}")
            return 0
        return len(batch)
    except Exception as e:
        print(f"Error uploading batch: {e}")
        return 0

if __name__ == "__main__":
    import_data()
