import React from 'react';
import { Settings, Calendar, User, MessageSquare } from 'lucide-react';

interface ServiceInfoProps {
  date: string;
  setDate: (date: string) => void;
  speaker: string;
  setSpeaker: (speaker: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  churchName: string;
  setChurchName: (name: string) => void;
  serviceName: string;
  setServiceName: (name: string) => void;
}

export const ServiceInfo: React.FC<ServiceInfoProps> = ({
  date,
  setDate,
  speaker,
  setSpeaker,
  topic,
  setTopic,
  churchName,
  setChurchName,
  serviceName,
  setServiceName,
}) => {
  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-gray-100">
        <Settings size={20} className="text-blue-600 dark:text-blue-400" />
        Service Info
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <Settings size={14} /> Church Name
          </label>
          <input 
            type="text" 
            value={churchName}
            onChange={e => setChurchName(e.target.value)}
            placeholder="e.g. Blacktown Chinese Christian Church"
            className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <Settings size={14} /> Service Name
          </label>
          <input 
            type="text" 
            value={serviceName}
            onChange={e => setServiceName(e.target.value)}
            placeholder="e.g. English Service"
            className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <Calendar size={14} /> Date
          </label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <User size={14} /> Speaker
          </label>
          <input 
            type="text" 
            value={speaker}
            onChange={e => setSpeaker(e.target.value)}
            placeholder="e.g. Pastor John"
            className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <MessageSquare size={14} /> Topic
          </label>
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Faith and Hope"
            className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
      </div>
    </section>
  );
};
