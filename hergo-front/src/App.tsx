import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './core/i18n'; // initialize i18n

// Existing pages
import WelcomePage from './pages/acceuil/WelcomePage';
import HomePage from './pages/acceuil/HomePage';
import AuthPage from './pages/auth/AuthPage';
import LogementsPage from './pages/logements/LogementsPage';

// Voyageur pages
import LogementDetailPage from './pages/voyageur/LogementDetailPage';
import VoyageurDashboardPage from './pages/voyageur/VoyageurDashboardPage';
import FavorisPage from './pages/voyageur/FavorisPage';
import ProfilPage from './pages/voyageur/ProfilPage';
import MesReservationsPage from './pages/voyageur/MesReservationsPage';
import ReservationPage from './pages/reservations/ReservationPage';
import ReservationConfirmationPage from './pages/voyageur/ReservationConfirmationPage';
import ReservationDetailsPage from './pages/voyageur/ReservationDetailsPage';
import NotificationsPage from './pages/voyageur/NotificationsPage';
import AvisPage from './pages/voyageur/AvisPage';
import SettingsPage from './pages/voyageur/SettingsPage';
import ReclamationsPage from './pages/voyageur/ReclamationsPage';

// Hôte pages
import HoteDashboardPage from './pages/hote/HoteDashboardPage';
import AjouterLogementPage from './pages/hote/AjouterLogementPage';
import ModifierLogementPage from './pages/hote/ModifierLogementPage';
import MesLogementsPage from './pages/hote/MesLogementsPage';
import ReservationsRecuesPage from './pages/hote/ReservationsRecuesPage';
import CalendrierPage from './pages/hote/CalendrierPage';
import HoteProfilPage from './pages/hote/HoteProfilPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import GestionUtilisateursPage from './pages/admin/GestionUtilisateursPage';
import GestionLogementsPage from './pages/admin/GestionLogementsPage';
import ValidationLogementsPage from './pages/admin/ValidationLogementsPage';
import StatistiquesPage from './pages/admin/StatistiquesPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#252019',
            color: '#f0ebe3',
            border: '1px solid rgba(201, 165, 112, 0.25)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#c9a570', secondary: '#1c1917' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/accueil" element={<HomePage />} />
        <Route path="/connexion" element={<AuthPage defaultTab="connexion" />} />
        <Route path="/inscription" element={<AuthPage defaultTab="inscription" />} />
        <Route path="/logements" element={<LogementsPage />} />
        <Route path="/logements/:id" element={<LogementDetailPage />} />

        {/* Voyageur pages (protégées) */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <VoyageurDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/favoris" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <FavorisPage />
          </ProtectedRoute>
        } />
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
        <Route path="/reservation/:id" element={
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
        <Route path="/reclamations" element={
          <ProtectedRoute allowedRoles={['Voyageur']}>
            <ReclamationsPage />
          </ProtectedRoute>
        } />

        {/* Hôte pages (protégées) */}
        <Route path="/hote/dashboard" element={
          <ProtectedRoute allowedRoles={['Hôte']}>
            <HoteDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/hote/profil" element={
          <ProtectedRoute allowedRoles={['Hôte']}>
            <HoteProfilPage />
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
