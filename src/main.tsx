import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';

import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 35,
        mass: 0.8,
      }}
    >
      <App />
    </MotionConfig>
  </StrictMode>,
);