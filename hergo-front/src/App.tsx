import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Existing pages
import HomePage from './pages/acceuil/HomePage';
import AuthPage from './pages/auth/AuthPage';
import LogementsPage from './pages/logements/LogementsPage';

// Voyageur pages
import LogementDetailPage from './pages/voyageur/LogementDetailPage';
import ProfilPage from './pages/voyageur/ProfilPage';
import MesReservationsPage from './pages/voyageur/MesReservationsPage';
import ReservationPage from './pages/reservations/ReservationPage';
import ReservationConfirmationPage from './pages/voyageur/ReservationConfirmationPage';
import ReservationDetailsPage from './pages/voyageur/ReservationDetailsPage';
import NotificationsPage from './pages/voyageur/NotificationsPage';
import AvisPage from './pages/voyageur/AvisPage';
import SettingsPage from './pages/voyageur/SettingsPage';

// Hôte pages
import HoteDashboardPage from './pages/hote/HoteDashboardPage';
import AjouterLogementPage from './pages/hote/AjouterLogementPage';
import ModifierLogementPage from './pages/hote/ModifierLogementPage';
import MesLogementsPage from './pages/hote/MesLogementsPage';
import ReservationsRecuesPage from './pages/hote/ReservationsRecuesPage';
import CalendrierPage from './pages/hote/CalendrierPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import GestionUtilisateursPage from './pages/admin/GestionUtilisateursPage';
import GestionLogementsPage from './pages/admin/GestionLogementsPage';
import ValidationLogementsPage from './pages/admin/ValidationLogementsPage';
import StatistiquesPage from './pages/admin/StatistiquesPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import type { UserRole } from './hooks/useAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/connexion" element={<AuthPage defaultTab="connexion" />} />
        <Route path="/inscription" element={<AuthPage defaultTab="inscription" />} />
        <Route path="/logements" element={<LogementsPage />} />
        <Route path="/logements/:id" element={<LogementDetailPage />} />

        {/* Voyageur pages (protégées) */}
        <Route path="/profil" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <ProfilPage />
          </ProtectedRoute>
        } />
        <Route path="/mes-reservations" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <MesReservationsPage />
          </ProtectedRoute>
        } />
        <Route path="/reservation" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <ReservationPage />
          </ProtectedRoute>
        } />
        <Route path="/reservation/confirmation" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <ReservationConfirmationPage />
          </ProtectedRoute>
        } />
        <Route path="/mes-reservations/:id" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <ReservationDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="/avis/:id" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <AvisPage />
          </ProtectedRoute>
        } />
        <Route path="/parametres" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <SettingsPage />
          </ProtectedRoute>
        } />

        {/* Hôte pages (protégées) */}
        <Route path="/hote/dashboard" element={
          <ProtectedRoute allowedRoles={['Hôte']}>
            <HoteDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/hote/ajouter" element={
          <ProtectedRoute allowedRoles={['Hôte']}>
            <AjouterLogementPage />
          </ProtectedRoute>
        } />
        <Route path="/hote/modifier/:id" element={
          <ProtectedRoute allowedRoles={['Hôte']}>
            <ModifierLogementPage />
          </ProtectedRoute>
        } />
        <Route path="/hote/mes-logements" element={
          <ProtectedRoute allowedRoles={['Hôte']}>
            <MesLogementsPage />
          </ProtectedRoute>
        } />
        <Route path="/hote/reservations" element={
          <ProtectedRoute allowedRoles={['Hôte']}>
            <ReservationsRecuesPage />
          </ProtectedRoute>
        } />
        <Route path="/hote/calendrier" element={
          <ProtectedRoute allowedRoles={['Hôte']}>
            <CalendrierPage />
          </ProtectedRoute>
        } />

        {/* Admin pages (protégées) */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/utilisateurs" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <GestionUtilisateursPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/logements" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <GestionLogementsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/validation" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ValidationLogementsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/statistiques" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <StatistiquesPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
