import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const normalizeEmail = (value) => (value || '').trim().toLowerCase();

const deriveNameFromEmail = (email) => {
  const e = normalizeEmail(email);
  const local = e.split('@')[0] || '';
  const cleaned = local.replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [appointments, setAppointments] = useState([]);
  const [usersByEmail, setUsersByEmail] = useState({});

  const clearSession = () => {
    setUser(null);
    setAppointments([]);
  };

  const login = (userData) => {
    // Prevent data leakage across accounts in this mock app
    setAppointments([]);
    const email = normalizeEmail(userData?.email);
    const existing = (email && usersByEmail[email]) || null;
    const name =
      userData?.name?.trim?.() ||
      existing?.name?.trim?.() ||
      deriveNameFromEmail(email) ||
      'Guest';
    setUser({ ...existing, ...userData, email, name });
  };

  const signUp = (userData) => {
    const email = normalizeEmail(userData?.email);
    const name = (userData?.name || '').trim();
    const next = { email, name };
    setUsersByEmail((prev) => ({ ...prev, [email]: next }));
    login(next);
  };

  const logout = () => {
    clearSession();
  };

  const bookAppointment = (appointment) => {
    setAppointments((prev) => [...prev, { ...appointment, id: Date.now().toString() }]);
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, appointments, bookAppointment, cancelAppointment }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);