// assets
import { IconKey, IconUsers, IconBuilding, IconFileText, IconReport } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconUsers,
  IconBuilding,
  IconFileText,
  IconReport
};

// 👇 function to get user safely
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const user = getUser();
const role = user?.role || null;

// ==============================|| ADMIN MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  caption: 'Admin Panel',
  type: 'group',
  children: [
    {
      id: 'admin',
      title: 'Admin',
      type: 'collapse',
      icon: icons.IconUsers,
      children: [
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/admin/users',
          icon: icons.IconUsers,
          roles: ['admin'] // 👈 only admin
        },
        {
          id: 'clients',
          title: 'Clients',
          type: 'item',
          url: '/admin/clients',
          icon: icons.IconBuilding,
          roles: ['admin', 'manager'] // 👈 admin + manager
        },
        {
          id: 'templates',
          title: 'Report Templates',
          type: 'item',
          url: '/admin/templates',
          icon: icons.IconFileText,
          roles: ['admin', 'analyst'] // 👈 admin + analyst
        },
        {
          id: 'report-types',
          title: 'Report Types',
          type: 'item',
          url: '/admin/report-types',
          icon: icons.IconReport,
          roles: ['admin']
        }
      ]
    }
  ]
};

// 🔹 Filter menu based on role
pages.children = pages.children
  .map(group => {
    if (group.children) {
      group.children = group.children.filter(item =>
        !item.roles || item.roles.includes(role)
      );
    }
    return group;
  })
  .filter(group => group.children && group.children.length > 0);

export default pages;