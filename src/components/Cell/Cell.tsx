import styled from "styled-components";

interface ICell {
  columnIdx: number;
  isEditing: boolean;
  isSelected: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowIdx: number;
  value: string;
}

const Cell = ({
  columnIdx,
  isEditing,
  isSelected,
  onChange,
  rowIdx,
  value,
}: ICell) => {
  return (
    <OneCell
      data-columnidx={columnIdx}
      onChange={onChange}
      data-rowidx={rowIdx}
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

  &:focus {
    border-radius: 5px;
    outline: 2px solid var(--color-text-cell);
    z-index: 10;
    color: 
  }
`;
