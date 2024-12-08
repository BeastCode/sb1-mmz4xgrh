import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSelectionChangeEvent, DataTableSortEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { ProductService } from '../services/ProductService';
import { Product } from '../types/Product';
import { ColumnDefinition } from '../types/Column';
import { TableControls } from './TableControls';
import { TextFilter } from './filters/TextFilter';
import { NumberFilter } from './filters/NumberFilter';
import { StatusFilter } from './filters/StatusFilter';
import { RatingFilter } from './filters/RatingFilter';
import { ExportButtons } from './ExportButtons';
import { useTableState } from '../hooks/useTableState';

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [frozenValue, setFrozenValue] = useState<Product[]>([]);
  const [freezeFirstRow, setFreezeFirstRow] = useState(false);
  
  const columns: ColumnDefinition[] = [
    { field: 'code', header: 'Code', width: '10%' },
    { field: 'name', header: 'Name', width: '20%' },
    { field: 'category', header: 'Category', width: '15%' },
    { field: 'price', header: 'Price', width: '15%' },
    { field: 'quantity', header: 'Quantity', width: '10%' },
    { field: 'inventoryStatus', header: 'Status', width: '15%' },
    { field: 'rating', header: 'Rating', width: '15%' }
  ];

  const { tableState, updateState } = useTableState(columns);
  
  const visibleColumns = columns.filter(col => 
    tableState.visibleColumns.includes(col.field)
  );

  useEffect(() => {
    ProductService.getProducts().then(data => {
      setProducts(data);
      if (freezeFirstRow && data.length > 0) {
        setFrozenValue([data[0]]);
      }
    });
  }, [freezeFirstRow]);

  const getSeverity = (status: string) => {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const priceBodyTemplate = (rowData: Product) => {
    return formatCurrency(rowData.price);
  };

  const ratingBodyTemplate = (rowData: Product) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData: Product) => {
    return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData.inventoryStatus)} />;
  };

  const onRowSelect = (event: DataTableSelectionChangeEvent) => {
    const selectedRow = event.data as Product;
    setFrozenValue([...frozenValue, selectedRow]);
  };

  const onRowUnselect = (event: DataTableSelectionChangeEvent) => {
    const unselectedRow = event.data as Product;
    setFrozenValue(frozenValue.filter(row => row.id !== unselectedRow.id));
  };

  const onSort = (event: DataTableSortEvent) => {
    updateState({
      sortField: event.sortField,
      sortOrder: event.sortOrder
    });
  };

  const onFilter = (field: string, value: any) => {
    updateState({
      filters: {
        ...tableState.filters,
        [field]: { value, matchMode: 'contains' }
      }
    });
  };

  const getTableSize = () => {
    switch (tableState.size) {
      case 'small':
        return 'p-datatable-sm';
      case 'large':
        return 'p-datatable-lg';
      default:
        return '';
    }
  };

  const renderFilter = (field: string) => {
    const value = tableState.filters[field]?.value;
    
    switch (field) {
      case 'price':
        return <NumberFilter field={field} value={value} onChange={(val) => onFilter(field, val)} />;
      case 'rating':
        return <RatingFilter field={field} value={value} onChange={(val) => onFilter(field, val)} />;
      case 'inventoryStatus':
        return <StatusFilter field={field} value={value} onChange={(val) => onFilter(field, val)} />;
      default:
        return <TextFilter field={field} value={value || ''} onChange={(val) => onFilter(field, val)} />;
    }
  };

  const renderColumn = (col: ColumnDefinition) => {
    const commonProps = {
      field: col.field,
      header: col.header,
      sortable: true,
      style: { width: col.width },
      filter: true,
      filterElement: () => renderFilter(col.field),
      showFilterMenu: false
    };

    switch (col.field) {
      case 'price':
        return <Column key={col.field} {...commonProps} body={priceBodyTemplate} />;
      case 'rating':
        return <Column key={col.field} {...commonProps} body={ratingBodyTemplate} />;
      case 'inventoryStatus':
        return <Column key={col.field} {...commonProps} body={statusBodyTemplate} />;
      default:
        return <Column key={col.field} {...commonProps} />;
    }
  };

  const handleFreezeFirstRowChange = (freeze: boolean) => {
    setFreezeFirstRow(freeze);
    if (freeze && products.length > 0) {
      setFrozenValue([products[0]]);
    } else {
      setFrozenValue([]);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <TableControls
          globalFilter={tableState.globalFilter}
          onGlobalFilterChange={(value) => updateState({ globalFilter: value })}
          size={tableState.size}
          onSizeChange={(size) => updateState({ size })}
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnsChange={(cols) => updateState({ 
            visibleColumns: cols.map(col => col.field) 
          })}
          freezeFirstRow={freezeFirstRow}
          onFreezeFirstRowChange={handleFreezeFirstRowChange}
        />
        <ExportButtons data={products} />
      </div>
      
      <DataTable
        value={products}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        scrollable
        scrollHeight="400px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: '50rem' }}
        globalFilter={tableState.globalFilter}
        filters={tableState.filters}
        sortField={tableState.sortField}
        sortOrder={tableState.sortOrder}
        onSort={onSort}
        emptyMessage="No products found."
        className={getTableSize()}
        reorderableColumns
        resizableColumns
        showGridlines
        frozenValue={frozenValue}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
        filterDisplay="row"
        removableSort
      >
        <Column selectionMode="multiple" frozen headerStyle={{ width: '3rem' }} />
        {visibleColumns.map(renderColumn)}
      </DataTable>
    </div>
  );
}