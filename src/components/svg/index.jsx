export const SVG = (props) => {
  return (
    <svg className={props.className} onClick={props.onClick} style={props.style} >
      <use href={`/assets/svg/iconly-sprite.svg#${props.iconId}`}></use>
    </svg>
  );
};