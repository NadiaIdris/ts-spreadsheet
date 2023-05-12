import styled from "styled-components";
import Spreadsheet from "./components/Spreadsheet";
import { useState } from "react";

function App() {
  const [heading, setHeading] = useState("Spreadsheet");
  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeading(e.target.value);
  };
  return (
    <div>
      <H1
        value={heading}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleHeadingChange(event)
        }
      />
      <Spreadsheet />
    </div>
  );
}

export default App;

const H1 = styled.input`
  font-size: 2em;
  font-weight: bold;
  margin: 20px;
  color: #149820;
  border: none;
  outline: none;
`;
