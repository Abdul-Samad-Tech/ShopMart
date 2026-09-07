import PremiumSpinner from './PremiumSpinner';

const Loader = ({ label = 'Loading', size = 'md', fullScreen = false }) => (
  <PremiumSpinner label={label} size={size} fullScreen={fullScreen} />
);

export default Loader;
