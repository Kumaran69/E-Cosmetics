import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiBox, FiMail, FiFileText, FiUsers, FiBookOpen } from 'react-icons/fi';

const links = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FiBox /> },
  { to: '/admin/blog', label: 'Blog', icon: <FiBookOpen /> },
  { to: '/admin/enquiries', label: 'Enquiries', icon: <FiMail /> },
  { to: '/admin/applications', label: 'Applications', icon: <FiFileText /> },
  { to: '/admin/customers', label: 'Customers', icon: <FiUsers /> },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {l.icon} {l.label}
          </NavLink>
        ))}
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
