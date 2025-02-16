import { Navigate, useRoutes } from 'react-router-dom';
// 正确的导入方式
import Main from '../pages/Main';
import CreateTask from '../pages/Main/CreateTask';
import Welcome from '../pages/Welcome';
import WelcomeHeader from '../pages/Welcome/WelcomeHeader';
import Login from '../pages/Login';
import Register from '../pages/Register';
import User from '../pages/User';
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
    path: "*",
    element: <Welcome />,
  },
]);
return element;
};

export default RenderRouter;