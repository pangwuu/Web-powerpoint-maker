import React from 'react';
import { Megaphone, CreditCard, Heart, Coffee, Plus, Trash2 } from 'lucide-react';
import { type AnnouncementItem, type OfferingInfo } from '../api';

interface AdditionalSectionsProps {
  announcements: AnnouncementItem[];
  setAnnouncements: (ann: AnnouncementItem[]) => void;
  offering: OfferingInfo;
  setOffering: (offering: OfferingInfo) => void;
  prayerPoints: string[];
  setPrayerPoints: (points: string[]) => void;
  mingleText: string;
  setMingleText: (text: string) => void;
}

export const AdditionalSections: React.FC<AdditionalSectionsProps> = ({
  announcements,
  setAnnouncements,
  offering,
  setOffering,
  prayerPoints,
  setPrayerPoints,
  mingleText,
  setMingleText,
}) => {
  const addAnnouncement = () => {
    setAnnouncements([...announcements, { title: '', content: '' }]);
  };

  const updateAnnouncement = (index: number, field: keyof AnnouncementItem, value: string) => {
    const newAnn = [...announcements];
    newAnn[index] = { ...newAnn[index], [field]: value };
    setAnnouncements(newAnn);
  };

  const removeAnnouncement = (index: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const addPrayerPoint = () => {
    setPrayerPoints([...prayerPoints, '']);
  };

  const updatePrayerPoint = (index: number, value: string) => {
    const newPoints = [...prayerPoints];
    newPoints[index] = value;
    setPrayerPoints(newPoints);
  };

  const removePrayerPoint = (index: number) => {
    setPrayerPoints(prayerPoints.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Announcements */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Megaphone size={20} className="text-orange-600" />
          Announcements
        </h2>
        <div className="space-y-4">
          {announcements.map((ann, i) => (
            <div key={i} className="space-y-2">
              <div className='flex space-x-2'>
              <input 
                type="text" 
                value={ann.title}
                onChange={e => updateAnnouncement(i, 'title', e.target.value)}
                placeholder="Announcement Title"
                className="w-full p-2 border rounded-md text-sm font-bold"
              />
              <button 
                onClick={() => removeAnnouncement(i)}
                className="p-2 text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>              
              </div>

              <textarea 
                value={ann.content}
                onChange={e => updateAnnouncement(i, 'content', e.target.value)}
                placeholder="Announcement Content (Optional)"
                className="w-full p-2 border rounded-md text-sm h-20"
              />
            </div>
          ))}
          <button 
            onClick={addAnnouncement}
            className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Announcement
          </button>
        </div>
      </section>

      {/* Offering */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard size={20} className="text-green-600" />
          Offering Info
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Account Name</label>
            <input 
              type="text" 
              value={offering.account_name}
              onChange={e => setOffering({ ...offering, account_name: e.target.value })}
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">BSB</label>
              <input 
                type="text" 
                value={offering.bsb}
                onChange={e => setOffering({ ...offering, bsb: e.target.value })}
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Account Number</label>
              <input 
                type="text" 
                value={offering.account_number}
                onChange={e => setOffering({ ...offering, account_number: e.target.value })}
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Reference</label>
            <input 
              type="text" 
              value={offering.reference}
              onChange={e => setOffering({ ...offering, reference: e.target.value })}
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Details/Location</label>
            <textarea 
              value={offering.details}
              onChange={e => setOffering({ ...offering, details: e.target.value })}
              className="w-full p-2 border rounded-md text-sm multiline"
            />
          </div>
        </div>
      </section>

      {/* Prayer Points */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Heart size={20} className="text-red-600" />
          Prayer Points
        </h2>
        <div className="space-y-2">
          {prayerPoints.map((point, i) => (
            <div key={i} className="flex gap-2">
              <input 
                type="text" 
                value={point}
                onChange={e => updatePrayerPoint(i, e.target.value)}
                placeholder="Prayer Point"
                className="flex-1 p-2 border rounded-md text-sm"
              />
              <button 
                onClick={() => removePrayerPoint(i)}
                className="p-2 text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button 
            onClick={addPrayerPoint}
            className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Prayer Point
          </button>
        </div>
      </section>

      {/* Mingle */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Coffee size={20} className="text-brown-600" />
          Concluding slide
        </h2>
        <input 
          type="text" 
          value={mingleText}
          onChange={e => setMingleText(e.target.value)}
          placeholder="e.g. Mingle time!"
          className="w-full p-2 border rounded-md text-sm"
        />
      </section>
    </div>
  );
};
