import random
try:
    # 树莓派真实传感器依赖（DHT11/DHT22）
    import Adafruit_DHT
    SENSOR_AVAILABLE = True
except ImportError:
    # 无传感器时用模拟数据
    SENSOR_AVAILABLE = False

# 传感器配置（树莓派GPIO引脚 BCM编码）
SENSOR_TYPE = Adafruit_DHT.DHT11 if SENSOR_AVAILABLE else None
SENSOR_PIN_MAP = {
    # 建筑ID: GPIO引脚
    1: 4,   # Engineering Hall A → GPIO4
    2: 17,  # Library Building → GPIO17
    3: 27,  # Academic Building → GPIO27
    4: 22,  # Business Building → GPIO22
    5: 10,  # Student Union → GPIO10
    6: 9    # Shaw Auditorium → GPIO9
}

def read_sensor_data(building_id):
    """
    读取指定建筑的传感器数据
    :param building_id: 建筑ID
    :return: (temperature: float, humidity: float)
    """
    if SENSOR_AVAILABLE and building_id in SENSOR_PIN_MAP:
        # 真实传感器读取
        pin = SENSOR_PIN_MAP[building_id]
        humidity, temperature = Adafruit_DHT.read_retry(SENSOR_TYPE, pin)
        if humidity is not None and temperature is not None:
            return round(temperature, 1), round(humidity, 1)
    
    # 模拟数据（无传感器/读取失败时）
    temp = round(random.uniform(18.0, 28.0), 1)
    humi = round(random.uniform(30.0, 70.0), 1)
    return temp, humi