import React, { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";

interface ICell {
  columnIdx: number;
  isEditing: boolean | undefined;
  isSelected: boolean | undefined;
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
  onMouseDown: (event: React.MouseEvent<HTMLInputElement>) => void;
  onMouseOver: (event: React.MouseEvent<HTMLInputElement>) => void;
  onPaste: () => void;
  rowIdx: number;
  value: string | undefined;
}

const Cell = forwardRef(
  (
    {
      columnIdx,
      isEditing,
      isSelected,
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
      onPaste,
      rowIdx,
      value,
    }: ICell,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const onChangeHander = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };

    return (
      <OneCell
        data-columnidx={columnIdx}
        data-rowidx={rowIdx}
        draggable={true}
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

const OneCell = styled.input`
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
