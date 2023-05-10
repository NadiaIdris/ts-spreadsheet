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
  border: 1px solid black;
  max-width: 100%;
  min-width: 20px;
`;
