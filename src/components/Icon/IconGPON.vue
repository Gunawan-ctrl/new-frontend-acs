<template>
  <svg viewBox="0 0 22 14" preserveAspectRatio="none" class="NodePort gpon">
    <g>
      <polygon points="1,1 21,1 21,13 1,13" :fill="'#3D3E40'"></polygon>
      <circle cx="11" cy="7" r="5" :fill="colorCircle"></circle>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    colorCircle: String,
    colorBox: String
  }
}
</script>
