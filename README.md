# Spreadsheet app written in TypeScript

## Icons
>💡 React uses [SVGR](https://react-svgr.com/) to convert svg icons to React components.

1. Add svg icons to the `src/assets/icons` folder.

2. Import icons as React components like this

   ```typescript
   import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";
   ```

3. Use icons like this

   ```typescript
   <IconAdd /> // Add any props like color, width, height, etc.
   ```

### Change the color of an icon

> Change the `fill` attribute of the SVG element to `currentColor` like this:

````xml
  <span className="search-icon">
    <svg viewBox="0 0 731 731" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M551.28 468C641.348 333.253 609.029 142.973 465.296 48.8133C354.932 -23.4053 207.576 -14.072 107.016 71.3293C-28.3176 186.36 -34.5043 390.409 88.5838 513.609C189.849 614.875 350.384 629.807 468.33 550.943L613.344 708.436C639.36 736.785 683.693 737.837 710.874 710.655C738.057 683.472 737.125 639.019 708.656 613.124L551.162 468.111L551.28 468ZM449.78 449.448C367.878 531.349 234.646 531.349 152.753 449.448C70.8518 367.547 70.8518 234.315 152.753 152.421C193.701 111.473 247.488 91.0573 301.273 91.0573C355.054 91.0573 408.841 111.588 449.793 152.421C531.694 234.323 531.694 367.555 449.793 449.448H449.78Z"
        fill="currentColor"
      />
    </svg>
 </span>
 ````

> This allows us to style the icon with the `color` CSS property.
```css
.search-icon {
    color: red;
}
```

> Or we can use prop `color` and pass the color to the icon component.

- Usage:

```typescript
<IconAdd color="red" />
```

### Change other props of the svg element (width, height, etc.)

> 💡 Find other props you can add to the svg element: search `interface SVGAttributes<T>` in `node_modules/@types/react/index.d.ts` file.

> Use the `className` prop to pass a class name to the svg element.

```typescript
<IconAdd className="icon" />
```

Then use CSS to style the svg element.

```css
.icon {
  width: 20px;
  height: 20px;
}
```
