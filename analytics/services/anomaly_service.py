import pandas as pd
import numpy as np
from db.database import fetch_all

def detect_anomalies():
    rows = fetch_all("""
        SELECT order_date::date as date, SUM(total_price) as daily_revenue
        FROM orders
        GROUP BY order_date::date
        ORDER BY date ASC
    """)

    df = pd.DataFrame(rows)
    df['daily_revenue'] = df['daily_revenue'].astype(float)

    mean = df['daily_revenue'].mean()
    std = df['daily_revenue'].std()

    df['z_score'] = (df['daily_revenue'] - mean) / std
    df['is_anomaly'] = df['z_score'].abs() > 2

    anomalies = df[df['is_anomaly'] == True].copy()
    anomalies['date'] = anomalies['date'].astype(str)

    return {
        "mean_daily_revenue": round(mean, 2),
        "std_deviation": round(std, 2),
        "anomalies": anomalies[['date', 'daily_revenue', 'z_score']].to_dict(orient='records')
    }