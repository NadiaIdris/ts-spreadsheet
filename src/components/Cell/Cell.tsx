import React, { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";
import { ICellData } from "./../Spreadsheet";

interface ICell {
  cellData: ICellData;
  onBlur: () => void;
  onChange: (newValue: string) => void;
  onClick: (event: React.MouseEvent) => void;
  onContextMenu: (event: React.MouseEvent) => void;
  onCopy: () => void;
  onCut: () => void;
  onDoubleClick: () => void;
  onDrag?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragStart?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragEnter?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseOver: (event: React.MouseEvent<HTMLInputElement>) => void;
  onMouseUp: (event: React.MouseEvent<HTMLInputElement>) => void;
  onPaste: () => void;
}

const Cell = forwardRef(
  (
    {
      cellData,
      onBlur,
      onChange,
      onClick,
      onContextMenu,
      onCopy,
      onCut,
      onDoubleClick,
      onDrag,
      onDragEnd,
      onDragStart,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onFocus,
      onKeyDown,
      onMouseDown,
      onMouseOver,
      onMouseUp,
      onPaste,
    }: ICell,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { rowIdx, columnIdx, isEditing, isFocused, isSelected, value } =
      cellData;
    const onChangeHander = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };

    return (
      <CellStyled
        data-columnidx={columnIdx}
        data-rowidx={rowIdx}
        draggable={true}
        isFocused={isFocused}
        isSelected={isSelected}
        onBlur={onBlur}
        onChange={onChangeHander}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onCopy={onCopy}
        onCut={onCut}
        onDoubleClick={onDoubleClick}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragStart={onDragStart}
        onFocus={onFocus}
        onKeyDown={(event: any) => onKeyDown(event)}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        onPaste={onPaste}
        readOnly={isEditing ? false : true}
        ref={ref}
        value={value}
      />
    );
  }
);

export default Cell;
export type { ICell };

const CellStyled = styled.input<{ isFocused?: boolean; isSelected?: boolean }>`
  background-color: ${(props) => (props.isSelected ? "blue" : "")};
  border: 1px solid transparent;
  color: var(--color-text-cell-not-focused);
  max-width: 90px;
  min-width: 60px;
  width: 100%;

  &:focus {
    outline: 1px solid transparent;
  }

  &:hover {
    cursor: default;
  }
`;
