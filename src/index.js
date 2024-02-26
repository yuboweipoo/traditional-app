// index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PrescriptionManagement from './PrescriptionManagement';
import './styles.css';
import herbData from './data';

const App = () => {
  const [herbsData, setHerbsData] = useState([]);

  useEffect(() => {
    // 将导入的中草药数据赋值给状态
    setHerbsData(herbData);
  }, []);

  return (
    <div>
      {/* <HerbManagement herbsData={herbsData} setHerbsData={setHerbsData} /> */}
      <PrescriptionManagement herbsData={herbsData} setHerbsData={setHerbsData} />
    </div>
  );
};

const root = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(<App />);
