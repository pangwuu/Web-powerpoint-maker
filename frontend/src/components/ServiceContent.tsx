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
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}> = ({ title, icon, colorClass, children, onAdd, addLabel }) => (
  <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span className={colorClass}>{icon}</span>
        {title}
      </h2>
    </div>
    <div className="space-y-4">
      {children}
      {onAdd && (
        <button
          onClick={onAdd}
          className={`w-full py-2 border-2 border-dashed border-gray-100 rounded-lg text-gray-400 hover:border-current hover:bg-opacity-10 transition-all flex items-center justify-center gap-2 mt-2 ${colorClass.replace('text-', 'hover:text-').replace('text-', 'hover:border-')}`}
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
        colorClass="text-orange-600"
        onAdd={addAnnouncement}
      >
        {announcements.map((ann, i) => (
          <div key={i} className="space-y-2 p-3 bg-gray-50 rounded-lg relative group">
            <div className='flex gap-2 group'>
              <input 
                type="text" 
                value={ann.title}
                onChange={e => updateAnnouncement(i, 'title', e.target.value)}
                placeholder="Announcement Title"
                className="w-full pr-8 p-2 border-b border-transparent bg-transparent focus:border-orange-500 outline-none font-bold text-sm"
              />
              <button 
                onClick={() => removeAnnouncement(i)}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
              <Trash2 size={18} />
            </button>
            </div>

            <textarea 
              value={ann.content}
              onChange={e => updateAnnouncement(i, 'content', e.target.value)}
              placeholder="Details (optional)"
              className="w-full p-2 bg-white border border-gray-100 rounded text-sm h-20 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>
        ))}
      </Section>

      {/* Offering Info */}
      <Section title="Offering Details" icon={<CreditCard size={20} />} colorClass="text-blue-600">
        <div className="grid grid-cols-1 gap-3">
          <input 
            type="text" 
            value={offering.account_name}
            onChange={e => setOffering({ ...offering, account_name: e.target.value })}
            placeholder="Account Name"
            className="w-full p-2 border rounded-md text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" 
              value={offering.bsb}
              onChange={e => setOffering({ ...offering, bsb: e.target.value })}
              placeholder="BSB"
              className="w-full p-2 border rounded-md text-sm"
            />
            <input 
              type="text" 
              value={offering.account_number}
              onChange={e => setOffering({ ...offering, account_number: e.target.value })}
              placeholder="Account Number"
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>
          <input 
            type="text" 
            value={offering.reference}
            onChange={e => setOffering({ ...offering, reference: e.target.value })}
            placeholder="Reference"
            className="w-full p-2 border rounded-md text-sm"
          />
          <textarea 
            value={offering.details}
            onChange={e => setOffering({ ...offering, details: e.target.value })}
            placeholder="Additional details..."
            className="w-full p-2 border rounded-md text-sm h-16"
          />
        </div>
      </Section>

      {/* Prayer Points */}
      <Section 
        title="Prayer Points" 
        icon={<Heart size={20} />} 
        colorClass="text-red-600"
        onAdd={addPrayerPoint}
      >
        {prayerPoints.map((point, i) => (
          <div key={i} className="flex gap-2 group">
            <input 
              type="text" 
              value={point}
              onChange={e => updatePrayerPoint(i, e.target.value)}
              placeholder={`Point ${i + 1}`}
              className="flex-1 p-2 border rounded-md text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
            <button onClick={() => removePrayerPoint(i)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </Section>

      {/* Concluding Slide */}
      <Section title="Final Slide" icon={<Coffee size={20} />} colorClass="text-amber-700">
        <input 
          type="text" 
          value={mingleText}
          onChange={e => setMingleText(e.target.value)}
          placeholder="e.g. Mingle time!"
          className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </Section>
    </div>
  );
};
