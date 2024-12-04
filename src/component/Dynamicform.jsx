import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormField from './Formfield';
import ProgressBar from './Progress';
import DataTable from './Datatable';
import { formTypes, mockApiResponse } from '../data/Api';

const DynamicForm = () => {
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState({
    userInfo: [],
    address: [],
    payment: []
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (formType) {
      setFormData({});
      setErrors({});
      calculateProgress();
    }
  }, [formType]);

  const calculateProgress = () => {
    if (!formType) return setProgress(0);
    
    const fields = mockApiResponse[formType].fields;
    const requiredFields = fields.filter(field => field.required);
    const filledRequiredFields = requiredFields.filter(field => 
      formData[field.name] && formData[field.name].toString().trim() !== ''
    );
    
    const newProgress = (filledRequiredFields.length / requiredFields.length) * 100;
    setProgress(newProgress || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For ZIP code, only allow numbers and hyphen
    // if (name === 'zipCode') {
    //   // Allow only numbers and hyphen
    //   if (!/^[\d-]*$/.test(value)) {
    //     return;
    //   }
    // }

    // // For card number, only allow numbers
    // if (name === 'cardNumber') {
    //   if (!/^\d*$/.test(value)) {
    //     return;
    //   }
    //   if (value.length > 16) {
    //     return;
    //   }
    // }

    // // For CVV, only allow numbers
    // if (name === 'cvv') {
    //   if (!/^\d*$/.test(value)) {
    //     return;
    //   }
    //   if (value.length > 4) {
    //     return;
    //   }
    // }

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    calculateProgress();
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = mockApiResponse[formType].fields;

    fields.forEach(field => {
      const value = formData[field.name];
      const trimmedValue = value ? value.toString().trim() : '';

      if (field.required && !trimmedValue) {
        newErrors[field.name] = `${field.label} is required`;
      }

    //   if (trimmedValue) {
    //     switch (field.name) {
    //       case 'zipCode':
    //         const zipRegex = /^\d{5}(-\d{4})?$/;
    //         if (!zipRegex.test(trimmedValue)) {
    //           newErrors[field.name] = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    //         }
    //         break;
    //       case 'cardNumber':
    //         if (trimmedValue.length !== 16) {
    //           newErrors[field.name] = 'Card number must be 16 digits';
    //         }
    //         break;
    //       case 'cvv':
    //         if (trimmedValue.length < 3 || trimmedValue.length > 4) {
    //           newErrors[field.name] = 'CVV must be 3 or 4 digits';
    //         }
    //         break;
    //       case 'state':
    //         if (!field.options.includes(trimmedValue)) {
    //           newErrors[field.name] = 'Please select a valid state';
    //         }
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    const cleanedData = {
      ...Object.keys(formData).reduce((acc, key) => {
        acc[key] = formData[key].trim();
        return acc;
      }, {}),
      formType: formType
    };

    setSubmittedData(prev => ({
      ...prev,
      [formType]: [...prev[formType], cleanedData]
    }));
    
    setFormData({});
    setErrors({});
    setProgress(0);
    toast.success('Form submitted successfully!');
  };

  const handleEdit = (formType, index) => {
    const dataToEdit = submittedData[formType][index];
    setFormType(formType);
    setFormData({ ...dataToEdit });
    setSubmittedData(prev => ({
      ...prev,
      [formType]: prev[formType].filter((_, i) => i !== index)
    }));
    calculateProgress();
    toast.info('Entry ready for editing');
  };

  const handleDelete = (formType, index) => {
    setSubmittedData(prev => ({
      ...prev,
      [formType]: prev[formType].filter((_, i) => i !== index)
    }));
    toast.success('Entry deleted successfully');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
      />
      
      <h1 className="text-3xl font-bold text-center mb-8">Dynamic Form</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Form Type
        </label>
        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          className="w-full p-2 border rounded-md border-gray-300"
        >
          <option value="">Select a form type</option>
          {formTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {formType && (
        <>
          <ProgressBar progress={progress} />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mockApiResponse[formType].fields.map(field => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                error={errors[field.name]}
              />
            ))}
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </>
      )}

      {Object.entries(submittedData).map(([type, data]) => (
        data.length > 0 && (
          <div key={type} className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              {formTypes.find(t => t.id === type)?.label} Submissions
            </h2>
            <DataTable
              data={data}
              onEdit={(index) => handleEdit(type, index)}
              onDelete={(index) => handleDelete(type, index)}
            />
          </div>
        )
      ))}
    </div>
  );
};

export default DynamicForm;