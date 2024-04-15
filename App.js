import React from 'react';
import { StatusBar } from 'react-native';
import { Navigation } from './src/component/Navigation';
import { AuthProvider } from './src/context/AuthContext';

export const App = () => {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#1a3210" />
      <Navigation />
    </AuthProvider>
  );
};

export default App;