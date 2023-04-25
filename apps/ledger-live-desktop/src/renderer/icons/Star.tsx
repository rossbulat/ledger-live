import React from "react";

const Star = ({ size = 16, filled = false }: { size?: number; filled: boolean }) => (
  <svg viewBox="0 0 13 13" width={size} height={size}>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        stroke={filled ? "#ffd24a" : "#999999"}
        fill={filled ? "#ffd24a" : "#FFFFFF"}
        d="M11.575,4.573 L8.531,4.13 L7.171,1.372 C7.05858726,1.14446567 6.82678829,1.00044035 6.573,1.00044035 C6.31921171,1.00044035 6.08741274,1.14446567 5.975,1.372 L4.615,4.13 L1.57,4.573 C1.3187333,4.60962947 1.1100596,4.78574987 1.03173887,5.02729186 C0.953418131,5.26883386 1.01903749,5.53389462 1.201,5.711 L3.403,7.857 L2.883,10.887 C2.83981565,11.1369147 2.9423219,11.3896653 3.14738629,11.5388995 C3.35245069,11.6881337 3.62447611,11.7079461 3.849,11.59 L6.572,10.159 L9.295,11.589 C9.51922313,11.7057446 9.79017617,11.6856971 9.9947762,11.5372244 C10.1993762,11.3887517 10.302458,11.1373723 10.261,10.888 L9.741,7.857 L11.943,5.711 C12.1249625,5.53389462 12.1905819,5.26883386 12.1122611,5.02729186 C12.0339404,4.78574987 11.8252667,4.60962947 11.574,4.573 L11.575,4.573 Z"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

export default Star;
