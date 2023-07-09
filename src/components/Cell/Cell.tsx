import React, { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";

interface ICell {
  columnIdx: number;
  isEditing: boolean | undefined;
  isSelected: boolean | undefined;
  onBlur: () => void;
  onChange: (newValue: string) => void;
  onClick: () => void;
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
        onChange={onChangeHander}
        data-rowidx={rowIdx}
        draggable={false}
        onBlur={onBlur}
        onClick={onClick}
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
  max-width: 100%;
  min-width: 20px;
  padding: 5px;
  color: var(--color-text-cell-not-focused);
  transition: background-color 0.1s ease-in-out;

  &:focus {
    outline: 3px solid transparent;
    outline-offset: -2px;
  }

  &:hover {
    cursor: default;
    background-color: var(--color-hover-cell);
  }
`;
