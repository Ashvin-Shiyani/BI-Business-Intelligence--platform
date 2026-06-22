import psycopg2
import psycopg2.extras

def get_connection():
    return psycopg2.connect(
        dbname="bi_platform",
        host="localhost",
        port="5432"
    )

def fetch_all(query, params=None):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows