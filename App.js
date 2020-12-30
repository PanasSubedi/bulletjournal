import { StatusBar } from 'expo-status-bar';
import React from 'react';

import Drawer from './routes/drawer';
import initStorage from './helpers/initStorage';

export default function App() {

  initStorage();
  return (
    <>
      <Drawer />
      <StatusBar style="auto" />
    </>
  );
}
