"""预留算法扩展模块 - 投票权重、舒适度评分等"""

def calculate_weighted_comfort(building_votes, sensor_data=None, weights=None):
    """
    带权重的舒适度计算（可扩展）
    :param building_votes: 投票数据 dict (too_cold, comfort, too_warm, total)
    :param sensor_data: 传感器数据 dict (temperature, humidity)
    :param weights: 权重配置 dict (too_cold: float, comfort: float, too_warm: float, temp_factor: float)
    :return: 加权舒适度评分 float
    """
    # 默认权重
    default_weights = {
        'too_cold': -0.5,    # 过冷权重（负分）
        'comfort': 1.0,      # 舒适权重（正分）
        'too_warm': -0.3,    # 过热权重（负分）
        'temp_factor': 0.1   # 温度影响因子（可关联传感器）
    }
    w = weights or default_weights

    if building_votes['total'] <= 0:
        return 0.0
    
    # 基础评分（基于投票）
    base_score = (
        building_votes['too_cold'] * w['too_cold'] +
        building_votes['comfort'] * w['comfort'] +
        building_votes['too_warm'] * w['too_warm']
    ) / building_votes['total'] * 100
    
    # 传感器温度修正（可选扩展）
    if sensor_data:
        # 假设22-26℃是最佳温度，偏离则扣分
        ideal_temp = 24
        temp_diff = abs(sensor_data['temperature'] - ideal_temp)
        temp_penalty = temp_diff * w['temp_factor']
        base_score -= temp_penalty
    
    return round(base_score, 2)
