'use client';

import { useState, useCallback, useRef, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, Circle, useJsApiLoader } from '@react-google-maps/api';
import Button from '@/components/ui/Button';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSchools, saveOnboarding, type School } from './actions';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

interface Coords {
  lat: number;
  lng: number;
  formatted: string;
}

interface OnboardingData {
  display_name: string;
  bio: string;
  school_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | '';
  street: string;
  city: string;
  state: string;
  zip: string;
  coords: Coords | null;
  profile_photo_url: string | null;
}

const TOTAL_STEPS = 4;
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAP_CONTAINER_STYLE = { width: '100%', height: '260px' };
const PRIVACY_MAP_STYLE = { width: '100%', height: '240px' };

const FIELD = 'w-full rounded-xl border border-nu-border bg-white px-4 py-3 text-sm text-nu-text placeholder-nu-dim shadow-sm ring-0 ring-nu-blue/20 transition-all duration-200 focus:border-nu-blue focus:outline-none focus:ring-2 focus:ring-nu-blue/20';
const LABEL = 'mb-2 block text-[11px] font-semibold uppercase tracking-widest text-nu-muted';

async function geocodeAddress(address: string): Promise<Coords | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== 'OK' || !json.results?.[0]) return null;
  const { lat, lng } = json.results[0].geometry.location;
  return { lat, lng, formatted: json.results[0].formatted_address };
}

function DraggablePin({ lifted }: { lifted: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, ${lifted ? 'calc(-100% - 8px)' : '-100%'})`,
        transition: 'transform 0.15s ease',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
        zIndex: 10,
      }}
    >
      <svg width="28" height="38" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="#EA4335" />
        <circle cx="18" cy="18" r="7" fill="white" />
      </svg>
    </div>
  );
}

function SelectField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('w-full', className)}>
      <label className={LABEL}>{label}</label>
      <div className="relative">
        {children}
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nu-dim" />
      </div>
    </div>
  );
}

function UniversityCombobox({
  value,
  onChange,
  schools,
}: {
  value: string;
  onChange: (val: string) => void;
  schools: School[];
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Deduplicate school names for suggestions
  const uniqueNames = Array.from(new Set(schools.map((s) => s.school_name)));
  const suggestions = value.length >= 2
    ? uniqueNames.filter((n) => n.toLowerCase().includes(value.toLowerCase()))
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label className={LABEL}>School / University</label>
      <input
        type="text"
        className={FIELD}
        placeholder="e.g. Boston University"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full rounded-xl border border-nu-border bg-white shadow-card-md overflow-hidden">
          {suggestions.map((n) => (
            <li
              key={n}
              className="px-4 py-3 text-sm text-nu-text cursor-pointer hover:bg-nu-blue-light hover:text-nu-blue transition-colors"
              onMouseDown={(e) => { e.preventDefault(); onChange(n); setOpen(false); }}
            >
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-7 flex items-center">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <div
                className={cn(
                  'mx-1 h-px flex-1 transition-all duration-500',
                  done ? 'bg-nu-blue' : 'bg-nu-border',
                )}
              />
            )}
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300',
                done && 'bg-nu-blue text-white',
                active && 'bg-nu-blue text-white ring-4 ring-nu-blue/15',
                !done && !active && 'border border-nu-border bg-nu-elevated text-nu-dim',
              )}
            >
              {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : n}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="mb-1 font-display font-bold leading-tight text-nu-text" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>{title}</h1>
      <p className="leading-relaxed text-nu-muted" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>{subtitle}</p>
    </div>
  );
}

function ButtonBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex flex-shrink-0 gap-3 pt-4">
      {children}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [locationView, setLocationView] = useState<'form' | 'confirm' | 'privacy'>('form');
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [initialCenter, setInitialCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const currentCenterRef = useRef<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded: mapLoaded } = useJsApiLoader({ googleMapsApiKey: MAPS_KEY });

  const [data, setData] = useState<OnboardingData>({
    display_name: '',
    bio: '',
    school_name: '',
    date_of_birth: '',
    gender: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    coords: null,
    profile_photo_url: null,
  });
  const router = useRouter();

  useEffect(() => {
    getSchools().then(setSchools);
  }, []);

  const set = (field: keyof OnboardingData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const onMapLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);

  const onCenterChanged = useCallback(() => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    if (center) currentCenterRef.current = { lat: center.lat(), lng: center.lng() };
  }, []);

  const handleAddressContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeocodeError('');
    setGeocoding(true);
    try {
      const address = `${data.street}, ${data.city}, ${data.state} ${data.zip}`;
      const coords = await geocodeAddress(address);
      if (!coords) { setGeocodeError('Address not found. Please check and try again.'); return; }
      setData((prev) => ({ ...prev, coords }));
      setInitialCenter({ lat: coords.lat, lng: coords.lng });
      currentCenterRef.current = { lat: coords.lat, lng: coords.lng };
      setLocationView('confirm');
    } finally {
      setGeocoding(false);
    }
  };

  const handleConfirmAddress = () => {
    const finalCoords = currentCenterRef.current ?? (data.coords ? { lat: data.coords.lat, lng: data.coords.lng } : null);
    if (finalCoords && data.coords) {
      setData((prev) => ({ ...prev, coords: { ...prev.coords!, lat: finalCoords.lat, lng: finalCoords.lng } }));
    }
    setLocationView('privacy');
  };

  const handleEditAddress = () => {
    setData((prev) => ({ ...prev, coords: null }));
    setInitialCenter(null);
    currentCenterRef.current = null;
    setLocationView('form');
  };

  const handleFinish = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { error } = await saveOnboarding({
        display_name: data.display_name,
        bio: data.bio,
        school_name: data.school_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender as 'male' | 'female' | 'other',
        profile_photo_url: data.profile_photo_url,
        lat: data.coords?.lat ?? 0,
        lng: data.coords?.lng ?? 0,
      });
      if (error) {
        setSaveError(error);
        return;
      }
      router.push('/feed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[486px]">
      <StepIndicator current={step} />

      {/* Step 1 — Identity */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); next(); }} className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-col flex-1 overflow-y-auto px-1 pb-2 animate-fade-up min-h-0">
            <StepHeader
              title="What should we call you?"
              subtitle="This is what your neighbors will see."
            />
            <div className="flex flex-col flex-1 min-h-0 gap-5">
              <div>
                <label className={LABEL}>Display Name</label>
                <input
                  className={FIELD}
                  placeholder="e.g. Alex Kim"
                  value={data.display_name}
                  onChange={set('display_name')}
                  required
                />
              </div>
              <div className="flex flex-col flex-1 min-h-0">
                <label className={LABEL}>Bio</label>
                <textarea
                  className={cn(FIELD, 'resize-none flex-1 min-h-[80px]')}
                  placeholder="Tell your neighbors a bit about yourself…"
                  value={data.bio}
                  onChange={set('bio')}
                />
              </div>
            </div>
          </div>
          <ButtonBar>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Continue
            </Button>
          </ButtonBar>
        </form>
      )}

      {/* Step 2 — Community context */}
      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); next(); }} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-1 pb-2 animate-fade-up">
            <StepHeader
              title="A bit more about you"
              subtitle="This information is private and only visible to you."
            />
            <div className="space-y-5">
              <UniversityCombobox
                value={data.school_name}
                onChange={(val) => setData((prev) => ({ ...prev, school_name: val }))}
                schools={schools}
              />
              <div>
                <label className={LABEL}>Birthday</label>
                <input
                  className={FIELD}
                  type="date"
                  value={data.date_of_birth}
                  onChange={set('date_of_birth')}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <SelectField label="Gender">
                <select
                  className={cn(FIELD, 'appearance-none pr-10')}
                  value={data.gender}
                  onChange={set('gender')}
                  required
                >
                  <option value="" disabled>Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </SelectField>
            </div>
          </div>
          <ButtonBar>
            <Button type="button" variant="secondary" size="lg" className="w-full" onClick={back}>Back</Button>
            <Button type="submit" variant="primary" size="lg" className="w-full">Continue</Button>
          </ButtonBar>
        </form>
      )}

      {/* Step 3 — Location (address form) */}
      {step === 3 && locationView === 'form' && (
        <form onSubmit={handleAddressContinue} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-1 pb-2 animate-fade-up">
            <StepHeader
              title="Where are you located?"
              subtitle="Help neighbors find you. You can update this later."
            />
            <div className="space-y-5">
              <div>
                <label className={LABEL}>Street Address</label>
                <input
                  className={FIELD}
                  placeholder="e.g. 123 Main St"
                  value={data.street}
                  onChange={set('street')}
                  required
                />
              </div>
              <div>
                <label className={LABEL}>City</label>
                <input
                  className={FIELD}
                  placeholder="e.g. Seattle"
                  value={data.city}
                  onChange={set('city')}
                  required
                />
              </div>
              <div className="flex gap-3">
                <SelectField label="State" className="flex-1">
                  <select
                    className={cn(FIELD, 'appearance-none pr-10')}
                    value={data.state}
                    onChange={set('state')}
                    required
                  >
                    <option value="" disabled>State</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </SelectField>
                <div className="w-36 shrink-0">
                  <label className={LABEL}>ZIP Code</label>
                  <input
                    className={FIELD}
                    placeholder="e.g. 98101"
                    value={data.zip}
                    onChange={set('zip')}
                    maxLength={5}
                    pattern="\d{5}"
                    required
                  />
                </div>
              </div>
              {geocodeError && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{geocodeError}</p>
              )}
            </div>
          </div>
          <ButtonBar>
            <Button type="button" variant="secondary" size="lg" className="w-full" onClick={back}>Back</Button>
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={geocoding}>Continue</Button>
          </ButtonBar>
        </form>
      )}

      {/* Step 3 — Location (map confirmation) */}
      {step === 3 && locationView === 'confirm' && data.coords && initialCenter && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-1 pb-2 animate-fade-up">
            <StepHeader
              title="Pin your location"
              subtitle="Move the map until the pin is on your address."
            />
            <div className="relative overflow-hidden rounded-2xl border border-nu-border">
              {mapLoaded ? (
                <>
                  <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={initialCenter}
                    zoom={17}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                      clickableIcons: false,
                      gestureHandling: 'greedy',
                    }}
                    onLoad={onMapLoad}
                    onCenterChanged={onCenterChanged}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                  />
                  <DraggablePin lifted={isDragging} />
                </>
              ) : (
                <div className="flex items-center justify-center bg-nu-elevated" style={MAP_CONTAINER_STYLE}>
                  <span className="text-sm text-nu-dim">Loading map…</span>
                </div>
              )}
            </div>
          </div>
          <ButtonBar>
            <Button variant="secondary" size="lg" className="w-full" onClick={handleEditAddress}>Back</Button>
            <Button variant="primary" size="lg" className="w-full" onClick={handleConfirmAddress}>Confirm</Button>
          </ButtonBar>
        </div>
      )}

      {/* Step 3 — Location (privacy preview) */}
      {step === 3 && locationView === 'privacy' && data.coords && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-1 pb-2 animate-fade-up">
            <StepHeader
              title="Your privacy on the map"
              subtitle={
                <>
                  Neighbors see you as{' '}
                  <span className="font-semibold text-nu-text">~1 mile away</span>.{' '}
                  Your exact address stays private.
                </>
              }
            />
            <div className="overflow-hidden rounded-2xl border border-nu-border">
              {mapLoaded ? (
                <GoogleMap
                  mapContainerStyle={PRIVACY_MAP_STYLE}
                  center={{ lat: data.coords.lat, lng: data.coords.lng }}
                  zoom={12}
                  options={{
                    disableDefaultUI: true,
                    gestureHandling: 'none',
                    clickableIcons: false,
                    zoomControl: false,
                  }}
                >
                  <Circle
                    center={{ lat: data.coords.lat, lng: data.coords.lng }}
                    radius={1600}
                    options={{
                      fillColor: '#2563EB',
                      fillOpacity: 0.12,
                      strokeColor: '#2563EB',
                      strokeOpacity: 0.5,
                      strokeWeight: 2,
                    }}
                  />
                </GoogleMap>
              ) : (
                <div className="flex items-center justify-center bg-nu-elevated" style={PRIVACY_MAP_STYLE}>
                  <span className="text-sm text-nu-dim">Loading map…</span>
                </div>
              )}
            </div>
          </div>
          <ButtonBar>
            <Button variant="secondary" size="lg" className="w-full" onClick={handleEditAddress}>Back</Button>
            <Button variant="primary" size="lg" className="w-full" onClick={() => { setLocationView('form'); next(); }}>Got it</Button>
          </ButtonBar>
        </div>
      )}

      {/* Step 4 — Photo */}
      {step === 4 && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-col flex-1 overflow-y-auto px-1 pb-2 animate-fade-up items-center justify-center gap-6">
            <AvatarUpload
              src={data.profile_photo_url}
              name={data.display_name || 'You'}
              size="2xl"
              onUploaded={(url) => setData((prev) => ({ ...prev, profile_photo_url: url }))}
            />
            <div className="text-center">
              <h2 className="mb-1 font-display font-bold text-nu-text" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.25rem)' }}>Add a profile photo</h2>
              <p className="text-nu-muted" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}>Help your neighbors recognize you. Builds trust!</p>
              <p className="mt-1.5 text-xs text-nu-dim">Tap the avatar to upload</p>
            </div>
            {saveError && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 text-center">{saveError}</p>
            )}
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="text-sm text-nu-muted hover:text-nu-blue transition-colors underline-offset-2 hover:underline disabled:opacity-50"
            >
              Skip for now
            </button>
          </div>
          <ButtonBar>
            <Button variant="secondary" size="lg" className="w-full" onClick={back} disabled={saving}>Back</Button>
            <Button variant="primary" size="lg" className="w-full" onClick={handleFinish} loading={saving}>Get Started</Button>
          </ButtonBar>
        </div>
      )}
    </div>
  );
}
