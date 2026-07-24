import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPlaceholder from '../../components/MapPlaceholder';
import {
  IoCameraOutline, IoLocationOutline, IoWarningOutline, IoPulseOutline,
  IoDocumentTextOutline, IoArrowBackOutline, IoPaperPlaneOutline
} from 'react-icons/io5';
import { useHazards as useHazardAPI } from '../../context/HazardContext';

export default function DriverReportHazard() {
  const navigate = useNavigate();
  const { reportHazard } = useHazardAPI();

  // Form states
  const [mediaUploaded, setMediaUploaded] = useState(true);
  const [imageBlob, setImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=80');
  const [locationName, setLocationName] = useState('Shahrah-e-Faisal, Near Teen Hatti, Karachi, Pakistan');
  const [latLng, setLatLng] = useState({ lat: 24.8607, lng: 67.0099 });
  const [hazardType, setHazardType] = useState('Pothole');
  const [severity, setSeverity] = useState('Critical');
  const [notes, setNotes] = useState('');

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationName(`Current Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error(error);
          alert('Could not retrieve current coordinates.');
        }
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageBlob(reader.result); // contains base64 format data URI
        setMediaUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map UI choices to backend HazardType strings
      let mappedType = hazardType;
      if (hazardType === 'Crack') mappedType = 'Road Crack';
      if (hazardType === 'Flood') mappedType = 'Flooded Road';

      // Map severity
      let mappedSeverity = 'Minor';
      if (severity === 'Moderate') mappedSeverity = 'Moderate';
      if (severity === 'Major' || severity === 'Critical') mappedSeverity = 'Critical';

      const sensorPayload = {
        latitude: latLng.lat,
        longitude: latLng.lng,
        accelerometer_x: 0.8,
        accelerometer_y: -0.4,
        accelerometer_z: severity === 'Critical' ? 14.8 : severity === 'Major' ? 12.2 : 9.8,
        gyroscope_x: 0.1,
        gyroscope_y: 0.05,
        gyroscope_z: 0.15,
        speed_kmh: 50.0,
        image_base64: imageBlob
      };

      await reportHazard(sensorPayload);
      navigate('/driver/report-success');
    } catch (err) {
      console.error(err);
      alert('Failed to report hazard. Check console for error details.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top back title navigation */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3 text-left">
          <button
            onClick={() => navigate('/driver/dashboard')}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl focus:outline-none"
          >
            <IoArrowBackOutline className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-extrabold text-slate-800">Report Hazard</h2>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Help us keep roads safe for everyone</p>
          </div>
        </div>
      </div>

      {/* Main split dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form details */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6 text-left">
          
          {/* Step 1: Media upload */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-800">1. Upload Image / Video</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label htmlFor="file-upload" className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                <IoCameraOutline className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload image</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 20MB</span>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              
              {mediaUploaded ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36 group">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaUploaded(false);
                      setImageBlob(null);
                      setImagePreview('https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=80');
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white text-xs hover:bg-black focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-semibold h-36">
                  No photo attached
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Location */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-800">2. Location</span>
            <div className="relative flex items-center">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <IoLocationOutline className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full pl-10 pr-28 py-3 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              />
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="absolute inset-y-1.5 right-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold focus:outline-none"
              >
                Use Current Location
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-bold pl-2">
              GPS Coordinates: {latLng.lat.toFixed(4)}° N, {latLng.lng.toFixed(4)}° E
            </div>
          </div>

          {/* Step 3: Hazard Type */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-800">3. Hazard Type</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'Pothole', label: 'Pothole', icon: '🕳️' },
                { id: 'Crack', label: 'Crack', icon: '🛣️' },
                { id: 'Flood', label: 'Flood', icon: '🌊' },
                { id: 'Construction', label: 'Construction', icon: '🚧' },
                { id: 'Open Manhole', label: 'Open Manhole', icon: '🕳️' },
                { id: 'Other', label: 'Other', icon: '•••' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHazardType(item.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all focus:outline-none select-none cursor-pointer ${
                    hazardType === item.id
                      ? 'border-blue-600 bg-blue-50/20 text-blue-600 font-bold ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <span className="text-sm mb-1">{item.icon}</span>
                  <span className="text-[9px] uppercase tracking-wider whitespace-nowrap">{item.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Severity */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-800">4. Severity Level</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { id: 'Minor', label: 'Minor', desc: 'Low risk', color: 'border-green-200 text-green-700 bg-green-50/10' },
                { id: 'Moderate', label: 'Moderate', desc: 'Needs attention', color: 'border-yellow-200 text-yellow-600 bg-yellow-50/10' },
                { id: 'Major', label: 'Major', desc: 'High risk', color: 'border-orange-200 text-orange-600 bg-orange-50/10' },
                { id: 'Critical', label: 'Critical', desc: 'Very high risk', color: 'border-red-200 text-red-600 bg-red-50/10' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSeverity(item.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all focus:outline-none select-none cursor-pointer ${
                    severity === item.id
                      ? 'border-blue-600 bg-blue-50/30 text-blue-600 font-bold ring-1 ring-blue-600'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <span className="text-xs font-bold block">{item.label}</span>
                  <span className="text-[9px] font-semibold text-slate-400 mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Description */}
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold text-slate-800">5. Additional Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the hazard in detail..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
            />
            <div className="text-right text-[9px] text-slate-400 font-bold">{notes.length}/500</div>
          </div>

        </div>

        {/* Right Column: Preview and Summary */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Selected Location Mini Map */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Selected Location</span>
            <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-100 relative">
              <MapPlaceholder hazards={[{ lat: latLng.lat, lng: latLng.lng, id: 'temp-pin', severity: severity, type: hazardType }]} mode="admin" />
            </div>
          </div>

          {/* Report summary card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Report Summary</span>
            <div className="space-y-2.5 text-xs font-semibold text-slate-500">
              <div className="flex justify-between items-start"><span className="text-slate-400">Location</span><span className="text-slate-800 font-bold text-right ml-4">{locationName.split(',').slice(0, 2).join(',')}</span></div>
              <div className="flex justify-between items-center"><span>Hazard Type</span><span className="text-slate-800 font-bold">{hazardType}</span></div>
              <div className="flex justify-between items-center"><span>Severity</span><span className={`font-bold uppercase tracking-wider ${severity === 'Critical' ? 'text-red-500' : 'text-slate-800'}`}>{severity}</span></div>
              <div className="flex justify-between items-center"><span>Attached Media</span><span className="text-slate-800 font-bold">{mediaUploaded ? '1 Photo' : 'None'}</span></div>
              <div className="flex justify-between items-center"><span>Reported By</span><span className="text-slate-800 font-bold">Ali Haider</span></div>
              <div className="flex justify-between items-center"><span>Date & Time</span><span className="text-slate-800 font-bold">18 May 2024, 10:45 AM</span></div>
            </div>
          </div>

        </div>

      </div>

      {/* Action buttons footer strip */}
      <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl shadow-sm justify-end text-xs font-bold">
        <button
          onClick={() => navigate('/driver/dashboard')}
          className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl focus:outline-none"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
        >
          <IoPaperPlaneOutline className="w-4 h-4" />
          <span>Submit Report</span>
        </button>
      </div>

    </div>
  );
}
