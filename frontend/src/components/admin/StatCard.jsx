const StatCard = ({ label, value, sub, icon: Icon }) => (
  <div className="admin-glass p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/70 mb-2">{label}</p>
        <p className="text-3xl font-display font-semibold">{value}</p>
        {sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
      </div>
      {Icon && (
        <div className="p-3 rounded-xl bg-white/10 text-primary-200">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
