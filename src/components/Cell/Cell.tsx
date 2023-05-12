import styled from "styled-components";

interface ICell {
  columnIdx: number;
  isEditing: boolean;
  isSelected: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  onDoubleClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  rowIdx: number;
  value: string;
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
  return (
    <OneCell
      data-columnidx={columnIdx}
      onChange={onChange}
      data-rowidx={rowIdx}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
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

  &:focus {
    border-radius: 2px;
    outline: 2px solid var(--color-text-cell);
    outline-offset: -2px;
    z-index: 10;
    color: var(--color-white);
  }
`;
