import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import routes from './autoImport';
import { useUserStore } from '@/store/user';

console.log('routes', routes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const user = useUserStore();

  if (!user.accessable(to.meta.role)) {
    if (!user.token) {
      return { name: 'start' };
    } else {
      return { name: 'home' };
    }
  }
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
