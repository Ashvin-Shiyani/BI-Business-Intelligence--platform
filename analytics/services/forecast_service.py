import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from db.database import fetch_all

def forecast_revenue():
    rows = fetch_all("""
        SELECT 
            TO_CHAR(order_date, 'YYYY-MM') as month,
            SUM(total_price) as revenue
        FROM orders
        GROUP BY month
        ORDER BY month ASC
    """)

    df = pd.DataFrame(rows)
    df['revenue'] = df['revenue'].astype(float)
    df['month_index'] = range(len(df))

    X = df[['month_index']]
    y = df['revenue']

    model = LinearRegression()
    model.fit(X, y)

    future_indices = range(len(df), len(df) + 3)
    future_months = pd.date_range(
        start=pd.to_datetime(df['month'].iloc[-1]) + pd.DateOffset(months=1),
        periods=3,
        freq='MS'
    ).strftime('%Y-%m').tolist()

    predictions = model.predict([[i] for i in future_indices])

    forecast = [
        {"month": month, "predicted_revenue": round(float(pred), 2)}
        for month, pred in zip(future_months, predictions)
    ]

    historical = df[['month', 'revenue']].copy()
    historical['revenue'] = historical['revenue'].round(2)

    return {
        "historical": historical.to_dict(orient='records'),
        "forecast": forecast,
        "trend": "up" if model.coef_[0] > 0 else "down"
    }