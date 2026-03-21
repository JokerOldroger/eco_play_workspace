-- 建筑表
CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 投票表
CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER NOT NULL,
    too_cold INTEGER DEFAULT 0,
    comfort INTEGER DEFAULT 0,
    too_warm INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    vote_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

-- 传感器数据表
CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER NOT NULL,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    read_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);