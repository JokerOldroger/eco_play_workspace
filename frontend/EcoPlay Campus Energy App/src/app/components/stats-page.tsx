import { Thermometer } from 'lucide-react';

const buildingData = [
  { name: 'Engineering Hall A', tooCold: 89, comfort: 245, tooWarm: 67, total: 401 },
  { name: 'Library Building', tooCold: 67, comfort: 312, tooWarm: 89, total: 468 },
  { name: 'Academic Building', tooCold: 121, comfort: 198, tooWarm: 95, total: 414 },
  { name: 'Business Building', tooCold: 145, comfort: 156, tooWarm: 78, total: 379 },
  { name: 'Student Union', tooCold: 98, comfort: 187, tooWarm: 71, total: 356 },
  { name: 'Shaw Auditorium', tooCold: 88, comfort: 142, tooWarm: 54, total: 284 },
];

export function StatsPage() {
  const currentBuilding = buildingData[0];
  const tooColdPercent = Math.round((currentBuilding.tooCold / currentBuilding.total) * 100);
  const comfortPercent = Math.round((currentBuilding.comfort / currentBuilding.total) * 100);
  const tooWarmPercent = Math.round((currentBuilding.tooWarm / currentBuilding.total) * 100);

  return (
    <div className="flex h-full bg-white">
      {/* Left Panel - Current Vote Status */}
      <div className="w-1/2 flex flex-col border-r border-gray-200">
        <div className="bg-green-600 text-white py-5 text-center">
          <h2 className="text-xl font-bold">Current Vote Status</h2>
          <p className="text-sm opacity-90 mt-1">Engineering Hall A</p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gradient-to-b from-green-50 to-white">
          <div className="w-full max-w-sm space-y-4">
            {/* Too Cold */}
            <div className="bg-blue-400 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">❄️</span>
                  <span className="text-xl font-bold">Too Cold</span>
                </div>
                <div className="text-4xl font-bold">{currentBuilding.tooCold}</div>
              </div>
              <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tooColdPercent}%` }}
                ></div>
              </div>
              <div className="text-right mt-1 text-sm">{tooColdPercent}%</div>
            </div>

            {/* Comfort */}
            <div className="bg-green-500 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">☀️</span>
                  <span className="text-xl font-bold">Comfort</span>
                </div>
                <div className="text-4xl font-bold">{currentBuilding.comfort}</div>
              </div>
              <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${comfortPercent}%` }}
                ></div>
              </div>
              <div className="text-right mt-1 text-sm">{comfortPercent}%</div>
            </div>

            {/* Too Warm */}
            <div className="bg-orange-500 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🔥</span>
                  <span className="text-xl font-bold">Too Warm</span>
                </div>
                <div className="text-4xl font-bold">{currentBuilding.tooWarm}</div>
              </div>
              <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tooWarmPercent}%` }}
                ></div>
              </div>
              <div className="text-right mt-1 text-sm">{tooWarmPercent}%</div>
            </div>

            {/* Total */}
            <div className="text-center pt-3 border-t-2 border-gray-200">
              <div className="text-gray-600 text-base">Total Votes Today</div>
              <div className="text-4xl font-bold text-gray-800 mt-1">{currentBuilding.total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Building Vote Rankings */}
      <div className="w-1/2 flex flex-col">
        <div className="bg-blue-600 text-white py-5 text-center">
          <h2 className="text-xl font-bold">Campus Vote Rankings</h2>
          <p className="text-sm opacity-90 mt-1">Comfort Level by Building</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-blue-50 to-white">
          <div className="space-y-3">
            {buildingData
              .sort((a, b) => (b.comfort / b.total) - (a.comfort / a.total))
              .map((building, index) => {
                const buildingTooColdPercent = Math.round((building.tooCold / building.total) * 100);
                const buildingComfortPercent = Math.round((building.comfort / building.total) * 100);
                const buildingTooWarmPercent = Math.round((building.tooWarm / building.total) * 100);
                
                return (
                  <div
                    key={building.name}
                    className={`bg-white rounded-lg p-4 shadow-md border-2 ${
                      building.name === 'Engineering Hall A'
                        ? 'border-green-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                            index === 0
                              ? 'bg-yellow-400'
                              : index === 1
                              ? 'bg-gray-400'
                              : index === 2
                              ? 'bg-orange-400'
                              : 'bg-gray-300'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{building.name}</div>
                          <div className="text-xs text-gray-500">{building.total} total votes</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">{buildingComfortPercent}%</div>
                        <div className="text-xs text-gray-500">comfort</div>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs mb-2">
                      <div className="flex items-center gap-1 text-blue-500">
                        <span>❄️</span>
                        <span className="font-medium">{building.tooCold}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <span>☀️</span>
                        <span className="font-medium">{building.comfort}</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600">
                        <span>🔥</span>
                        <span className="font-medium">{building.tooWarm}</span>
                      </div>
                    </div>

                    {/* Stacked Bar Chart */}
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-400 transition-all duration-500"
                        style={{ width: `${buildingTooColdPercent}%` }}
                      ></div>
                      <div
                        className="bg-green-500 transition-all duration-500"
                        style={{ width: `${buildingComfortPercent}%` }}
                      ></div>
                      <div
                        className="bg-orange-500 transition-all duration-500"
                        style={{ width: `${buildingTooWarmPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}