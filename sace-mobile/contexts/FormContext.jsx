import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openFormWithArea = (area) => {
    setSelectedArea(area);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedArea(null);
  };

  return (
    <FormContext.Provider value={{ selectedArea, showForm, openFormWithArea, closeForm }}>
      {children}
    </FormContext.Provider>
  );
};


