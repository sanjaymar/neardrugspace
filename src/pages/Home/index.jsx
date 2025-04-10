// Home.jsx
import styles from "./home.module.scss";
import FeatureCard from "./component/FeatureCard";
import MoreFeatures from "./component/MoreFeatures";
import image1 from "../../assets/img/image1.png";
import image2 from "../../assets/img/image2.png";
import image3 from "../../assets/img/image3.png";
const Home = () => {
  const featureCardsData = [
    {
      title: "专制数据文献解析",
      listItems: [
        "实现对接采样与打分的CPU计算，速度提升500倍",
        "利用数据驱动+物理规律对所正的高精度复合物数据进行自动微分测试",
        "打分与筛选效果性能优于先前公开工具",
        "在多个项目数据上体现较好的相关性，支持指导分子筛选和优化"
      ],
      imageSrc: image1,
      to: "/task/tab" // 设置跳转路径
    },
    {
      title: "专利自动撰写",
      listItems: [
        "实现对接采样与打分的GPU计算，速度提升500倍",
        "利用数据驱动+物理规律对矫正的高精度复合物数据进行自动微分调优",
        "打分与筛选效果性能优于先前公开工具",
        "在多个项目数据上体现较好的相关性，支持指导分子筛选和优化",
      ],
      imageSrc: image2,
      to: "/patent" // 设置跳转路径
    },
    {
      title: "近药空间数据库",
      listItems: [
        "实现对接采样与打分的GPU计算，速度提升500倍",
        "利用数据驱动+物理规律对矫正的高精度复合物数据进行自动微分调优",
        "打分与筛选效果性能优于先前公开工具",
        "在多个项目数据上体现较好的相关性，支持指导分子筛选和优化",
      ],
      imageSrc: image3,
      to: "/data" // 设置跳转路径
    },
  ];

  return (
    <main className={styles.homecontainer}>
      <div className={styles.gridContainer}>
        {featureCardsData.map((data, index) => (
          <FeatureCard
            key={index}
            title={data.title}
            listItems={data.listItems}
            imageSrc={data.imageSrc}
            className={styles.featureCard}
            to = {data.to}
          />
        ))}
        <MoreFeatures className={styles.featureCard} />
      </div>
    </main>
  );
};

export default Home;