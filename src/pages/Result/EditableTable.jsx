import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Popover, message } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  UndoOutlined,
  SaveOutlined,
  MoreOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import resultstyles from './result.module.scss';

const token = localStorage.getItem('token');

// 解析 HTML 表格
const parseHTML = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const table = doc.querySelector('table');

  if (!table) return { columns: [], dataSource: [] };

  // 提取表头
  const headerRow = table.querySelector('tr');
  const headerCells = Array.from(headerRow.querySelectorAll('td, th'));

  // 生成 columns
  const columns = headerCells.map((cell, index) => ({
    title: cell.textContent.trim(),
    dataIndex: `col${index}`,
    key: `col${index}`,
  }));

  // 提取数据行
  const bodyRows = Array.from(table.querySelectorAll('tr')).slice(1);
  const dataSource = bodyRows.map((row, rowIndex) => {
    const rowData = { key: rowIndex };
    Array.from(row.querySelectorAll('td')).forEach((cell, colIndex) => {
      rowData[`col${colIndex}`] = cell.textContent.trim();
    });
    return rowData;
  });

  return { columns, dataSource };
};

const normalizeSmiles = (text) => {
  const strText = String(text || 'null');

  if (strText.startsWith('$SMILES$') && strText.endsWith('$/SMILES$')) {
    const smiles = strText
      .replace('$SMILES$', '')
      .replace('$/SMILES$', '')
      .replace(/[*.]/g, '');
    return smiles;
  }
  return strText;
};

const EditableCell = ({ value, record, dataIndex, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || 'null');

  const handleSave = () => {
    onSave(inputValue);
    setEditing(false);
  };

  return editing ? (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onPressEnter={handleSave}
      onBlur={handleSave}
      autoFocus
    />
  ) : (
    <div onClick={() => setEditing(true)}>{value || 'null'}</div>
  );
};

const EditableHeaderCell = ({ title, dataIndex, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title || 'null');

  const handleSave = () => {
    onSave(inputValue);
    setEditing(false);
  };

  return editing ? (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onPressEnter={handleSave}
      onBlur={handleSave}
      autoFocus
    />
  ) : (
    <div onClick={() => setEditing(true)}>{title || 'null'}</div>
  );
};

const EditableTable = ({ htmlString, tableId,mergeTable  }) => {
  const [tableData, setTableData] = useState({ columns: [], dataSource: [] });
  const [history, setHistory] = useState([]);
  const [showMolecule, setShowMolecule] = useState(false);

  useEffect(() => {
    const { columns, dataSource } = parseHTML(htmlString);
    setTableData({ columns, dataSource });
  }, [htmlString]);


// 修改合并逻辑的 useEffect
useEffect(() => {
  if (mergeTable) {
    console.log('合并逻辑触发'); // 调试日志

    // 解析合并的表格（保留表头）
    const parseMergedTable = (htmlString) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const table = doc.querySelector('table');

      return {
        columns: Array.from(table?.querySelectorAll('th') || []).map((th, index) => ({
          title: th.textContent.trim(),
          dataIndex: `col${index}`,
          key: `col${index}`
        })),
        dataSource: Array.from(table?.querySelectorAll('tbody tr') || []).map((row, rowIndex) => {
          const rowData = { key: rowIndex + tableData.dataSource.length };
          Array.from(row.querySelectorAll('td')).forEach((cell, colIndex) => {
            rowData[`col${colIndex}`] = cell.textContent.trim();
          });
          return rowData;
        })
      };
    };

    const mergedData = parseMergedTable(mergeTable);

    // 校验列数是否一致
    if (tableData.columns.length !== mergedData.columns.length) {
      message.error('表格列数不一致，无法合并');
      return;
    }
    console.log('合并的数据：', mergedData);

    // 合并数据
    setTableData((prevState) => {
      const newState = {
        columns: prevState.columns, // 保留原表头
        dataSource: [...prevState.dataSource, ...mergedData.dataSource]
      };
      console.log('合并后的数据：', newState); // 在回调中打印更新后的状态
      return newState;
    });

    // 保存历史状态
    saveStateToHistory();
  }
}, [mergeTable]);
  const saveStateToHistory = () => {
    setHistory([...history, tableData]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setTableData(previousState);
      setHistory(history.slice(0, -1));
    } else {
      message.warning('没有更多历史记录可以撤回');
    }
  };

  const handleSave = async () => {
    try {
      const tableHtml = generateHtmlFromTableData(tableData);
      const response = await fetch('/api/form/updateHTML', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          id: tableId,
          html: tableHtml,
        }),
      });

      if (response.ok) {
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请重试！');
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/form/html/${tableId}`, { // 使用模板字符串动态传递 id
        method: 'DELETE', // 修改为 DELETE 方法
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          token: token,
        },
      });
  
      if (response.ok) {
        message.success('删除成功');
        // 可选：删除成功后刷新表格数据
        setTableData({ columns: [], dataSource: [] });
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请重试！');
    }
  };
  const generateHtmlFromTableData = (tableData) => {
    const { columns, dataSource } = tableData;
    const header = columns.map((col) => `<th>${col.title}</th>`).join('');
    const rows = dataSource
      .map((row) => {
        const cells = columns.map((col) => `<td>${row[col.dataIndex]}</td>`).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');
    return `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
  };

  const handleAddRow = (rowIndex) => {
    const newRow = tableData.columns.reduce((row, column) => {
      row[column.dataIndex] = 'null';
      return row;
    }, { key: tableData.dataSource.length });
    const newDataSource = [
      ...tableData.dataSource.slice(0, rowIndex),
      newRow,
      ...tableData.dataSource.slice(rowIndex),
    ];
    setTableData({
      ...tableData,
      dataSource: newDataSource,
    });
    saveStateToHistory();
  };

  const handleDeleteRow = (rowIndex) => {
    if (tableData.dataSource.length > 1) {
      const newDataSource = tableData.dataSource.filter((_, index) => index !== rowIndex);
      setTableData({
        ...tableData,
        dataSource: newDataSource,
      });
      saveStateToHistory();
    } else {
      message.warning('至少保留一行');
    }
  };

  const handleAddColumn = (colIndex) => {
    const newColumn = {
      title: `Column ${tableData.columns.length + 1}`,
      dataIndex: `col${tableData.columns.length}`,
      key: `col${tableData.columns.length}`,
    };
    const newColumns = [
      ...tableData.columns.slice(0, colIndex + 1),
      newColumn,
      ...tableData.columns.slice(colIndex + 1),
    ];
    const newDataSource = tableData.dataSource.map((row) => {
      const newRow = { ...row };
      newRow[newColumn.dataIndex] = 'null';
      return newRow;
    });
    setTableData({
      columns: newColumns,
      dataSource: newDataSource,
    });
    saveStateToHistory();
  };

  const handleDeleteColumn = (colIndex) => {
    if (tableData.columns.length > 1) {
      const newColumns = tableData.columns.filter((_, index) => index !== colIndex);
      const newDataSource = tableData.dataSource.map((row) => {
        const newRow = { ...row };
        delete newRow[tableData.columns[colIndex].dataIndex];
        return newRow;
      });
      setTableData({
        columns: newColumns,
        dataSource: newDataSource,
      });
      saveStateToHistory();
    } else {
      message.warning('至少保留一列');
    }
  };

  const handleSaveHeader = (dataIndex, value) => {
    const newColumns = tableData.columns.map((col) => {
      if (col.dataIndex === dataIndex) {
        return { ...col, title: value };
      }
      return col;
    });
    setTableData({
      ...tableData,
      columns: newColumns,
    });
    saveStateToHistory();
  };

  const handleSaveCell = (rowIndex, dataIndex, value) => {
    const newDataSource = [...tableData.dataSource];
    newDataSource[rowIndex][dataIndex] = value || ''; // 保存空值
    setTableData({
      ...tableData,
      dataSource: newDataSource,
    });
    saveStateToHistory();
  };

  const toggleRenderMode = () => {
    setShowMolecule(!showMolecule);
  };
  

  const columns = [
    ...tableData.columns.map((column, colIndex) => ({
      ...column,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <EditableHeaderCell
            title={column.title}
            dataIndex={column.dataIndex}
            onSave={(value) => handleSaveHeader(column.dataIndex, value)}
          />
          <Popover
            content={
              <div>
                <Button icon={<PlusOutlined />} onClick={() => handleAddColumn(colIndex)}>
                  在此列左侧添加列
                </Button>
                <Button icon={<MinusOutlined />} onClick={() => handleDeleteColumn(colIndex)}>
                  删除此列
                </Button>
              </div>
            }
            trigger="click"
          >
            <Button type="text" icon={<ColumnWidthOutlined />} />
          </Popover>
        </div>
      ),
      render: (text, record, rowIndex) => {
        const isSmiles = text && text.startsWith('$SMILES$') && text.endsWith('$/SMILES$');
        if (isSmiles && showMolecule) {
          const smiles = normalizeSmiles(text); // 格式化 SMILES
          return (
            <iframe
              src={`/index2.html?smiles=${encodeURIComponent(smiles)}`}
              width={120}
              height={100}
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
            />
          );
        }
        return (
          <EditableCell
            value={normalizeSmiles(text)}
            record={record}
            dataIndex={column.dataIndex}
            onSave={(value) => handleSaveCell(rowIndex, column.dataIndex, value)}
          />
        );
      },
    })),
    {
      title: '操作',
      key: 'action',
      // width: 100,
      render: (text, record, rowIndex) => (
        <Popover
          content={
            <div>
              <Button icon={<PlusOutlined />} onClick={() => handleAddRow(rowIndex)}>
                在上方添加行
              </Button>
              <Button icon={<MinusOutlined />} onClick={() => handleDeleteRow(rowIndex)}>
                删除此行
              </Button>
            </div>
          }
          trigger="click"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Popover>
      ),
    },
  ];

  return (
    <div>
      <div className={resultstyles.editbutton}>
        <Button onClick={toggleRenderMode}>
          {showMolecule ? '显示 SMILES' : '显示分子图'}
        </Button>
        <Button icon={<UndoOutlined />} onClick={handleUndo}>
          撤回
        </Button>
        <Button icon={<DeleteFilled />} onClick={handleDelete}>
          删除
        </Button>
        <Button icon={<SaveOutlined />} onClick={handleSave}>
          保存
        </Button>
      </div>
      <Table columns={columns} dataSource={tableData.dataSource} bordered pagination={false}/>
    </div>
  );
};

export default EditableTable;