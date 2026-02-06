import React from 'react';
import { Megaphone, CreditCard, Heart, Coffee, Plus, Trash2 } from 'lucide-react';
import { type AnnouncementItem, type OfferingInfo } from '../api';

interface ServiceContentProps {
  announcements: AnnouncementItem[];
  setAnnouncements: (ann: AnnouncementItem[]) => void;
  offering: OfferingInfo;
  setOffering: (offering: OfferingInfo) => void;
  prayerPoints: string[];
  setPrayerPoints: (points: string[]) => void;
  mingleText: string;
  setMingleText: (text: string) => void;
}

const Section: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  colorClass: string; 
  hoverClass: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}> = ({ title, icon, colorClass, hoverClass, children, onAdd, addLabel }) => (
  <section className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
        <span className={colorClass}>{icon}</span>
        {title}
      </h2>
    </div>
    <div className="space-y-4">
      {children}
      {onAdd && (
        <button
          onClick={onAdd}
          className={`w-full py-2 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-lg text-gray-400 dark:text-gray-500 transition-all flex items-center justify-center gap-2 mt-2 ${hoverClass}`}
        >
          <Plus size={16} /> {addLabel || `Add ${title}`}
        </button>
      )}
    </div>
  </section>
);

export const ServiceContent: React.FC<ServiceContentProps> = ({
  announcements, setAnnouncements,
  offering, setOffering,
  prayerPoints, setPrayerPoints,
  mingleText, setMingleText
}) => {
  
  // Announcement Handlers
  const addAnnouncement = () => setAnnouncements([...announcements, { title: '', content: '' }]);
  const updateAnnouncement = (i: number, field: keyof AnnouncementItem, val: string) => {
    const next = [...announcements];
    next[i] = { ...next[i], [field]: val };
    setAnnouncements(next);
  };
  const removeAnnouncement = (i: number) => setAnnouncements(announcements.filter((_, idx) => idx !== i));

  // Prayer Handlers
  const addPrayerPoint = () => setPrayerPoints([...prayerPoints, '']);
  const updatePrayerPoint = (i: number, val: string) => {
    const next = [...prayerPoints];
    next[i] = val;
    setPrayerPoints(next);
  };
  const removePrayerPoint = (i: number) => setPrayerPoints(prayerPoints.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      {/* Announcements */}
      <Section 
        title="Announcements" 
        icon={<Megaphone size={20} />} 
        colorClass="text-amber-600 dark:text-amber-400"
        hoverClass="hover:border-amber-200 dark:hover:border-amber-800 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/20"
        onAdd={addAnnouncement}
      >
        {announcements.map((ann, i) => (
          <div key={i} className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg relative group border border-transparent dark:border-gray-800">
            <div className='flex gap-2 group'>
              <input 
                type="text" 
                value={ann.title}
                onChange={e => updateAnnouncement(i, 'title', e.target.value)}
                placeholder="Announcement Title"
                className="w-full pr-8 p-2 border-b border-transparent bg-transparent focus:border-amber-500 dark:focus:border-amber-400 outline-none font-bold text-sm dark:text-gray-100"
              />
              <button 
                onClick={() => removeAnnouncement(i)}
                className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
              <Trash2 size={18} />
            </button>
            </div>

            <textarea 
              value={ann.content}
              onChange={e => updateAnnouncement(i, 'content', e.target.value)}
              placeholder="Details (optional)"
              className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-sm h-20 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 outline-none dark:text-gray-100"
            />
          </div>
        ))}
      </Section>

      {/* Offering Info */}
      <Section 
        title="Offering Details" 
        icon={<CreditCard size={20} />} 
        colorClass="text-blue-600 dark:text-blue-400"
        hoverClass="hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
      >
        <div className="grid grid-cols-1 gap-3">
          <input 
            type="text" 
            value={offering.account_name}
            onChange={e => setOffering({ ...offering, account_name: e.target.value })}
            placeholder="Account Name"
            className="w-full p-2 border dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" 
              value={offering.bsb}
              onChange={e => setOffering({ ...offering, bsb: e.target.value })}
              placeholder="BSB"
              className="w-full p-2 border dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              value={offering.account_number}
              onChange={e => setOffering({ ...offering, account_number: e.target.value })}
              placeholder="Account Number"
              className="w-full p-2 border dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input 
            type="text" 
            value={offering.reference}
            onChange={e => setOffering({ ...offering, reference: e.target.value })}
            placeholder="Reference"
            className="w-full p-2 border dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea 
            value={offering.details}
            onChange={e => setOffering({ ...offering, details: e.target.value })}
            placeholder="Additional details..."
            className="w-full p-2 border dark:border-gray-700 rounded-md text-sm h-16 bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Section>

      {/* Prayer Points */}
      <Section 
        title="Prayer Points" 
        icon={<Heart size={20} />} 
        colorClass="text-rose-600 dark:text-rose-400"
        hoverClass="hover:border-rose-200 dark:hover:border-rose-800 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20"
        onAdd={addPrayerPoint}
      >
        {prayerPoints.map((point, i) => (
          <div key={i} className="flex gap-2 group">
            <input 
              type="text" 
              value={point}
              onChange={e => updatePrayerPoint(i, e.target.value)}
              placeholder={`Point ${i + 1}`}
              className="flex-1 p-2 border dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <button onClick={() => removePrayerPoint(i)} className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </Section>

      {/* Concluding Slide */}
      <Section 
        title="Final Slide" 
        icon={<Coffee size={20} />} 
        colorClass="text-amber-700 dark:text-amber-500"
        hoverClass="hover:border-amber-200 dark:hover:border-amber-800 hover:text-amber-700 dark:hover:text-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/20"
      >
        <input 
          type="text" 
          value={mingleText}
          onChange={e => setMingleText(e.target.value)}
          placeholder="e.g. Mingle time!"
          className="w-full p-2 border dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </Section>
    </div>
  );
};
