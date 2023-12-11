import type { Metadata } from 'next';
import AdminContent from './AdminContent';

export const metadata: Metadata = {
  title: 'Admin page',
  description: 'Admin page',
}

const Admin = () => (
    <div>
      <AdminContent />
    </div>
);

export default Admin;
