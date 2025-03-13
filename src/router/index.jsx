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
import Task from '../pages/Task';      //创建任务，收藏任务
import Task2 from '../pages/Task2';      //创建任务，收藏任务
import Task3 from '../pages/Task3';      //创建任务，收藏任务
import Layout3 from '../pages/MarkDown/Layout3';  //Markdown布局界面
import Markdown from '../pages/MarkDown';    //Markdown界面
import Layout4 from '../pages/Result/Layout4';  //文献提取结果布局界面
import Result from '../pages/Result';  //文献提取结果界面
import Search from '../pages/Search';  //编辑界面
import Edit from '../pages/Edit';  //编辑界面
import Reset from '../pages/Reset';  //忘记密码界面
import Usertop from '../pages/User/Usertop';  //用户界面
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
    path: "/markdown",
    element: <Layout3 />,
    children: [
      {
        path: ":id", // 支持动态参数 id
        element: <Markdown />,
      },
      {
        index: true,
        element:  <Task3 />
      },
      {
        path:'/markdown/results',
        element: <Task3 />,
      },
      {
        path:'/markdown/favorites',
        element: <Task3 />,
      }
    ],
  },
  {
    path: "/result",
    element: <Layout4 />,
    children: [
      {
        path: ":id", // 支持动态参数 id
        element: <Result />,
      },
      {
        index: true,
        element:  <Task2 />
      },
      {
        path:'/result/results',
        element: <Task2 />,
      },
      {
        path:'/result/favorites',
        element: <Task2 />,
      }
    ],
  },
  {
    path:"/edit",
    element: <Edit/>,
  },
  {
    path:"/search",
    element: <Search/>,
  },
  {
    path: '/reset',
    element: <Reset />,
  },
  {
    path: '/user',
    element: <Usertop />,
    children: [
      {
        index: true, // 设置为 index 表示这是默认子路由
        element: <User />,
      },
    ],
  },
  {
    path: "*",
    element: <Home />,
  },
]);
return element;
};

export default RenderRouter;