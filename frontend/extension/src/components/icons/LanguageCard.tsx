import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLanguageCard = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 84 32"
    width="1em"
    height="1em"
    ref={ref}
    {...props}
  >
    <rect width={84} height={32} rx={10} fill="white" />
  </svg>
);
const ForwardRef = forwardRef(SvgLanguageCard);
export default ForwardRef;
