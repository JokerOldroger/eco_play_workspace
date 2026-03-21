from flask import Flask, jsonify, request
from flask_cors import CORS
import db
import sensor
import algorithms
from datetime import date

# 初始化Flask应用
app = Flask(__name__)
CORS(app)  # 解决跨域（前端调用）

# 首次运行初始化数据库
try:
    db.init_db()
except Exception as e:
    print(f"数据库初始化提示: {e}")

# ========== 建筑接口 ==========
@app.route('/api/buildings', methods=['GET'])
def get_buildings():
    """获取所有建筑"""
    buildings = db.get_all_buildings()
    return jsonify(buildings)

@app.route('/api/buildings/<name>', methods=['GET'])
def get_building(name):
    """按名称获取建筑"""
    building = db.get_building_by_name(name)
    if not building:
        return jsonify({'error': 'Building not found'}), 404
    return jsonify(building)

@app.route('/api/buildings', methods=['POST'])
def add_building():
    """添加建筑"""
    data = request.json
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    db.add_building(data['name'], data.get('description', ''))
    return jsonify({'message': 'Building added successfully'}), 201

@app.route('/api/buildings/<int:id>', methods=['PUT'])
def update_building(id):
    """更新建筑"""
    data = request.json
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    db.update_building(id, data['name'], data.get('description', ''))
    return jsonify({'message': 'Building updated successfully'})

@app.route('/api/buildings/<int:id>', methods=['DELETE'])
def delete_building(id):
    """删除建筑"""
    db.delete_building(id)
    return jsonify({'message': 'Building deleted successfully'})

# ========== 投票接口 ==========
@app.route('/api/votes/<building_name>', methods=['GET'])
def get_building_votes(building_name):
    """获取指定建筑的投票数据（当日）"""
    building = db.get_building_by_name(building_name)
    if not building:
        return jsonify({'error': 'Building not found'}), 404
    
    votes = db.get_votes_by_building_date(building['id'], date.today())
    if not votes:
        return jsonify({'error': 'Votes not found'}), 404
    
    # 计算百分比
    votes['too_cold_percent'] = round((votes['too_cold'] / votes['total']) * 100, 1)
    votes['comfort_percent'] = round((votes['comfort'] / votes['total']) * 100, 1)
    votes['too_warm_percent'] = round((votes['too_warm'] / votes['total']) * 100, 1)
    
    return jsonify(votes)

@app.route('/api/votes/<building_id>', methods=['PUT'])
def update_building_votes(building_id):
    """更新投票数据"""
    data = request.json
    required_fields = ['too_cold', 'comfort', 'too_warm', 'total']
    if not all(f in data for f in required_fields):
        return jsonify({'error': 'Missing vote data'}), 400
    
    db.update_votes(
        building_id,
        data['too_cold'],
        data['comfort'],
        data['too_warm'],
        data['total'],
        data.get('vote_date', date.today())
    )
    return jsonify({'message': 'Votes updated successfully'})

# ========== 传感器接口 ==========
@app.route('/api/sensor/<building_id>', methods=['GET'])
def get_sensor_data(building_id):
    """获取指定建筑的传感器数据（实时读取）"""
    temp, humi = sensor.read_sensor_data(int(building_id))
    # 存储传感器数据到数据库
    db.add_sensor_data(int(building_id), temp, humi)
    return jsonify({
        'building_id': building_id,
        'temperature': temp,
        'humidity': humi,
        'read_time': date.today().isoformat()
    })

# ========== 算法扩展接口 ==========
@app.route('/api/algorithm/weighted-comfort/<building_name>', methods=['GET'])
def get_weighted_comfort(building_name):
    """获取加权舒适度评分（扩展算法）"""
    building = db.get_building_by_name(building_name)
    if not building:
        return jsonify({'error': 'Building not found'}), 404
    
    # 获取投票数据
    votes = db.get_votes_by_building_date(building['id'])
    if not votes:
        return jsonify({'error': 'Votes not found'}), 404
    
    # 获取最新传感器数据
    sensor_data = db.get_latest_sensor_data(building['id'])
    
    # 计算加权舒适度
    weighted_score = algorithms.calculate_weighted_comfort(votes, sensor_data)
    
    return jsonify({
        'building_name': building_name,
        'base_comfort_percent': round((votes['comfort'] / votes['total']) * 100, 1),
        'weighted_comfort_score': weighted_score,
        'sensor_data': sensor_data
    })

# ========== 前端适配接口（原页面数据） ==========
@app.route('/api/stats', methods=['GET'])
def get_stats_data():
    """适配前端StatsPage的聚合数据接口"""
    buildings = db.get_all_buildings()
    stats_data = []
    
    for b in buildings:
        votes = db.get_votes_by_building_date(b['id'])
        if votes:
            stats_data.append({
                'name': b['name'],
                'tooCold': votes['too_cold'],
                'comfort': votes['comfort'],
                'tooWarm': votes['too_warm'],
                'total': votes['total'],
                'tooColdPercent': round((votes['too_cold'] / votes['total']) * 100, 1),
                'comfortPercent': round((votes['comfort'] / votes['total']) * 100, 1),
                'tooWarmPercent': round((votes['too_warm'] / votes['total']) * 100, 1)
            })
    
    # 按舒适百分比排序
    stats_data.sort(key=lambda x: x['comfortPercent'], reverse=True)
    
    return jsonify({
        'currentBuilding': stats_data[0] if stats_data else {},
        'buildingRankings': stats_data
    })

# 启动服务（适配树莓派）
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',  # 允许局域网访问
        port=5000,       # 端口
        debug=False,     # 树莓派关闭debug（减少资源占用）
        threaded=True    # 多线程处理请求
    )