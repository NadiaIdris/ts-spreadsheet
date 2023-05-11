import styled from "styled-components";

interface ICell {
  isSelected: boolean;
  isEditing: boolean;
  value: string;
}

const Cell = () => {
  return <OneCell></OneCell>;
};

export default Cell;
export type { ICell };

const OneCell = styled.input`
  border: 1px solid lightgray;
  max-width: 100%;
  min-width: 20px;
  padding: 5px;

  &:focus {
    border-radius: 5px;
    outline: 2px solid green;
    z-index: 10;
  }
`;
