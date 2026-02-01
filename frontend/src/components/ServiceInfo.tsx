import React from 'react';
import { Settings, Calendar, User, MessageSquare } from 'lucide-react';

interface ServiceInfoProps {
  date: string;
  setDate: (date: string) => void;
  speaker: string;
  setSpeaker: (speaker: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
}

export const ServiceInfo: React.FC<ServiceInfoProps> = ({
  date,
  setDate,
  speaker,
  setSpeaker,
  topic,
  setTopic,
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Settings size={20} className="text-blue-600" />
        Service Info
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Calendar size={14} /> Date
          </label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2 border rounded-md" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <User size={14} /> Speaker
          </label>
          <input 
            type="text" 
            value={speaker}
            onChange={e => setSpeaker(e.target.value)}
            placeholder="e.g. Pastor John"
            className="w-full p-2 border rounded-md" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <MessageSquare size={14} /> Topic
          </label>
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Faith and Hope"
            className="w-full p-2 border rounded-md" 
          />
        </div>
      </div>
    </section>
  );
};
