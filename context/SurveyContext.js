import React, { createContext, useState, useContext } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

const SurveyContext = createContext();

export const SurveyProvider = ({ children }) => {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeMode] = useState(systemScheme || 'light');
  
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [studentDetails, setStudentDetails] = useState({
    name: 'Rishab Chandgothia',
    id: '108713',
    className: 'SEM-3',
    course: 'React Native Mobile App Dev',
    email: 'rishab.chandgothia@college.edu',
    project: 'Smart-Field-Survey',
    year: '2026'
  });

  const [surveys, setSurveys] = useState([]);

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
        studentDetails,
        setStudentDetails,
        surveys,
        setSurveys,
        currentSurvey,
        updateCurrentSurvey,
        resetCurrentSurvey,
        submitSurvey,
        deleteSurvey,
        themeMode,
        toggleTheme
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveys = () => useContext(SurveyContext);
