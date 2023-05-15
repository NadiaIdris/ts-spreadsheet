import React, { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";

interface ICell {
  columnIdx: number;
  isEditing: boolean | undefined;
  isSelected: boolean | undefined;
  onBlur: () => void;
  onChange: (newValue: string) => void;
  onClick: () => void;
  onDoubleClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
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
      onDoubleClick,
      onKeyDown,
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
        onBlur={onBlur}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
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
  border-right: 1px solid var(--color-border-spreadsheet);
  border-bottom: 1px solid var(--color-border-spreadsheet);
  border-left: 1px solid transparent;
  border-top: 1px solid transparent;
  max-width: 100%;
  min-width: 20px;
  padding: 5px;
  color: var(--color-text-cell-not-focused);
  transition: background-color 0.1s ease-in-out;

  &:focus {
    background-color: var(--color-hover-cell);
    border-radius: 2px;
    outline: 2px solid var(--color-text-cell);
    outline-offset: -2px;
    z-index: 10;
    color: var(--color-white);
  }

  &:hover {
    cursor: pointer;
    background-color: var(--color-hover-cell);
  }
`;
