import { Navigate, useRoutes } from 'react-router-dom';
// 正确的导入方式
import Main from '../pages/Main';
import CreateTask from '../pages/Main/CreateTask';
import Welcome from '../pages/Welcome';       //欢迎界面
import WelcomeHeader from '../pages/Welcome/WelcomeHeader';
import Login from '../pages/Login';           //登录界面
import Register from '../pages/Register';     //注册界面
import User from '../pages/User';          //用户界面
import Layout from '../pages/Home/Layout';    //任务中心布局界面
import Home from '../pages/Home';             //任务中心介绍界面
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
    path: "/main",
    element: <Main />,
    children:[
        {
            path: "createTask",
            element: <  CreateTask />,
        }
    ]
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
    path: "*",
    element: <Welcome />,
  },
]);
return element;
};

export default RenderRouter;