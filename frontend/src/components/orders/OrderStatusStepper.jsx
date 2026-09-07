const STEPS = [
  { key: 'pending', label: 'Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const OrderStatusStepper = ({ status }) => {
  if (status === 'cancelled') {
    return <p className="text-xs text-red-500 capitalize">Cancelled</p>;
  }

  const order = STEPS.map((s) => s.key);
  const currentIdx = Math.max(0, order.indexOf(status));

  return (
    <ol className="flex items-center gap-1 mt-2">
      {STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <li key={step.key} className="flex items-center gap-1 flex-1 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                done ? (active ? 'bg-mart-orange animate-pulse' : 'bg-mart-green') : 'bg-luxury-line dark:bg-white/20'
              }`}
              title={step.label}
            />
            {i < STEPS.length - 1 && (
              <span
                className={`h-px flex-1 ${i < currentIdx ? 'bg-mart-green/60' : 'bg-luxury-line dark:bg-white/10'}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default OrderStatusStepper;
