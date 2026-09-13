import { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type RoomHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children?: ReactNode;
};

export default function RoomHeader({
  title,
  subtitle,
  onBack,
  children,
}: RoomHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-lg border border-gray-700 bg-gray-800 p-2 text-gray-400 transition-all hover:border-amber-500 hover:text-amber-400"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <h1 className="font-serif text-3xl font-bold text-amber-400">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
