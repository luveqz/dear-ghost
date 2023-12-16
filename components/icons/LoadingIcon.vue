<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    height="20"
    width="20"
    viewBox="0 0 24 24"
  >
    <circle
      stroke-opacity=".3"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    <path
      fill-opacity=".7"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0A12 12 0 0 0 0 12h4zm2 5.3A8 8 0 0 1 4 12H0c0 3 1.1 5.8 3 8l3-2.7z"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
</template>
