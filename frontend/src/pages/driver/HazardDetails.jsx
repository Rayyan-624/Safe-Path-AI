import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHazards } from '../../context/HazardContext';
import {
  IoShareOutline, IoBookmarkOutline, IoPersonOutline, IoShieldCheckmarkOutline,
  IoPulseOutline, IoCalendarOutline, IoChevronBackOutline, IoChevronForwardOutline,
  IoCameraOutline, IoLocationOutline, IoEllipsisVerticalOutline
} from 'react-icons/io5';

export default function DriverHazardDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { hazards } = useHazards();

  // TODO [Week 5+]: Photos and comments require dedicated /hazards/{id}/images
  // and /hazards/{id}/comments endpoints (image storage + comment model).
  // Using static fallback data until those endpoints are built.
  const FALLBACK_PHOTOS = [
    "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621259182978-f09e5e2ae091?w=600&auto=format&fit=crop&q=80"
  ];
  const FALLBACK_COMMENTS = [
    { user: "Usman Khan", role: "Driver", text: "Still there. Got a flat tire because of this.", time: "18 May 2024, 11:02 AM", verified: true },
    { user: "Ayesha Malik", role: "Driver", text: "Very dangerous for motorcyclists in the evening.", time: "18 May 2024, 02:15 PM", verified: false }
  ];

  // Selected Hazard Info from Backend context, fallback to empty placeholder
  const backendHazard = hazards.find(h => String(h.hazard_id) === String(id) || String(h.id) === String(id));
  const hazard = backendHazard ? {
    id: backendHazard.hazard_id || backendHazard.id,
    type: backendHazard.hazard_type,
    severity: backendHazard.severity,
    location: `Lat ${backendHazard.latitude?.toFixed(4) ?? '?'}, Lng ${backendHazard.longitude?.toFixed(4) ?? '?'}`,
    confidence: Math.round((backendHazard.confidence || 0.92) * 100),
    reportedBy: backendHazard.user_name || "SafePath Driver",
    reportedOn: backendHazard.created_at ? new Date(backendHazard.created_at).toLocaleDateString() : '—',
    verifiedCount: backendHazard.crowdsource_count || 0,
    modelName: "CNN-LSTM v1.4",
    description: `AI-detected ${backendHazard.hazard_type} with ${backendHazard.severity} severity. Verified by ${backendHazard.crowdsource_count || 0} drivers.`,
    // TODO [Week 5+]: Replace FALLBACK_PHOTOS with real image from backendHazard.image_path
    photos: backendHazard.image_path ? [`http://localhost:8000/${backendHazard.image_path}`] : FALLBACK_PHOTOS,
    // TODO [Week 5+]: Replace FALLBACK_COMMENTS with live comments from /hazards/{id}/comments
    comments: FALLBACK_COMMENTS,
  } : {
    id: id || 'UNKNOWN',
    type: 'Pothole',
    severity: 'Unknown',
    location: 'Location not found — hazard may have been removed.',
    confidence: 0,
    reportedBy: '—',
    reportedOn: '—',
    verifiedCount: 0,
    modelName: '—',
    description: 'This hazard could not be found. It may have been resolved or removed.',
    photos: FALLBACK_PHOTOS,
    comments: FALLBACK_COMMENTS,
  };

  const [photoIndex, setPhotoIndex] = useState(0);

  // Form states (Right column)
  const [hazardType, setHazardType] = useState(hazard.type);
  const [location, setLocation] = useState(hazard.location);
  const [severity, setSeverity] = useState(hazard.severity);
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(true);

  const handleNextPhoto = () => {
    setPhotoIndex(i => (i + 1) % hazard.photos.length);
  };

  const handlePrevPhoto = () => {
    setPhotoIndex(i => (i - 1 + hazard.photos.length) % hazard.photos.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/driver/report-success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Hazard Detailed Report */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-6 text-left h-fit">
        
        {/* Photo Slider */}
        <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-inner bg-slate-900 flex items-center justify-center">
          <img
            src={hazard.photos[photoIndex]}
            alt={hazard.type}
            className="w-full h-full object-cover opacity-90"
          />
          {/* Photo Counter */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold tracking-wider flex items-center gap-1.5 backdrop-blur-md">
            <IoCameraOutline className="w-4 h-4" />
            <span>{photoIndex + 1} / {hazard.photos.length}</span>
          </div>

          {/* Navigation sliders */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-4 p-2 bg-white/25 hover:bg-white/40 border border-white/20 text-white rounded-xl backdrop-blur-md shadow-md focus:outline-none transition-all"
          >
            <IoChevronBackOutline className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextPhoto}
            className="absolute right-4 p-2 bg-white/25 hover:bg-white/40 border border-white/20 text-white rounded-xl backdrop-blur-md shadow-md focus:outline-none transition-all"
          >
            <IoChevronForwardOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Hazard header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-800">{hazard.type}</span>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-600 font-extrabold text-[9px] rounded-full uppercase tracking-wider">Critical</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <IoLocationOutline className="w-4 h-4 text-slate-400" />
              <span>{hazard.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 focus:outline-none">
              <IoShareOutline className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 focus:outline-none">
              <IoBookmarkOutline className="w-4 h-4" />
              <span>Follow</span>
            </button>
          </div>
        </div>

        {/* Detailed Metrics Panel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-1 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Severity</span>
            <span className="block text-sm font-extrabold text-red-600">Critical</span>
            <span className="text-[9px] font-semibold text-slate-400">High risk for vehicles</span>
          </div>

          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-1 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Confidence</span>
            <span className="block text-sm font-extrabold text-blue-600">{hazard.confidence}%</span>
            <span className="text-[9px] font-semibold text-slate-400">AI detection confidence</span>
          </div>

          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-1 text-left col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reported By</span>
            <span className="block text-xs font-extrabold text-slate-800">{hazard.reportedBy}</span>
            <span className="text-[9px] font-semibold text-slate-400">{hazard.reportedOn}</span>
          </div>

          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-1 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Verified Users</span>
            <span className="block text-sm font-extrabold text-green-600">{hazard.verifiedCount} Users</span>
            <span className="text-[9px] font-semibold text-slate-400">Confirmed this hazard</span>
          </div>

          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-1 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">AI Confidence</span>
            <span className="block text-sm font-extrabold text-blue-600">{hazard.confidence}%</span>
            <span className="text-[9px] font-semibold text-slate-400">Model: {hazard.modelName}</span>
          </div>

          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-1 text-left col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date Detected</span>
            <span className="block text-xs font-extrabold text-slate-800">18 May 2024</span>
            <span className="text-[9px] font-semibold text-slate-400">09:41 AM</span>
          </div>

        </div>

        {/* Hazard Description */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
          <p className="text-slate-600 text-xs leading-relaxed border border-slate-100 p-4 rounded-2xl bg-slate-50/20">
            {hazard.description}
          </p>
        </div>

        {/* Comments section */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-1.5 block">Comments ({hazard.comments.length})</span>
          
          <div className="space-y-4">
            {hazard.comments.map((com, idx) => (
              <div key={idx} className="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  {com.user.charAt(0)}
                </div>
                <div className="flex-1 text-left leading-tight">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 mr-2">{com.user}</span>
                      {com.verified && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-bold rounded uppercase tracking-wider">Verified</span>
                      )}
                    </div>
                    <button className="text-slate-300 hover:text-slate-500 focus:outline-none">
                      <IoEllipsisVerticalOutline className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{com.time}</span>
                  <p className="text-xs text-slate-600 mt-2">{com.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Report a Hazard Side Panel Form */}
      <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-5 text-left h-fit">
        <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2">Report a Hazard</span>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Hazard Type Select cards */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hazard Type</span>
            <div className="flex flex-wrap gap-2">
              {['Pothole', 'Crack', 'Flood', 'Construction', 'Open Manhole'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setHazardType(type)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold focus:outline-none transition-all ${
                    hazardType === type
                      ? 'border-blue-600 bg-blue-50/20 text-blue-600'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
            <div className="relative">
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-3 pr-24 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              />
              <button
                type="button"
                className="absolute inset-y-1 right-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[9px] font-bold focus:outline-none"
              >
                Use GPS
              </button>
            </div>
          </div>

          {/* Upload media drag and drop */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Add Photos / Videos</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors col-span-2">
                <IoCameraOutline className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[9px] font-bold text-slate-500">Upload Media</span>
                <span className="text-[8px] text-slate-400">PNG, JPG up to 20MB</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-100 aspect-square group">
                <img
                  src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=100&auto=format&fit=crop&q=80"
                  alt="pothole"
                  className="w-full h-full object-cover"
                />
                <button type="button" className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white text-[8px] hover:bg-black focus:outline-none">
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Severity selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Severity</span>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {['Minor', 'Moderate', 'Major', 'Critical'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider focus:outline-none transition-all ${
                    severity === level
                      ? 'border-blue-600 bg-blue-50/20 text-blue-600'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Additional details */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Additional Details (Optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the hazard..."
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
            />
            <div className="text-right text-[9px] text-slate-400 font-bold">{notes.length}/500</div>
          </div>

          {/* Checkbox confirmation */}
          <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-500 text-left select-none cursor-pointer leading-tight">
            <input
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 flex-shrink-0"
            />
            <span>I confirm this information is accurate</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/driver/dashboard')}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-1 cursor-pointer"
            >
              Submit Report
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
