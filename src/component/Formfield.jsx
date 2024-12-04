import React from 'react';
import classNames from 'classnames';

const FormField = ({ field, value, onChange, error }) => {
  const { name, type, label, required, options } = field;

  const inputClasses = classNames(
    'mt-1 block w-full rounded-md border p-2',
    'focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
    {
      'border-red-500': error,
      'border-gray-300': !error
    }
  );

  const renderField = () => {
    switch (type) {
      case 'dropdown':
        return (
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            className={inputClasses}
            required={required}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'password':
        return (
          <input
            type="password"
            name={name}
            value={value || ''}
            onChange={onChange}
            className={inputClasses}
            required={required}
            autoComplete="off"
          />
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={inputClasses}
            required={required}
            autoComplete="off"
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;