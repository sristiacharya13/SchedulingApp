import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [appointments, setAppointments] = useState([]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const bookAppointment = (appointment) => {
    setAppointments([...appointments, { ...appointment, id: Date.now().toString() }]);
  };

  const cancelAppointment = (id) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, appointments, bookAppointment, cancelAppointment }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);