import pandas as pd
from db.database import fetch_all

def get_kpi_summary():
    rows = fetch_all("""
        SELECT o.total_price, o.order_date, p.category, p.name as product_name
        FROM orders o
        JOIN products p ON o.product_id = p.id
    """)
    
    df = pd.DataFrame(rows)
    df['order_date'] = pd.to_datetime(df['order_date'])
    df['total_price'] = df['total_price'].astype(float)
    
    summary = {
        "total_revenue": round(float(df['total_price'].sum()), 2),
        "avg_order_value": round(float(df['total_price'].mean()), 2),
        "max_order": round(float(df['total_price'].max()), 2),
        "min_order": round(float(df['total_price'].min()), 2),
        "std_deviation": round(float(df['total_price'].std()), 2),
        "top_category": df.groupby('category')['total_price'].sum().idxmax(),
        "top_product": df.groupby('product_name')['total_price'].sum().idxmax(),
    }
    
    return summary
    