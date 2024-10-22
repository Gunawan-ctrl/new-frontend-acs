<template>
  <svg viewBox="0 0 30 25" preserveAspectRatio="none" class="NodePort eth">
    <g>
      <polygon
        points="5,9 9,9 9,6 12,6 12,3 18,3 18,6 21,6 21,9 25,9 25,21 5,21"
        :fill="colorPortEth"
      ></polygon>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    colorPortEth: String
  }
}
</script>
