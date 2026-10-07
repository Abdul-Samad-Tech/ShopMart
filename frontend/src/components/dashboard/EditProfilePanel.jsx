import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { updateUserProfile } from '../../store/authSlice';
import { updateProfile } from '../../store/userSlice';
import FormField from '../ui/FormField';
import AvatarPicker from './AvatarPicker';

const EditProfilePanel = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', avatar: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = await dispatch(
        updateProfile({ name: form.name.trim(), avatar: form.avatar })
      ).unwrap();
      dispatch(updateUserProfile({ name: payload.name, avatar: payload.avatar, email: payload.email }));
      toast.success('Profile updated');
      setOpen(false);
    } catch (err) {
      toast.error(err || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-premium p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center text-2xl font-display font-semibold text-luxury-charcoal shadow-gold-glow overflow-hidden">
            {form.avatar ? (
              <img src={form.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h2 className="font-display text-xl">{user?.name}</h2>
            <p className="text-sm text-luxury-muted">{user?.email}</p>
          </div>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="btn-outline !py-2.5 !px-6 !text-xs">
          {open ? 'Close' : 'Edit Profile'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden border-t border-luxury-line pt-6 space-y-4"
          >
            <AvatarPicker
              value={form.avatar}
              onChange={(avatar) => setForm((prev) => ({ ...prev, avatar }))}
              name={form.name || user?.name}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Full name" name="name" value={form.name} onChange={handleChange} required />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="opacity-60 pointer-events-none"
              />
            </div>
            <p className="text-xs text-luxury-muted">Email is tied to your account and cannot be changed here.</p>
            <button type="submit" disabled={saving} className="btn-premium !text-xs">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfilePanel;
