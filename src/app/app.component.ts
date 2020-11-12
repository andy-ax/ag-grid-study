import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  gridOption = {
    // 设置可多选
    rowSelection: 'multiple',
    // 点击将直接选择复选框
    rowMultiSelectWithClick: true,
    // 点击将不再选中单元格(onCellClick事件依然调用)
    suppressCellSelection: true,
    // 可对不同的单元格设置不同的样式
    getRowStyle(params) {
      if (params.node.rowPinned) {
        return {
          'font-weight': 'bold',
          'color': 'red',
        };
      }
    }
  };
  // 行高
  rowHeight = 30;
  // 表头高度
  headerHeight = 30;
  text: string;
  value: string;
  x: number;
  y: number;
  rowIndex: number;
  private grid;

  columnDefs = [
    {
      headerName: '制造商',
      field: 'make',
      // 显示为复选框
      checkboxSelection: true,
      // 表头是否也显示复选框
      headerCheckboxSelection: true,
      width: 100,
      // 为true时用户点击列的表头可以进行排序
      sortable: false,
      // 列固定
      pinned: 'left'
    },
    {
      headerName: '模型',
      field: 'model',
    },
    {
      headerName: '价格',
      field: 'price',
      // 自定义排序函数，sortable必须为true
      comparator: this.priceComparator,
      sortable: true,
      // 列跨度 当返回>1时跨度
      colSpan(params) {
        if (params.data.price === params.data.history_max) {
          return 2;
        }
        return 1;
      }
    },
    {
      headerName: '历史最高价格',
      field: 'history_max',
      // 过滤器 包括 agNumberColumnFilter 数字过滤器、agTextColumnFilter 文本过滤器、agDateColumnFilter 日期过滤器
      filter: 'agNumberColumnFilter'
    },
    {
      headerName: '可使用',
      field: 'can_use',
      // 自定义函数,根据值进行处理
      valueFormatter: this.canUseMap
    },
  ];

  rowData = [
    {
      make: '大众',
      model: 'xxx',
      price: 51000,
      can_use: 1,
      history_max: 80000,
    },
    {
      make: 'Toyota',
      model: 'Celica',
      price: 35000,
      can_use: 0,
      history_max: 35000
    },
    {
      make: 'Ford',
      model: 'Mondeo',
      price: 32000,
      can_use: 1,
      history_max: 200000
    },
    {
      make: 'Porsche',
      model: 'Boxter',
      price: 72000,
      can_use: 1,
      history_max: 500000
    }
  ];
  rowData2 = [
    {
      make: 'Toyota',
      model: 'Celica',
      price: 35000,
      can_use: 0,
      history_max: 100000
    },
    {
      make: 'Ford',
      model: 'Mondeo',
      price: 32000,
      can_use: 1,
      history_max: 200000
    },
    {
      make: 'Porsche',
      model: 'Boxter',
      price: 72000,
      can_use: 1,
      history_max: 500000
    }
  ];

  // 固定在顶部的行
  pinnedTopRowData = [
    {
      make: '福特',
      model: 'Boxter',
      price: 20000,
      can_use: 1,
      history_max: 30000
    }
  ];

  // 固定在底部的行
  pinnedBottomRowData = [
    {
      price: 100000,
      history_max: 100000
    }
  ];

  constructor() {
  }

  // grid加载完毕
  onGridReady(grid) {
    // 自适应表格大小
    grid.api.sizeColumnsToFit();
    this.grid = grid;
    (<any>window).app = this;
    (<any>window).grid = grid;
  }

  // 单元格被点击
  onCellClick(cell) {
    // 获取选中数据
    const rows = this.grid.api.getSelectedRows();
  }

  // 设置列表高度
  setHeight(event, height) {
    // tslint:disable-next-line:radix
    this.rowHeight = parseInt(height);
    setTimeout(() => {
      this.grid.api.resetRowHeights();
    }, 0);
    const textNode = document.querySelector('#text');
    this.text = '';
  }

  priceComparator(price1, price2, node1, node2, type) {
    return price1 - price2;
  }

  // 重设表单数据
  resetRowData() {
    this.grid.api.setRowData(this.rowData2);
  };

  // 修改指定单元格的数据
  changeCellData(x, y, value) {
    const rowNode = this.grid.api.getRowNode(y);
    const columnKey = this.grid.api.columnController.allDisplayedColumns[x].colDef.field;
    const newRow = rowNode.data;
    newRow[columnKey] = value;
    rowNode.setData(newRow);
  }

  // 删除行数据
  removeRowData(index) {
    const rowNode = this.grid.api.getRowNode(index);
    this.grid.api.updateRowData({remove: [rowNode.data]});
  }

  // 新增行
  addRowData(data, addIndex) {
    const config: any = {
      add: [data],
    };
    if (!addIndex && addIndex !== 0) {
      config.addIndex = addIndex;
    }
    this.grid.api.updateRowData(config);
  }

  // 新增列
  addColumnData(data, colIndex) {
    this.columnDefs.push(data);
    this.grid.api.setColumnDefs(this.columnDefs);
    if (colIndex || colIndex === 0) {
      // 将指定索引的列移动
      // this.grid.columnApi.moveColumn(data.field, colIndex);
      // 另一种列移动的方法，从指定索引的位置移动到另一索引位置
      const len = this.columnDefs.length;
      this.grid.columnApi.moveColumnByIndex(len - 1, colIndex);
    }
  }

  // 全选、反选、按条件筛选、获取选中行数据
  gridSelect() {
    const api = this.grid.api;
    api.selectAll(); // 选择全部
    api.deselectAll(); // 反选
    api.selectAllFiltered(); // 按条件选择
    api.deselectAllFiltered(); // 按条件反选
    api.getSelectedRows(); // 获取选中行数据
  };

  private canUseMap(item) {
    if (item.value === 1) {
      return '可使用';
    } else if (item.value === 0) {
      return '不可使用';
    } else {
      return '';
    }
  }

}
