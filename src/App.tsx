import styled from "styled-components";
import Spreadsheet from "./components/Spreadsheet";

function App() {
  return (
    <div>
      <H1>Spreadsheet</H1>
      <Spreadsheet />
    </div>
  );
}

export default App;

const H1 = styled.h1`
  font-size: 2em;
  font-weight: bold;
  margin: 20px;
  color: #149820;
`;
