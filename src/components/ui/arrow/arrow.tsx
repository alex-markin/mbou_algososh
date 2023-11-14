
import arrowBlue from "../../../images/icons/chevron-right-blue.svg"
import arrowPurple from "../../../images/icons/chevron-right-purple.svg"

type ArrowProps = {
  index: number;
  tailIndex: number
  color: string;
}

export default function Arrow({ index, tailIndex, color }: ArrowProps) {

  const src = color === "blue" ? arrowBlue : arrowPurple;

  if (index !== tailIndex) {
    return (
      <img src={src}></img>
    )
  } else {
    return null;
  }
}
