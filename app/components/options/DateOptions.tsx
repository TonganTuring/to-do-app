interface DateOptionsProps {
  onSelect: (dateOption: string) => void;
}

export default function DateOptions({ onSelect }: DateOptionsProps) {
  const dateOptions = [
    'today',
    'tomorrow',
    'next week',
    'next month',
    'weekend'
  ];

  return (
    <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg z-50">
      {dateOptions.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
        >
          {option}
        </button>
      ))}
    </div>
  );
} 