import cellContextMenu from "./../../data/cellContextMenu";
import MenuItem from "./MenuItem";
import type { MenuItemProps } from "./MenuItem";

interface ContextMenuProps {
  data: MenuItemProps[];
}

const ContextMenu = ({ data }: ContextMenuProps) => {
  return (
    <div>
      {cellContextMenu.map((item) => (
        <MenuItem action={item.action} id={item.id} key={item.id} label={item.label} />
      ))}
    </div>
  );
};

export default ContextMenu;
