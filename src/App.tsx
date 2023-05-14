import styled from "styled-components";
import Spreadsheet from "./components/Spreadsheet";
import { useState } from "react";
import { SPREADSHEET_HEADING, setInitialHeading } from "./utils/utils";

function App() {
  const [heading, setHeading] = useState(setInitialHeading("Spreadsheet"));
  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem(SPREADSHEET_HEADING, e.target.value);
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
  color: var(--color-text-cell);
  border: none;
  outline: none;
  width: 100%;
  display: flex;
  padding: 20px;
`;


const AppContainer = styled.div`
  // background-color: var(--color-background);
`;