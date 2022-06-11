import HomePage from './pages/home';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: HomePage,
    exact: true,
  },
];

const privateRoutes = [
  {
    name: 'Home',
    path: '/',
    component: HomePage,
    exact: true,
  },
];

export { routes, privateRoutes };