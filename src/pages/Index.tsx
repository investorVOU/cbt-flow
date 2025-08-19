import { Navigate } from 'react-router-dom';

// Redirect to landing page since it's the main entry point
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
