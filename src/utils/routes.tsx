import { RouteValue } from '../interfaces/interfaces';
import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import Home from '../pages/home/Home';
import Registration from '../pages/registration/Registration';
import EmpManagement from '../pages/employeemanagement/employeemanagement';
import AllEmp from '../pages/employeemanagement/allEmployees';
import formapplicationlist from '../pages/applicationForm/formapplication';
import Formapplicationlist from '../pages/applicationForm/formapplication';

const routes: RouteValue[] = [
  {
    path: '/',
    component: <Home />,
    isPrivate: true,
  },
  {
    path: '/signin',
    component: <Login />,
    isPrivate: false,
  },
  {
    path: '/signup',
    component: <Registration />,
    isPrivate: true,
  },
  {
    path: '/dashboard',
    component: <Dashboard />,
    isPrivate: true,
  },
  {
    path: '/employeeManagement',
    component: <EmpManagement />,
    isPrivate: true,
  },
  {
    path: '/allemp',
    component: <AllEmp />,
    isPrivate: true,
  },
  {
    path: '/allapplication',
    component: <Formapplicationlist />,
    isPrivate: true,
  },
];

export default routes;
