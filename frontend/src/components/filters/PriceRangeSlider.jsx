import { useCallback, useEffect, useState } from 'react';

const PriceRangeSlider = ({ min = 0, max = 500, value, onChange }) => {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const emit = useCallback(
    (next) => {
      setLocal(next);
      onChange(next);
    },
    [onChange]
  );

  const handleMin = (e) => {
    const v = Math.min(Number(e.target.value), local[1] - 1);
    emit([v, local[1]]);
  };

  const handleMax = (e) => {
    const v = Math.max(Number(e.target.value), local[0] + 1);
    emit([local[0], v]);
  };

  const pct = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="relative h-2 rounded-full bg-line">
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-brand to-accent"
          style={{
            left: `${pct(local[0])}%`,
            right: `${100 - pct(local[1])}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={local[0]}
          onChange={handleMin}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-chrome [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-rest"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={local[1]}
          onChange={handleMax}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-rest"
        />
      </div>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">${local[0]}</span>
        <span className="text-ink-muted">—</span>
        <span className="font-medium">${local[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
