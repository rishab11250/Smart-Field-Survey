import React, { createContext, useState, useContext } from 'react';

const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
  const [surveys, setSurveys] = useState([
    {
      id: 'SRV-1001',
      siteName: 'Metro Station Area A',
      clientName: 'City Transit Corp',
      description: 'Foundation integrity inspection and concrete density check.',
      priority: 'High',
      date: '2026-07-15',
      photoUri: null,
      photoTime: null,
      location: { latitude: 37.7749, longitude: -122.4194, accuracy: 12.5 },
      contact: { name: 'John Doe', phoneNumber: '+1-555-0199' },
      notes: 'Initial cracks detected on support pillar 4B.'
    },
    {
      id: 'SRV-1002',
      siteName: 'Greenwood Solar Farm',
      clientName: 'EcoPower Solutions',
      description: 'Solar panel angle alignment and inverter status review.',
      priority: 'Medium',
      date: '2026-07-17',
      photoUri: null,
      photoTime: null,
      location: { latitude: 34.0522, longitude: -118.2437, accuracy: 8.2 },
      contact: { name: 'Jane Smith', phoneNumber: '+1-555-0144' },
      notes: 'All systems functioning within optimal temperature ranges.'
    }
  ]);

  const [currentSurvey, setCurrentSurvey] = useState({
    siteName: '',
    clientName: '',
    description: '',
    priority: 'Medium',
    date: new Date().toISOString().split('T')[0],
    photoUri: null,
    photoTime: null,
    location: null,
    contact: null,
    notes: ''
  });

  const updateCurrentSurvey = (fields) => {
    setCurrentSurvey((prev) => ({
      ...prev,
      ...fields
    }));
  };

  const resetCurrentSurvey = () => {
    setCurrentSurvey({
      siteName: '',
      clientName: '',
      description: '',
      priority: 'Medium',
      date: new Date().toISOString().split('T')[0],
      photoUri: null,
      photoTime: null,
      location: null,
      contact: null,
      notes: ''
    });
  };

  const submitSurvey = () => {
    const newSurvey = {
      ...currentSurvey,
      id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: currentSurvey.date || new Date().toISOString().split('T')[0]
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    resetCurrentSurvey();
    return newSurvey;
  };

  const deleteSurvey = (id) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SurveyContext.Provider
      value={{
        surveys,
        setSurveys,
        currentSurvey,
        updateCurrentSurvey,
        resetCurrentSurvey,
        submitSurvey,
        deleteSurvey
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveys = () => useContext(SurveyContext);
