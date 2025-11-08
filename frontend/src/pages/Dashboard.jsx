import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';
import Profile from '../components/dashboard/Profile';
import MyMods from '../components/dashboard/MyMods';
import CreateMod from '../components/dashboard/CreateMod';
import EditMod from '../components/dashboard/EditMod';
import RequestMod from '../components/mods/RequestMod';
import ManageCategories from '../components/dashboard/ManageCategories';
import ManageUsers from '../components/dashboard/ManageUsers';
import ManageGames from '../components/dashboard/ManageGames';
import AdminMods from '../components/dashboard/AdminMods';
import AdminRequests from '../components/dashboard/AdminRequests';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* User Routes */}
        <Route path="/my-mods" element={<MyMods />} />
        <Route path="/create-mod" element={<CreateMod />} />
        <Route path="/edit-mod/:id" element={<EditMod />} />
        <Route path="/request-mods" element={<RequestMod />} />
        
        {/* Admin Only Routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/categories" element={<ManageCategories />} />
            <Route path="/users" element={<ManageUsers />} />
            <Route path="/games" element={<ManageGames />} />
            <Route path="/admin-mods" element={<AdminMods />} />
            <Route path="/admin-requests" element={<AdminRequests />} />
          </>
        )}
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;