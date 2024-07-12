import { useState } from "react";
import styled from "styled-components";
import Spreadsheet from "./components/Spreadsheet";
import { SPREADSHEET_HEADING, setInitialHeading } from "./utils/utils";

export interface IContextMenu {
  isContextMenuOpen: boolean;
  locationX: number;
  locationY: number;
}

function App() {
  const [heading, setHeading] = useState(setInitialHeading("Untitled spreadsheet"));
  const [isSelecting, setIsSelecting] = useState(false);
  // TODO: change contextMenu state to useContextMenu custom hook?
  const [contextMenu, setContextMenu] = useState<IContextMenu>({
    isContextMenuOpen: false,
    locationX: 0,
    locationY: 0,
  });

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem(SPREADSHEET_HEADING, e.target.value);
    setHeading(e.target.value);
  };

  const handleMouseUp = () => {
    if (isSelecting) setIsSelecting(false);
  };

  return (
    <AppContainer
      onClick={() => {
        if (contextMenu.isContextMenuOpen) {
          setContextMenu({ ...contextMenu, isContextMenuOpen: false });
        }
      }}
      onMouseUp={handleMouseUp}
    >
      <H1
        value={heading}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleHeadingChange(event)
        }
      />
      <Spreadsheet
        contextMenu={contextMenu}
        isSelecting={isSelecting}
        setIsSelecting={setIsSelecting}
        setContextMenu={setContextMenu}
      />
    </AppContainer>
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
  height: 100%;
`;
