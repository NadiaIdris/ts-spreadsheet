import { useCallback } from "react";
import styled from "styled-components";

interface ICell {
  columnIdx: number;
  isEditing: boolean | undefined;
  isSelected: boolean | undefined;
  onChange: (newValue: string) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  onDoubleClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  rowIdx: number;
  value: string | undefined;
}

const Cell = ({
  columnIdx,
  isEditing,
  isSelected,
  onChange,
  onClick,
  onDoubleClick,
  onKeyDown,
  rowIdx,
  value,
}: ICell) => {
  const onChangeHander = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      onClick(event);
    },
    [onClick]
  );

  const onDoubleClickHandler = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      onDoubleClick(event);
    },
    [onDoubleClick]
  );

  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown(event);
    },
    [onKeyDown]
  );

  return (
    <OneCell
      data-columnidx={columnIdx}
      onChange={onChangeHander}
      data-rowidx={rowIdx}
      onClick={onClickHandler}
      onDoubleClick={onDoubleClickHandler}
      onKeyDown={onKeyDownHandler}
      readOnly={isEditing ? false : true}
      value={value}
    />
  );
};

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
