import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

// a little bit of hack on the size but that's okay since this illustration is only temporary
const NanoFTS = ({ size = 100 }: { size?: number }) => (
  <Svg width={size * 0.64} height={size} fill="none" viewBox="0 0 64 100">
    <Rect width={size * 0.64} height={size} fill="#272727" />
    <Path
      d="M22.3281 43.5H22.6634L23.027 41.3182H22.6918L22.3281 43.5ZM22.9616 40.9489C23.0923 40.9489 23.2003 40.8466 23.2003 40.7216C23.2003 40.5966 23.0923 40.4943 22.9616 40.4943C22.831 40.4943 22.723 40.5966 22.723 40.7216C22.723 40.8466 22.831 40.9489 22.9616 40.9489ZM24.0955 40.5909H23.7603L23.2773 43.5H23.6126L24.0955 40.5909ZM25.0447 40.5909H24.7095L24.2266 43.5H24.5618L25.0447 40.5909ZM26.6985 42.608C26.6303 43.017 26.2894 43.2045 26.0394 43.2045C25.761 43.2045 25.5962 43 25.6474 42.6818L25.8746 41.3182H25.5394L25.3065 42.7045C25.2156 43.2614 25.4656 43.5284 25.8746 43.5284C26.2042 43.5284 26.4542 43.3523 26.5906 43.1307H26.6133L26.5508 43.5H26.886L27.2496 41.3182H26.9144L26.6985 42.608ZM29.3295 41.8068C29.2727 41.4943 29.0739 41.2898 28.642 41.2898C28.1818 41.2898 27.7955 41.5511 27.733 41.9205C27.6818 42.2216 27.8295 42.4205 28.2159 42.517L28.5625 42.6023C28.7784 42.6534 28.8636 42.7557 28.8352 42.9091C28.8068 43.0966 28.5795 43.25 28.267 43.25C27.9943 43.25 27.8409 43.1307 27.8239 42.8977L27.4886 42.9773C27.5057 43.3466 27.7784 43.5455 28.2273 43.5455C28.733 43.5455 29.125 43.267 29.1875 42.892C29.2386 42.5852 29.0795 42.3977 28.7045 42.3011L28.392 42.2216C28.1477 42.1591 28.0455 42.0682 28.0739 41.9034C28.1023 41.7159 28.3239 41.5795 28.5909 41.5795C28.8864 41.5795 28.9773 41.7386 29.0114 41.892L29.3295 41.8068ZM30.9023 41.3182H30.435L30.5217 40.7955H30.1864L30.0998 41.3182H29.7717L29.7262 41.6023H30.0529L29.8285 42.9659C29.766 43.3466 30.0387 43.5284 30.3228 43.5284C30.4478 43.5284 30.533 43.5057 30.5842 43.4886L30.5614 43.1875C30.533 43.1932 30.4876 43.2045 30.4137 43.2045C30.266 43.2045 30.1296 43.1591 30.1751 42.875L30.3867 41.6023H30.8569L30.9023 41.3182ZM31.043 43.5H31.3782L31.6055 42.1193C31.6566 41.8239 31.9237 41.608 32.2418 41.608C32.3327 41.608 32.4237 41.625 32.4464 41.6307L32.5032 41.2898C32.4634 41.2841 32.3782 41.2841 32.3271 41.2841C32.0657 41.2841 31.81 41.4318 31.6964 41.6477H31.6737L31.7305 41.3182H31.4066L31.043 43.5ZM33.1754 43.5511C33.5561 43.5511 33.7891 43.3466 33.88 43.2045H33.897L33.8459 43.5H34.1811L34.4197 42.0625C34.5334 41.3693 34.022 41.2898 33.7436 41.2898C33.4141 41.2898 33.0163 41.4034 32.7834 41.8011L33.0788 41.9148C33.1811 41.7557 33.397 41.5852 33.7152 41.5852C34.022 41.5852 34.1357 41.75 34.0902 42.0284V42.0398C34.0618 42.1989 33.897 42.1875 33.4936 42.2386C33.0788 42.2898 32.6243 42.3807 32.5391 42.8807C32.4709 43.3068 32.7607 43.5511 33.1754 43.5511ZM33.272 43.25C33.005 43.25 32.8345 43.1307 32.8743 42.8977C32.9141 42.642 33.1641 42.5625 33.4311 42.5284C33.5732 42.5114 33.9595 42.4716 34.0277 42.4034L33.9766 42.7102C33.9311 42.983 33.6697 43.25 33.272 43.25ZM36.1055 41.3182H35.6381L35.7248 40.7955H35.3896L35.3029 41.3182H34.9748L34.9293 41.6023H35.256L35.0316 42.9659C34.9691 43.3466 35.2418 43.5284 35.5259 43.5284C35.6509 43.5284 35.7362 43.5057 35.7873 43.4886L35.7646 43.1875C35.7362 43.1932 35.6907 43.2045 35.6168 43.2045C35.4691 43.2045 35.3327 43.1591 35.3782 42.875L35.5898 41.6023H36.06L36.1055 41.3182ZM36.2461 43.5H36.5813L36.945 41.3182H36.6097L36.2461 43.5ZM36.8796 40.9489C37.0103 40.9489 37.1183 40.8466 37.1183 40.7216C37.1183 40.5966 37.0103 40.4943 36.8796 40.4943C36.7489 40.4943 36.641 40.5966 36.641 40.7216C36.641 40.8466 36.7489 40.9489 36.8796 40.9489ZM38.0987 43.5455C38.6783 43.5455 39.1385 43.108 39.2464 42.4432C39.3587 41.75 39.0305 41.2898 38.4283 41.2898C37.8487 41.2898 37.3885 41.7273 37.2805 42.3977C37.1697 43.0852 37.4964 43.5455 38.0987 43.5455ZM38.1044 43.2443C37.6669 43.2443 37.5362 42.8693 37.6044 42.4432C37.6768 41.9943 37.9624 41.5909 38.4226 41.5909C38.8601 41.5909 38.9908 41.9716 38.9226 42.3977C38.8501 42.848 38.5646 43.2443 38.1044 43.2443ZM40.1332 42.1875C40.2013 41.8068 40.4684 41.5909 40.7923 41.5909C41.1048 41.5909 41.2582 41.7955 41.2013 42.1364L40.9741 43.5H41.3093L41.5423 42.1136C41.6332 41.5568 41.3775 41.2898 40.94 41.2898C40.6104 41.2898 40.3775 41.4375 40.2411 41.6591H40.2127L40.2695 41.3182H39.9457L39.582 43.5H39.9173L40.1332 42.1875Z"
      fill="#E5E5E5"
    />
    <Path
      d="M11.7532 51.1619C11.7532 51.7756 11.2844 52.0568 10.9094 52.0568C10.4918 52.0568 10.1935 51.75 10.1935 51.2727V49.2273H9.6907V51.3068C9.6907 52.142 10.1339 52.5426 10.7475 52.5426C11.2418 52.5426 11.5657 52.2784 11.7191 51.946H11.7532V52.5H12.256V49.2273H11.7532V51.1619ZM13.6799 50.5312C13.6799 49.9602 14.0336 49.6364 14.5151 49.6364C14.9817 49.6364 15.2651 49.9411 15.2651 50.4545V52.5H15.7679V50.4205C15.7679 49.5852 15.3226 49.1847 14.66 49.1847C14.1657 49.1847 13.8588 49.4062 13.7054 49.7386H13.6628V49.2273H13.177V52.5H13.6799V50.5312ZM17.9226 52.5682C18.5533 52.5682 18.7663 52.1761 18.8771 51.9972H18.9368V52.5H19.4226V48.1364H18.9197V49.7472H18.8771C18.7663 49.5767 18.5703 49.1847 17.9311 49.1847C17.1044 49.1847 16.5334 49.8409 16.5334 50.8722C16.5334 51.9119 17.1044 52.5682 17.9226 52.5682ZM17.9908 52.1165C17.3601 52.1165 17.0362 51.5625 17.0362 50.8636C17.0362 50.1733 17.3516 49.6364 17.9908 49.6364C18.6044 49.6364 18.9283 50.1307 18.9283 50.8636C18.9283 51.6051 18.5959 52.1165 17.9908 52.1165ZM21.7855 52.5682C22.4503 52.5682 22.9361 52.2358 23.0895 51.7415L22.6037 51.6051C22.4759 51.946 22.1797 52.1165 21.7855 52.1165C21.1953 52.1165 20.7884 51.7351 20.7649 51.0341H23.1406V50.821C23.1406 49.6023 22.4162 49.1847 21.7344 49.1847C20.848 49.1847 20.2599 49.8835 20.2599 50.8892C20.2599 51.8949 20.8395 52.5682 21.7855 52.5682ZM20.7649 50.5994C20.799 50.0902 21.1591 49.6364 21.7344 49.6364C22.2798 49.6364 22.6293 50.0455 22.6293 50.5994H20.7649ZM25.3629 49.2273H24.63V48.8949C24.63 48.571 24.7663 48.4006 25.0987 48.4006C25.2436 48.4006 25.3288 48.4347 25.38 48.4517L25.5249 48.017C25.4482 47.983 25.2947 47.9318 25.0476 47.9318C24.5788 47.9318 24.1271 48.2131 24.1271 48.7756V49.2273H23.5987V49.6534H24.1271V52.5H24.63V49.6534H25.3629V49.2273ZM26.0676 52.5H26.5705V49.2273H26.0676V52.5ZM26.3233 48.6818C26.5194 48.6818 26.6813 48.5284 26.6813 48.3409C26.6813 48.1534 26.5194 48 26.3233 48C26.1273 48 25.9654 48.1534 25.9654 48.3409C25.9654 48.5284 26.1273 48.6818 26.3233 48.6818ZM27.9943 50.5312C27.9943 49.9602 28.348 49.6364 28.8295 49.6364C29.2962 49.6364 29.5795 49.9411 29.5795 50.4545V52.5H30.0824V50.4205C30.0824 49.5852 29.6371 49.1847 28.9744 49.1847C28.4801 49.1847 28.1733 49.4062 28.0199 49.7386H27.9773V49.2273H27.4915V52.5H27.9943V50.5312ZM32.3734 52.5682C33.0382 52.5682 33.524 52.2358 33.6774 51.7415L33.1916 51.6051C33.0637 51.946 32.7676 52.1165 32.3734 52.1165C31.7832 52.1165 31.3762 51.7351 31.3528 51.0341H33.7285V50.821C33.7285 49.6023 33.0041 49.1847 32.3223 49.1847C31.4359 49.1847 30.8478 49.8835 30.8478 50.8892C30.8478 51.8949 31.4274 52.5682 32.3734 52.5682ZM31.3528 50.5994C31.3869 50.0902 31.747 49.6364 32.3223 49.6364C32.8677 49.6364 33.2172 50.0455 33.2172 50.5994H31.3528ZM35.7292 52.5682C36.3599 52.5682 36.573 52.1761 36.6838 51.9972H36.7434V52.5H37.2292V48.1364H36.7264V49.7472H36.6838C36.573 49.5767 36.377 49.1847 35.7377 49.1847C34.911 49.1847 34.34 49.8409 34.34 50.8722C34.34 51.9119 34.911 52.5682 35.7292 52.5682ZM35.7974 52.1165C35.1667 52.1165 34.8429 51.5625 34.8429 50.8636C34.8429 50.1733 35.1582 49.6364 35.7974 49.6364C36.411 49.6364 36.7349 50.1307 36.7349 50.8636C36.7349 51.6051 36.4025 52.1165 35.7974 52.1165ZM40.8706 52.5767C41.4416 52.5767 41.7399 52.2699 41.8422 52.0568H41.8677V52.5H42.3706V50.3438C42.3706 49.304 41.5779 49.1847 41.1603 49.1847C40.666 49.1847 40.1035 49.3551 39.8478 49.9517L40.3251 50.1222C40.4359 49.8835 40.698 49.6278 41.1774 49.6278C41.6397 49.6278 41.8677 49.8729 41.8677 50.2926V50.3097C41.8677 50.5526 41.6206 50.5312 41.024 50.608C40.4167 50.6868 39.7541 50.821 39.7541 51.571C39.7541 52.2102 40.2484 52.5767 40.8706 52.5767ZM40.9473 52.125C40.5467 52.125 40.2569 51.946 40.2569 51.5966C40.2569 51.2131 40.6064 51.0938 40.9984 51.0426C41.2115 51.017 41.7825 50.9574 41.8677 50.8551V51.3153C41.8677 51.7244 41.5439 52.125 40.9473 52.125ZM45.6065 49.9602C45.4489 49.4957 45.0952 49.1847 44.4474 49.1847C43.7571 49.1847 43.2457 49.5767 43.2457 50.1307C43.2457 50.5824 43.5142 50.8849 44.1151 51.0256L44.6605 51.1534C44.9908 51.2301 45.1463 51.3878 45.1463 51.6136C45.1463 51.8949 44.848 52.125 44.3793 52.125C43.968 52.125 43.7102 51.9482 43.6207 51.5966L43.1435 51.7159C43.2607 52.272 43.7188 52.5682 44.3878 52.5682C45.1484 52.5682 45.6662 52.1527 45.6662 51.5881C45.6662 51.1321 45.3807 50.8445 44.7969 50.7017L44.3111 50.5824C43.9233 50.4865 43.7486 50.3565 43.7486 50.1051C43.7486 49.8239 44.0469 49.6193 44.4474 49.6193C44.8864 49.6193 45.0675 49.8622 45.1548 50.0881L45.6065 49.9602ZM48.7413 49.9602C48.5836 49.4957 48.2299 49.1847 47.5822 49.1847C46.8919 49.1847 46.3805 49.5767 46.3805 50.1307C46.3805 50.5824 46.649 50.8849 47.2498 51.0256L47.7953 51.1534C48.1255 51.2301 48.2811 51.3878 48.2811 51.6136C48.2811 51.8949 47.9828 52.125 47.514 52.125C47.1028 52.125 46.845 51.9482 46.7555 51.5966L46.2782 51.7159C46.3954 52.272 46.8535 52.5682 47.5225 52.5682C48.2832 52.5682 48.801 52.1527 48.801 51.5881C48.801 51.1321 48.5154 50.8445 47.9316 50.7017L47.4458 50.5824C47.0581 50.4865 46.8833 50.3565 46.8833 50.1051C46.8833 49.8239 47.1816 49.6193 47.5822 49.6193C48.0211 49.6193 48.2022 49.8622 48.2896 50.0881L48.7413 49.9602ZM50.93 52.5682C51.5948 52.5682 52.0806 52.2358 52.234 51.7415L51.7482 51.6051C51.6204 51.946 51.3242 52.1165 50.93 52.1165C50.3398 52.1165 49.9329 51.7351 49.9094 51.0341H52.2852V50.821C52.2852 49.6023 51.5607 49.1847 50.8789 49.1847C49.9925 49.1847 49.4045 49.8835 49.4045 50.8892C49.4045 51.8949 49.984 52.5682 50.93 52.5682ZM49.9094 50.5994C49.9435 50.0902 50.3036 49.6364 50.8789 49.6364C51.4244 49.6364 51.7738 50.0455 51.7738 50.5994H49.9094ZM54.4734 49.2273H53.7745V48.4432H53.2717V49.2273H52.7773V49.6534H53.2717V51.6989C53.2717 52.2699 53.7319 52.5426 54.158 52.5426C54.3455 52.5426 54.4648 52.5085 54.533 52.483L54.4308 52.0312C54.3881 52.0398 54.32 52.0568 54.2092 52.0568C53.9876 52.0568 53.7745 51.9886 53.7745 51.5625V49.6534H54.4734V49.2273ZM24.6803 56.2273H24.1349L23.2314 58.8352H23.1974L22.2939 56.2273H21.7485L22.9587 59.5H23.4701L24.6803 56.2273ZM26.599 59.5682C27.2638 59.5682 27.7496 59.2358 27.903 58.7415L27.4172 58.6051C27.2893 58.946 26.9932 59.1165 26.599 59.1165C26.0088 59.1165 25.6018 58.7351 25.5784 58.0341H27.9541V57.821C27.9541 56.6023 27.2297 56.1847 26.5479 56.1847C25.6615 56.1847 25.0734 56.8835 25.0734 57.8892C25.0734 58.8949 25.653 59.5682 26.599 59.5682ZM25.5784 57.5994C25.6125 57.0902 25.9726 56.6364 26.5479 56.6364C27.0933 56.6364 27.4427 57.0455 27.4427 57.5994H25.5784ZM28.719 59.5H29.2219V57.429C29.2219 56.9858 29.5713 56.6619 30.0486 56.6619C30.1828 56.6619 30.3213 56.6875 30.3554 56.696V56.1847C30.2979 56.1804 30.1657 56.1761 30.0912 56.1761C29.6991 56.1761 29.3582 56.3977 29.2389 56.7216H29.2048V56.2273H28.719V59.5ZM32.5798 56.2273H31.8809V55.4432H31.3781V56.2273H30.8838V56.6534H31.3781V58.6989C31.3781 59.2699 31.8383 59.5426 32.2645 59.5426C32.452 59.5426 32.5713 59.5085 32.6395 59.483L32.5372 59.0312C32.4946 59.0398 32.4264 59.0568 32.3156 59.0568C32.094 59.0568 31.8809 58.9886 31.8809 58.5625V56.6534H32.5798V56.2273ZM33.3362 59.5H33.839V56.2273H33.3362V59.5ZM33.5919 55.6818C33.7879 55.6818 33.9498 55.5284 33.9498 55.3409C33.9498 55.1534 33.7879 55 33.5919 55C33.3959 55 33.2339 55.1534 33.2339 55.3409C33.2339 55.5284 33.3959 55.6818 33.5919 55.6818ZM36.0896 59.5682C36.814 59.5682 37.2913 59.125 37.3765 58.5455H36.8737C36.7799 58.9034 36.4816 59.1165 36.0896 59.1165C35.493 59.1165 35.1095 58.6222 35.1095 57.8636C35.1095 57.1222 35.5015 56.6364 36.0896 56.6364C36.5328 56.6364 36.797 56.9091 36.8737 57.2074H37.3765C37.2913 56.5938 36.7714 56.1847 36.0811 56.1847C35.1947 56.1847 34.6066 56.8835 34.6066 57.8807C34.6066 58.8608 35.1691 59.5682 36.0896 59.5682ZM39.0747 59.5767C39.6457 59.5767 39.944 59.2699 40.0463 59.0568H40.0718V59.5H40.5747V57.3438C40.5747 56.304 39.782 56.1847 39.3644 56.1847C38.8701 56.1847 38.3076 56.3551 38.0519 56.9517L38.5292 57.1222C38.64 56.8835 38.9021 56.6278 39.3815 56.6278C39.8438 56.6278 40.0718 56.8729 40.0718 57.2926V57.3097C40.0718 57.5526 39.8247 57.5312 39.2281 57.608C38.6208 57.6868 37.9582 57.821 37.9582 58.571C37.9582 59.2102 38.4525 59.5767 39.0747 59.5767ZM39.1514 59.125C38.7508 59.125 38.461 58.946 38.461 58.5966C38.461 58.2131 38.8105 58.0938 39.2025 58.0426C39.4156 58.017 39.9866 57.9574 40.0718 57.8551V58.3153C40.0718 58.7244 39.748 59.125 39.1514 59.125ZM41.9953 55.1364H41.4925V59.5H41.9953V55.1364Z"
      fill="#E5E5E5"
    />
  </Svg>
);

export default NanoFTS;
