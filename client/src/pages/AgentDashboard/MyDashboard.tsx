import { Route, Routes } from 'react-router-dom';
import { AgentDashboard } from './AgentDashboard';
import { Agreement } from '../Agreement/Agreement';
import { AllProperties } from './AllProperties';
import { Matches as SystemMatches } from './Matches';
import React from 'react';

export const MyDashboard = () => {
  return (
    <Routes>
      <Route path='/' element={<AgentDashboard />} />
      <Route path='/contracts' element={<Agreement />} />
      <Route path='/agent-property' element={<AllProperties />} />
      <Route path='/agent-matches' element={<SystemMatches />} />
    </Routes>
  );
};
