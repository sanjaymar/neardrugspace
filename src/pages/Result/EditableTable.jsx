import React, { useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  UndoOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import resultstyles from './index.module.scss';
const token = localStorage.getItem('token');
const parseHTML = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const table = doc.querySelector('table');

  if (!table) return { columns: [], dataSource: [] };

  // 获取表头行
  let headerRows = [];
  const thead = table.querySelector('thead');
  if (thead) {
    headerRows = Array.from(thead.querySelectorAll('tr'));
  } else {
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length > 0) headerRows.push(rows); // 默认第一行为表头
  }

  // 检查 headerRows 是否为空
  if (headerRows.length === 0) {
    return { columns: [], dataSource: [] };
  }

  // 处理表头
  const columns = [];
  const lastHeaderRow = headerRows[headerRows.length - 1];
  if (lastHeaderRow && lastHeaderRow.querySelectorAll) {
    let colIndex = 0;
    Array.from(lastHeaderRow.querySelectorAll('td, th')).forEach((cell) => {
      const colspan = parseInt(cell.getAttribute('colspan') || 1, 10);
      for (let i = 0; i < colspan; i++) {
        columns.push({
          title: cell.textContent.trim(),
          dataIndex: `col${colIndex}`,
          key: `col${colIndex}`,
        });
        colIndex++;
      }
    });
  }

  // 处理表体
  const bodyRows = table.querySelector('tbody')
    ? Array.from(table.querySelector('tbody').querySelectorAll('tr'))
    : Array.from(table.querySelectorAll('tr')).slice(headerRows.length);

  const dataSource = bodyRows.map((row, rowIndex) => {
    const rowData = { key: rowIndex };
    const cells = Array.from(row.querySelectorAll('td'));
    let currentColIndex = 0;

    cells.forEach((cell) => {
      const colspan = parseInt(cell.getAttribute('colspan') || 1, 10);
      const text = cell.textContent.trim();
      for (let i = 0; i < colspan; i++) {
        if (currentColIndex < columns.length) {
          rowData[`col${currentColIndex}`] = text;
          currentColIndex++;
        }
      }
    });

    for (let i = currentColIndex; i < columns.length; i++) {
      rowData[`col${i}`] = 'null'; // 初始化空值
    }

    return rowData;
  });

  return { columns, dataSource };
};

const normalizeSmiles = (text) => {
  // 确保 text 是字符串
  const strText = String(text || 'null');

  if (strText.startsWith('$SMILES$') && strText.endsWith('$/SMILES$')) {
    const smiles = strText
      .replace('$SMILES$', '')
      .replace('$/SMILES$', '')
      .replace(/[*.]/g, ''); // 去除 * 和 .
    return smiles;
  }
  return strText;
};

const EditableCell = ({ value, record, dataIndex, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || 'null'); // 处理空值

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
    <div onClick={() => setEditing(true)}>
      {value || 'null'} {/* 空值显示为空格 */}
    </div>
  );
};

const EditableHeaderCell = ({ title, dataIndex, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title || 'null'); // 处理空值

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
    <div onClick={() => setEditing(true)}>
      {title || 'null'} {/* 空值显示为空格 */}
    </div>
  );
};

const EditableTable = ({ htmlString, tableId  }) => {
  const [tableData, setTableData] = useState({ columns: [], dataSource: [] });
  const [history, setHistory] = useState([]);
  const [showMolecule, setShowMolecule] = useState(false); // 控制显示分子图或 SMILES

  useEffect(() => {
    const { columns, dataSource } = parseHTML(htmlString);
    setTableData({ columns, dataSource });
  }, [htmlString]);

  const saveStateToHistory = () => {
    setHistory([...history, tableData]); // 保存当前状态到历史记录
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1]; // 获取上一个状态
      setTableData(previousState); // 恢复到上一个状态
      setHistory(history.slice(0, -1)); // 移除最后一个历史记录
    }
  };

  const handleSave = async () => {
    try {
      // 生成修改后的 HTML
      const tableHtml = generateHtmlFromTableData(tableData); 
      // 使用从父组件传递的 tableId
      const response = await fetch('/api/form/updateHTML', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'token': token,
        },
        body: JSON.stringify({
          id: tableId, // 使用 tableId
          html: tableHtml, // 修改后的 HTML 数据
        }),
      });
  
      console.log('Response Status:', response.status); // 打印状态码
      console.log('Response OK:', response.ok); // 打印 response.ok
  
      if (response.ok) {
        message.success("保存成功"); // 使用 message 显示成功提示
      } else {
        message.error("保存失败"); // 修改为 message.error
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请重试！'); // 使用 message.error 提示用户
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

  const handleAddRow = () => {
    const newRow = tableData.columns.reduce((row, column) => {
      row[column.dataIndex] = 'null'; // 初始化空值
      return row;
    }, { key: tableData.dataSource.length });
    const newDataSource = [...tableData.dataSource, newRow];
    setTableData({
      ...tableData,
      dataSource: newDataSource,
    });
    saveStateToHistory();
  };

  const handleDeleteRow = () => {
    if (tableData.dataSource.length > 1) {
      const newDataSource = tableData.dataSource.slice(0, -1);
      setTableData({
        ...tableData,
        dataSource: newDataSource,
      });
      saveStateToHistory();
    }
  };

  const handleAddColumn = () => {
    const newColumn = {
      title: `Column ${tableData.columns.length + 1}`,
      dataIndex: `col${tableData.columns.length}`,
      key: `col${tableData.columns.length}`,
    };
    const newDataSource = tableData.dataSource.map((row) => ({
      ...row,
      [newColumn.dataIndex]: 'null', // 初始化空值
    }));
    setTableData({
      columns: [...tableData.columns, newColumn],
      dataSource: newDataSource,
    });
    saveStateToHistory();
  };

  const handleDeleteColumn = () => {
    if (tableData.columns.length > 1) {
      const newColumns = tableData.columns.slice(0, -1);
      const newDataSource = tableData.dataSource.map((row) => {
        const newRow = { ...row };
        delete newRow[tableData.columns[tableData.columns.length - 1].dataIndex];
        return newRow;
      });
      setTableData({
        columns: newColumns,
        dataSource: newDataSource,
      });
      saveStateToHistory();
    }
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

  const toggleRenderMode = () => {
    setShowMolecule(!showMolecule); // 切换显示模式
  };

  const columns = tableData.columns.map((column) => ({
    ...column,
    title: (
      <EditableHeaderCell
        title={column.title}
        dataIndex={column.dataIndex}
        onSave={(value) => handleSaveHeader(column.dataIndex, value)}
      />
    ),
    render: (text, record, index) => {
      // 检查是否需要渲染分子图
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
      // 否则返回普通文本
      return (
        <EditableCell
          value={normalizeSmiles(text)}
          record={record}
          dataIndex={column.dataIndex}
          onSave={(value) => handleSaveCell(index, column.dataIndex, value)}
        />
      );
    },
  }));

  return (
    <div>
      {/* 操作按钮 */}
      <div className={resultstyles.editbutton}>
        <Button icon={<PlusOutlined />} onClick={handleAddRow}>
          添加行
        </Button>
        <Button icon={<MinusOutlined />} onClick={handleDeleteRow}>
          删除行
        </Button>
        <Button icon={<ColumnWidthOutlined />} onClick={handleAddColumn}>
          添加列
        </Button>
        <Button icon={<ColumnHeightOutlined />} onClick={handleDeleteColumn}>
          删除列
        </Button>
        <Button onClick={toggleRenderMode}>
          {showMolecule ? '显示 SMILES' : '显示分子图'}
        </Button>
        <Button icon={<UndoOutlined />} onClick={handleUndo}>
          撤回
        </Button>
        <Button icon={<SaveOutlined />} onClick={handleSave}>
          保存
        </Button>

      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={tableData.dataSource}
        bordered
        pagination={false}
      />
    </div>
  );
};

export default EditableTable;