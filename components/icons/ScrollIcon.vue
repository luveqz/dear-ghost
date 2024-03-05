<template>
  <svg
    id="scroll"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 48"
    width="24"
    height="48"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
  >
    <path
      id="scroll-s-path1"
      d="M19,21c0-3.866-3.134-7-7-7s-7,3.134-7,7v6c0,3.866,3.13401,7,7,7s7-3.134,7-7v-6Z"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      id="scroll-s-path2"
      d="M12,18v4"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <g id="scroll-s-path3_to" transform="translate(12,40.5)">
      <path
        id="scroll-s-path3"
        d="M9,44l3,3l3-3"
        transform="translate(-12,-45.5)"
        fill="none"
        stroke="#db7e11"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>

<style>
#scroll-s-path3_to {
  animation: scroll-s-path3_to__to 1400ms linear infinite normal forwards;
}
@keyframes scroll-s-path3_to__to {
  0% {
    transform: translate(12px, 40.5px);
    animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  }
  50% {
    transform: translate(12px, 42.5px);
    animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  }
  100% {
    transform: translate(12px, 40.5px);
  }
}
</style>
