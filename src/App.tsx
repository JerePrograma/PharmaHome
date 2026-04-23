import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BackupPage } from './pages/BackupPage';
import { DetallePage } from './pages/DetallePage';
import { FormPage } from './pages/FormPage';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nuevo" element={<FormPage />} />
        <Route path="/editar/:id" element={<FormPage />} />
        <Route path="/medicamento/:id" element={<DetallePage />} />
        <Route path="/backup" element={<BackupPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
