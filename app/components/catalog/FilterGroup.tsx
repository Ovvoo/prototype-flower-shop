'use client';

import { useState } from 'react';
import { CheckboxFilter } from './CheckboxFilter';

interface FilterGroupProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  defaultOpen?: boolean;
  maxVisible?: number;
}

export function FilterGroup({
  title,
  options,
  selectedValues,
  onChange,
  defaultOpen = false,
  maxVisible = 10,
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(v => v !== value));
    }
  };

  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 font-semibold text-left min-h-[44px] touch-manipulation"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="space-y-1 mt-2">
          {visibleOptions.map((option) => (
            <CheckboxFilter
              key={option}
              label={option}
              value={option}
              checked={selectedValues.includes(option)}
              onChange={handleCheckboxChange}
            />
          ))}

          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-sm text-pink-600 hover:text-pink-700 py-2 px-2 min-h-[44px] touch-manipulation"
            >
              Показать все ({options.length})
            </button>
          )}

          {showAll && hasMore && (
            <button
              onClick={() => setShowAll(false)}
              className="text-sm text-pink-600 hover:text-pink-700 py-2 px-2 min-h-[44px] touch-manipulation"
            >
              Скрыть
            </button>
          )}
        </div>
      )}
    </div>
  );
}
