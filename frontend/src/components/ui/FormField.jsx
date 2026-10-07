const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  autoComplete,
  className = '',
}) => (
  <div className={className}>
    <label className="label" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="input"
    />
  </div>
);

export default FormField;
