import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';
import { ColumnDefinition } from '../types/Column';

interface TableControlsProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  size: string;
  onSizeChange: (size: string) => void;
  columns: ColumnDefinition[];
  visibleColumns: ColumnDefinition[];
  onColumnsChange: (columns: ColumnDefinition[]) => void;
  freezeFirstRow: boolean;
  onFreezeFirstRowChange: (freeze: boolean) => void;
}

export function TableControls({
  globalFilter,
  onGlobalFilterChange,
  size,
  onSizeChange,
  columns,
  visibleColumns,
  onColumnsChange,
  freezeFirstRow,
  onFreezeFirstRowChange
}: TableControlsProps) {
  const sizes = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' }
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
      <div className="flex gap-4 items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
          />
        </span>
        <Dropdown
          value={size}
          options={sizes}
          onChange={(e) => onSizeChange(e.value)}
          placeholder="Select Size"
        />
        <ToggleButton
          checked={freezeFirstRow}
          onChange={(e) => onFreezeFirstRowChange(e.value)}
          onLabel="Unfreeze First Row"
          offLabel="Freeze First Row"
          className="w-36"
        />
      </div>
      <MultiSelect
        value={visibleColumns}
        options={columns}
        optionLabel="header"
        onChange={(e) => onColumnsChange(e.value)}
        placeholder="Select Columns"
        className="w-72"
      />
    </div>
  );
}