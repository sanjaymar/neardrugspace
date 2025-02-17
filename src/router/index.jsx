import { Navigate, useRoutes } from 'react-router-dom';
// 正确的导入方式
import Welcome from '../pages/Welcome';       //欢迎界面
import WelcomeHeader from '../pages/Welcome/WelcomeHeader';
import Login from '../pages/Login';           //登录界面
import Register from '../pages/Register';     //注册界面
import User from '../pages/User';          //用户界面
import Layout from '../pages/Home/Layout';    //任务中心布局界面
import Home from '../pages/Home';             //任务中心介绍界面
import Layout2 from '../pages/Task/Layout2';  //任务中心布局界面2
import Task from '../pages/Task';
const RenderRouter = () => {
  const element = useRoutes([
    {
    path: '/',
    element: <Welcome />,
    children: [
      {
        index: true, // 设置为 index 表示这是默认子路由
        element: <WelcomeHeader />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/home",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/task",
    element: <Layout2 />,
    children: [
      {
        index: true,
        element: <Task />,
      },
      {
        path:'/task/results',
        element: <Task />,
      },
      {
        path:'/task/favorites',
        element: <Task />,
      }
    ],
  },
  {
    path: "*",
    element: <Welcome />,
  },
]);
return element;
};

export default RenderRouter;