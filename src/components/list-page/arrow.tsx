
import arrowBlue from "../../images/icons/chevron-right-blue.svg"
import arrowPurple from "../../images/icons/chevron-right-purple.svg"

type ArrowProps = {
  index: number;
  tailIndex: number
}

export default function Arrow({ index, tailIndex }: ArrowProps) {

  if (index !== tailIndex) {
    return (
      <img src={arrowBlue}></img>
    )
  } else {
    return null;
  }
}
