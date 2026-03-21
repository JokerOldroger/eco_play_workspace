import sqlite3
import os
from datetime import date

# 数据库文件路径（树莓派本地）
DB_PATH = os.path.join(os.path.dirname(__file__), 'eco_play.db')

def get_db_connection():
    """创建数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 支持按列名访问
    return conn

def init_db():
    """初始化数据库（首次运行）"""
    conn = get_db_connection()
    with open('schema.sql', 'r') as f:
        conn.executescript(f.read())
    
    # 初始化默认建筑数据
    default_buildings = [
        ('Engineering Hall A',),
        ('Library Building',),
        ('Academic Building',),
        ('Business Building',),
        ('Student Union',),
        ('Shaw Auditorium',)
    ]
    conn.executemany('INSERT OR IGNORE INTO buildings (name) VALUES (?)', default_buildings)
    
    # 初始化默认投票数据
    default_votes = [
        (1, 89, 245, 67, 401, date.today()),
        (2, 67, 312, 89, 468, date.today()),
        (3, 121, 198, 95, 414, date.today()),
        (4, 145, 156, 78, 379, date.today()),
        (5, 98, 187, 71, 356, date.today()),
        (6, 88, 142, 54, 284, date.today())
    ]
    conn.executemany('INSERT OR IGNORE INTO votes (building_id, too_cold, comfort, too_warm, total, vote_date) VALUES (?, ?, ?, ?, ?, ?)', default_votes)
    
    conn.commit()
    conn.close()

# ========== 建筑CRUD ==========
def get_all_buildings():
    """获取所有建筑"""
    conn = get_db_connection()
    buildings = conn.execute('SELECT * FROM buildings').fetchall()
    conn.close()
    return [dict(b) for b in buildings]

def get_building_by_name(name):
    """按名称获取建筑"""
    conn = get_db_connection()
    building = conn.execute('SELECT * FROM buildings WHERE name = ?', (name,)).fetchone()
    conn.close()
    return dict(building) if building else None

def add_building(name, description=''):
    """添加建筑"""
    conn = get_db_connection()
    conn.execute('INSERT INTO buildings (name, description) VALUES (?, ?)', (name, description))
    conn.commit()
    conn.close()

def update_building(id, name, description=''):
    """更新建筑"""
    conn = get_db_connection()
    conn.execute('UPDATE buildings SET name = ?, description = ? WHERE id = ?', (name, description, id))
    conn.commit()
    conn.close()

def delete_building(id):
    """删除建筑（级联删除投票/传感器数据）"""
    conn = get_db_connection()
    conn.execute('DELETE FROM votes WHERE building_id = ?', (id,))
    conn.execute('DELETE FROM sensor_data WHERE building_id = ?', (id,))
    conn.execute('DELETE FROM buildings WHERE id = ?', (id,))
    conn.commit()
    conn.close()

# ========== 投票CRUD ==========
def get_votes_by_building_date(building_id, vote_date=date.today()):
    """按建筑+日期获取投票数据"""
    conn = get_db_connection()
    votes = conn.execute('SELECT * FROM votes WHERE building_id = ? AND vote_date = ?', (building_id, vote_date)).fetchone()
    conn.close()
    return dict(votes) if votes else None

def update_votes(building_id, too_cold, comfort, too_warm, total, vote_date=date.today()):
    """更新投票数据"""
    conn = get_db_connection()
    conn.execute('''
        UPDATE votes 
        SET too_cold = ?, comfort = ?, too_warm = ?, total = ? 
        WHERE building_id = ? AND vote_date = ?
    ''', (too_cold, comfort, too_warm, total, building_id, vote_date))
    conn.commit()
    conn.close()

def add_votes(building_id, too_cold=0, comfort=0, too_warm=0, total=0, vote_date=date.today()):
    """新增投票数据"""
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO votes (building_id, too_cold, comfort, too_warm, total, vote_date)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (building_id, too_cold, comfort, too_warm, total, vote_date))
    conn.commit()
    conn.close()

# ========== 传感器数据CRUD ==========
def add_sensor_data(building_id, temperature, humidity):
    """添加传感器数据"""
    conn = get_db_connection()
    conn.execute('INSERT INTO sensor_data (building_id, temperature, humidity) VALUES (?, ?, ?)', (building_id, temperature, humidity))
    conn.commit()
    conn.close()

def get_latest_sensor_data(building_id):
    """获取建筑最新传感器数据"""
    conn = get_db_connection()
    data = conn.execute('''
        SELECT * FROM sensor_data 
        WHERE building_id = ? 
        ORDER BY read_time DESC LIMIT 1
    ''', (building_id,)).fetchone()
    conn.close()
    return dict(data) if data else None