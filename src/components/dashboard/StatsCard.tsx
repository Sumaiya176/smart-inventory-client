// src/components/dashboard/StatsCard.tsx
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
}

export default function StatsCard({ title, value, icon: Icon, color, change }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from yesterday
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-full text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}