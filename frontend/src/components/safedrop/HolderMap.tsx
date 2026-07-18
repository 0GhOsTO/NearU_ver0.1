import { MapPin } from 'lucide-react';

export default function HolderMap() {
  return (
    <div className="flex h-56 items-center justify-center rounded-2xl bg-nu-elevated border border-nu-border">
      <div className="text-center text-nu-dim">
        <MapPin className="mx-auto h-10 w-10 mb-2" />
        <p className="text-sm font-medium">Map view coming soon</p>
        <p className="text-xs mt-1">Real map integration is backend work</p>
      </div>
    </div>
  );
}
