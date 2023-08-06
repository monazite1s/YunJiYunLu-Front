import type { RouteRecordRaw } from 'vue-router';
import { view, rInf, IModule } from './type';

const ms: Record<string, any> = import.meta.glob(['../view/**/*.{vue,ts}'], {
  eager: true,
});
const modules: IModule = {}; //模块对象

//将文件结构整理成对象，去除不需要的文件模块
Object.keys(ms).forEach((item) => {
  const names = item.split('/').splice(1, Infinity);
  const componentName = (names.pop() as string).split('.')[0].toLowerCase();
  let MoudelType: typeof view | typeof rInf;
  if (names.some((item, index) => item === names[index + 1])) return;
  const routerName = names.slice(-1)[0] as string;
  if (componentName === routerName) {
    MoudelType = view;
  } else if (componentName === 'r') {
    MoudelType = rInf;
  } else {
    return;
  }
  const lowest = names.reduce<IModule>((upper, name) => {
    return upper[name] ? upper[name] : (upper[name] = {});
  }, modules);
  lowest[MoudelType] = ms[item].default;
  return;
});

let routes: Array<RouteRecordRaw> = [];
const OToR = (obj: IModule, routes: Array<RouteRecordRaw>, name = '') => {
  let route: RouteRecordRaw = {
    path: name,
    name,
    component: obj[view],
    children: [],
  };
  if (obj[rInf]) {
    obj[rInf].children?.forEach((rout: RouteRecordRaw) => {
      route.children?.push(rout);
    });
    delete obj[rInf].children;
  }
  route = Object.assign(route, obj[rInf]);
  routes.push(route);
  Object.keys(obj).forEach((item) => {
    OToR(obj[item], route.children as RouteRecordRaw[], item);
  });
};
OToR(modules, routes);
routes = routes[0].children as unknown as RouteRecordRaw[];

export default routes;
