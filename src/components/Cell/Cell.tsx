import React, { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";
import { ICellData } from "./../Spreadsheet";

interface ICell {
  cellData: ICellData;
  onBlur?: (event: React.FocusEvent) => void;
  onChange: (newValue: string) => void;
  onClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onCopy?: () => void;
  onCut?: () => void;
  onDoubleClick?: () => void;
  onDrag?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragStart?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragEnter?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLInputElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseMove?: () => void;
  onMouseOver?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onPaste?: () => void;
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
      onMouseMove,
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
        onMouseMove={onMouseMove}
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
  border: none;
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

  ::selection {
    background-color: #27f939;
    color: #260526;
  }
`;
