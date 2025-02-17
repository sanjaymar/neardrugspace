// import React from 'react';
// import welcomestyles from './index.module.scss';

// function Welcome() {
//   // 假设你的图片在src文件夹下的assets/imgs文件夹中
//   const backgroundImages = [
//     'image1.png',
//     'image2.png',
//     'image3.png',
//     'image4.png',
//     'image5.png',
//     'image6.png',
//     'image7.png',
//   ];

//   const backgroundwelcomestyles = {
//     background: [
//       `url(./src/assets/imgs/home/${backgroundImages[0]}) no-repeat 1134px 103px`,
//       `url(./src/assets/imgs/home/${backgroundImages[1]}) no-repeat 1027px 270px`,
//       `url(./src/assets/imgs/home/${backgroundImages[2]}) no-repeat 1511px 21px`,
//       `url(./src/assets/imgs/home/${backgroundImages[3]}) no-repeat 792px 318px`,
//       `url(./src/assets/imgs/home/${backgroundImages[4]}) no-repeat 640px 682px`,
//       `url(./src/assets/imgs/home/${backgroundImages[5]}) no-repeat 1320px 670px`,
//       `url(./src/assets/imgs/home/${backgroundImages[6]}) no-repeat 1320px 752px`,
//     ].join(', '),
//     backgroundSize: [
//       '812px 960px', // 默认背景图片的大小
//       '413px 478px', // image2的大小
//       '210px 220px', // image3的大小
//       '352px 56px', // image4的大小
//       '488px 66px', // image5的大小
//       '464px 97px', // image2的大小
//       '464px 172px', // image2的大小
      
//     ].join(', '),
//     width: '100%',
//     height: '100vh', // 或者你需要的高度
//   };

//   return (
//     <div className={welcomestyles.container} style={backgroundwelcomestyles}>
//       <h1>PatMDAP助力高效准确深度解析数据科学文献</h1>
//       <p>与传统方法相比，使用PatMDAP，您可以在一小时内深度解析科学论文、专利等数据文献中的重要信息并构建一个小型知识图谱，显著提升工作效率。</p>
//       <button>立即体验</button>
//       <div className={welcomestyles.footer}>
//         <ul>
//           <li>☑高精度的分子结构识别</li>
//           <li>☑自动整合结构、活性数据和合成信息</li>
//           <li>☑同时处理数十篇专利</li>
//           <li>☑上传专利PDF即可得到结果</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Welcome;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 钩子
import welcomestyles from './index.module.scss';
import { Outlet } from 'react-router-dom';
function Welcome() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate(); // 使用 useNavigate 钩子获取 navigate 函数

  // 更新窗口大小时调整 state
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const toLogin = () => {
    navigate('/login');
  };

  return (
    <div className={welcomestyles.welcomecontainer} >
      <Outlet/>
      <div className={welcomestyles.home} >
      <h1>PatMDAP助力高效准确深度解析数据科学文献</h1>
      <p>
        与传统方法相比，使用PatMDAP，您可以在一小时内深度解析科学论文、专利等数据文献中的重要信息并构建一个小型知识图谱，显著提升工作效率。
      </p>
      <button className={welcomestyles.useButton} onClick={toLogin}>立即体验</button>
      <div className={welcomestyles.footer}>
        <ul>
          <li>☑高精度的分子结构识别</li>
          <li>☑自动整合结构、活性数据和合成信息</li>
          <li>☑同时处理数十篇专利</li>
          <li>☑上传专利PDF即可得到结果</li>
        </ul>
      </div>
    </div>
    </div>
  );
}

export default Welcome;
