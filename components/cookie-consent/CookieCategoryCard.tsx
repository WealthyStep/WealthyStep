import React from 'react';

interface CookieCategoryCardProps {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
}

export function CookieCategoryCard({
  id,
  name,
  description,
  required,
  enabled,
  onToggle,
}: CookieCategoryCardProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-3 transition-colors hover:border-gray-200">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[15px] text-navy tracking-tight">{name}</h4>
        
        {required ? (
          <span className="text-[11px] font-bold tracking-wide text-gray-500 uppercase px-2 py-1 bg-gray-100 rounded-md">
            Always Active
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={`Toggle ${name}`}
            onClick={() => onToggle(id, !enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 ${
              enabled ? 'bg-lime' : 'bg-gray-300'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                enabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        )}
      </div>
      <p className="text-[13px] text-gray-500 leading-relaxed pr-6">
        {description}
      </p>
    </div>
  );
}
