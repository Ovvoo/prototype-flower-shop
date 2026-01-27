'use client';

interface CheckboxFilterProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}

export function CheckboxFilter({ label, value, checked, onChange }: CheckboxFilterProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer min-h-[44px] py-2 touch-manipulation hover:bg-gray-50 rounded-lg px-2 transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
