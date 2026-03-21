import { useState } from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import HKUSTLogo from '../../imports/Hong_Kong_University_of_Science_and_Technology_symbol.svg';

export function VotePage() {
  const [votes, setVotes] = useState({ tooCold: 41, comfort: 82, tooWarm: 38 });

  const handleVote = (type: 'tooCold' | 'comfort' | 'tooWarm') => {
    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 py-4 bg-white border-b border-gray-200">
        <img src={HKUSTLogo} alt="HKUST Logo" className="h-12" />
        <div className="text-lg text-gray-700">Student Sustainable Smart Campus Living Lab</div>
      </div>

      {/* Title */}
      <div className="bg-blue-100 py-4 text-center">
        <h1 className="text-xl text-gray-800">HKUST EcoPlay - Student Environmental Feedback</h1>
      </div>

      {/* Sensor Metrics */}
      <div className="grid grid-cols-3 gap-4 px-8 py-6 bg-gray-50">
        <div className="flex items-center justify-center gap-2 bg-white py-4 rounded-lg border border-gray-200">
          <Thermometer className="w-8 h-8 text-blue-500" />
          <span className="text-3xl text-gray-800">23.5°C</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white py-4 rounded-lg border border-gray-200">
          <Droplets className="w-8 h-8 text-blue-500" />
          <span className="text-3xl text-gray-800">55%</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white py-4 rounded-lg border border-gray-200">
          <Wind className="w-8 h-8 text-green-600" />
          <span className="text-2xl text-gray-800">650 ppm</span>
        </div>
      </div>

      {/* Voting Buttons */}
      <div className="flex-1 flex items-center justify-center gap-6 px-8">
        <button
          onClick={() => handleVote('tooCold')}
          className="flex flex-col items-center justify-center gap-3 bg-blue-400 hover:bg-blue-500 text-white rounded-2xl p-8 h-48 flex-1 transition-colors"
        >
          <div className="text-5xl">❄️</div>
          <div className="text-3xl font-bold">Too Cold</div>
        </button>

        <button
          onClick={() => handleVote('comfort')}
          className="flex flex-col items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-8 h-48 flex-1 transition-colors"
        >
          <div className="text-5xl">☀️</div>
          <div className="text-3xl font-bold">Comfort</div>
        </button>

        <button
          onClick={() => handleVote('tooWarm')}
          className="flex flex-col items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-8 h-48 flex-1 transition-colors"
        >
          <div className="text-5xl">🔥</div>
          <div className="text-3xl font-bold">Too Warm</div>
        </button>
      </div>

      {/* Vote Counter */}
      <div className="py-4 text-center bg-white border-t border-gray-200">
        <p className="text-lg text-gray-700">
          Votes (Session): <span className="text-blue-600 font-semibold">Too Cold: {votes.tooCold}</span> | <span className="text-green-600 font-semibold">Comfort: {votes.comfort}</span> | <span className="text-orange-600 font-semibold">Too Warm: {votes.tooWarm}</span>
        </p>
      </div>
    </div>
  );
}