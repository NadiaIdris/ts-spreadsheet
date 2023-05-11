import styled from "styled-components";

interface ICell {
  isEditing: boolean;
  isSelected: boolean;
  value: string;
}

const Cell = ({ isEditing, isSelected, value }: ICell) => {
  return <OneCell value={value}></OneCell>;
};

export default Cell;
export type { ICell };

const OneCell = styled.input`
  border: 1px solid var(--color-border-spreadsheet);
  max-width: 100%;
  min-width: 20px;
  padding: 5px;

  &:focus {
    border-radius: 5px;
    outline: 2px solid green;
    z-index: 10;
  }
`;
