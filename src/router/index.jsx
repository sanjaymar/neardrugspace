import {  useRoutes } from 'react-router-dom';
// 正确的导入方式
import Welcome from '../pages/Welcome';       //欢迎界面
import WelcomeHeader from '../pages/Welcome/WelcomeHeader';
import Login from '../pages/Login';           //登录界面
import Register from '../pages/Register';     //注册界面
import User from '../pages/User';          //用户界面
import Layout from '../pages/components/AppLayout'  //登录后主界面布局
import Home from '../pages/Home';             //任务中心介绍界面
import Tabs from "../pages/components/Tabs"   //任务中心子导航布局
import Markdown from '../pages/MarkDown';    //Markdown界面
import Result from '../pages/Result';  //文献提取结果界面
import Edit from '../pages/Edit';  //编辑界面
import Reset from '../pages/Reset';  //忘记密码界面
import Usertop from '../pages/User/Usertop';  //用户界面
import Patents from '../pages/Patents'
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
      path: "/home",
      element: <Layout logo="PatMDAP" />,
      children: [
        {
          index: true,
          element: <Home />,
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
      path: "/task",
      element: <Layout logo="PatMDAP" />,
      children: [
        {
          path: "tab",
          element: <Tabs defaultActiveKey="1" />,

        }
      ]
    },

    {
      path: "/markdown",
      element: <Layout logo="数据文献提取结果" />,
      children: [
        {
          path: "tab",
          element: <Tabs defaultActiveKey="2" />,

        },
        {
          path: ":id", // 支持动态参数 id
          element: <Markdown />,
        }
      ]
    },
    {
      path: "/patents",
      element: <Layout logo="专利撰写结果" />,
      children: [
        {
          index: true,
          element: <Patents/>,

        }
      ]
    },
    {
      path: "/result",
      element: <Layout logo="数据文献提取结果" />,
      children: [
        {
          path: "tab",
          element: <Tabs defaultActiveKey="2" />,

        },
        {
          path: ":id", // 支持动态参数 id
          element: <Result />,
        },
        
      ],
    },
    {
      path: "/edit",
      element: <Edit />,
    },

    
    
    {
      path: "*",
      element: <Home />,
    },
  ]);
  return element;
};

export default RenderRouter;