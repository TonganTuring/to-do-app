interface DateOptionsProps {
  onSelect: (dateText: string) => void;
}

export default function DateOptions({ onSelect }: DateOptionsProps) {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 border border-gray-200 dark:border-gray-700 animate-fadeIn">
      <div className="text-sm text-white-500">
        Date Options:
        <div className="flex gap-2 mt-2 flex-wrap">
          {[
            ['Today', 'today'],
            ['Tomorrow', 'tomorrow'],
            ['Next Week', 'next week'],
            ['Next Month', 'next month'],
          ].map(([label, value]) => (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className="px-3 py-1.5 rounded-md bg-blue-600/70 hover:bg-blue-600/80 text-white transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 