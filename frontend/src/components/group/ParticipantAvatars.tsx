import Avatar from '@/components/ui/Avatar';

interface Participant {
  name: string;
  avatar?: string;
}

interface ParticipantAvatarsProps {
  participants: Participant[];
}

export default function ParticipantAvatars({ participants }: ParticipantAvatarsProps) {
  const maxShown = 5;
  const shown = participants.slice(0, maxShown);
  const overflow = participants.length - maxShown;

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          <Avatar src={p.avatar} name={p.name} size="sm" />
        </div>
      ))}
      {overflow > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-600">
          +{overflow}
        </div>
      )}
    </div>
  );
}
