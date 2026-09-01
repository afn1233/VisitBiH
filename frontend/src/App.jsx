import { useAuthStore } from './store/useAuthStore';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';

export default function App() {
  const token = useAuthStore((s) => s.token);
  return token ? <Dashboard /> : <Welcome />;
}
