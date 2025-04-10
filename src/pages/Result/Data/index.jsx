import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import Bili from './Bili'
import Molecule from './Molecule'
import DataTable from './DataTable'
import Reaction from './Reaction'
import Picture from './Picture'

// const heTabs = ({key}) => <Tabs defaultActiveKey={key} items={items} onChange={onChange} size='large' />;
function DataTabs() {

  const items = [
    {
      key: '1',
      label: '著录数据',
      children: <Bili activeTab="bibliographic"/>,
    },
    {
      key: '2',
      label: '分子',
      children: <Molecule activeTab="molecular"/>,
    },
    {
      key: '3',
      label: '表格',
      children: <DataTable activeTab="table"/>,
    },
    {
        key: '4',
        label: '合成反应',
        children: <Reaction activeTab="reaction" />,
      },
      {
        key: '5',
        label: '图片',
        children: <Picture activeTab="picture" />,
      },

  ];
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabBarStyle={{
          borderBottom: '2px solid #f0f2f5', // 类似图表坐标轴样式
          marginBottom: 24
        }}
      />
    </div>
  )
}
export default DataTabs;