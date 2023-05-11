import styled from "styled-components";

interface CellHeaderProps {
  value: string;
}

const CellHeader = ({ value }: CellHeaderProps) => {
  return <OneCell readOnly type="text" value={value}></OneCell>;
};

export default CellHeader;

const OneCell = styled.input`
  border: 1px solid transparent;
  max-width: 100%;
  min-width: 20px;
  padding: 5px;
  text-align: center;

  &:focus {
    outline: none;
  }
`;
