import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './store/auth'
import { AppLayout } from './components/layout/AppLayout'
import LoginPage from './features/auth/LoginPage'
import DashboardPage from './features/dashboard/DashboardPage'
import OrdersPage from './features/orders/OrdersPage'
import ProductsPage from './features/products/ProductsPage'
import CategoriesPage from './features/categories/CategoriesPage'
import ProductionPage from './features/production/ProductionPage'
import PurchasesPage from './features/purchases/PurchasesPage'
import QuotesPage from './features/quotes/QuotesPage'
import CustomersPage from './features/customers/CustomersPage'
import ReportsPage from './features/reports/ReportsPage'
import SettingsPage from './features/settings/SettingsPage'

function Protected({ children }: { children: React.ReactNode }) {
  const token = useAuth((s) => s.accessToken)
  if (!token) return <Navigate to="/login" replace />
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Protected><DashboardPage /></Protected>} />
      <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
      <Route path="/products" element={<Protected><ProductsPage /></Protected>} />
      <Route path="/categories" element={<Protected><CategoriesPage /></Protected>} />
      <Route path="/production" element={<Protected><ProductionPage /></Protected>} />
      <Route path="/purchases" element={<Protected><PurchasesPage /></Protected>} />
      <Route path="/quotes" element={<Protected><QuotesPage /></Protected>} />
      <Route path="/customers" element={<Protected><CustomersPage /></Protected>} />
      <Route path="/reports" element={<Protected><ReportsPage /></Protected>} />
      <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
