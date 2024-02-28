import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Cricket from './components/Cricket';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <Cricket />
  // </React.StrictMode>
);