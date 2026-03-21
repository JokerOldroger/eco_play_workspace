// 统一封装后端接口，便于切换环境（本地/树莓派）
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// 类型导入（与types/index.ts关联）
import type { BuildingStats, SensorData, WeightedComfort } from '../types';

// 统计数据接口
export const fetchStats = async (): Promise<{
  currentBuilding: BuildingStats;
  buildingRankings: BuildingStats[];
}> => {
  const res = await fetch(`${BASE_URL}/api/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

// 传感器数据接口
export const fetchSensorData = async (buildingId: number): Promise<SensorData> => {
  const res = await fetch(`${BASE_URL}/api/sensor/${buildingId}`);
  if (!res.ok) throw new Error('Failed to fetch sensor data');
  return res.json();
};

// 加权舒适度算法接口
export const fetchWeightedComfort = async (buildingName: string): Promise<WeightedComfort> => {
  const res = await fetch(`${BASE_URL}/api/algorithm/weighted-comfort/${buildingName}`);
  if (!res.ok) throw new Error('Failed to fetch weighted comfort');
  return res.json();
};