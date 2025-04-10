import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import Results from '../../Task/Results';
import Task from '../../Task/Task'
import Collects from '../../Task/Collects'

// const heTabs = ({key}) => <Tabs defaultActiveKey={key} items={items} onChange={onChange} size='large' />;
function heTabs({ defaultActiveKey }) {

  const items = [
    {
      key: '1',
      label: '创建任务',
      children: <Task />,
    },
    {
      key: '2',
      label: '结果列表',
      children: <Results />,
    },
    {
      key: '3',
      label: '收藏列表',
      children: <Collects />,
    },

  ];
  return (
    <div>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        items={items}
        tabBarStyle={{
          borderBottom: '2px solid #f0f2f5', // 类似图表坐标轴样式
          marginBottom: 24
        }}
      />
    </div>
  )
}
export default heTabs;