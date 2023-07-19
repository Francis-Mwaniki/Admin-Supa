<template>
  <div>
    <div class="top-0 left-0 w-screen h-1.5 fixed z-40 shadow-2xl bg-gray-300">
      <div :style="inlineStyle" />
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scroll: "0%",
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScrollProgress);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScrollProgress);
  },
  methods: {
    onScrollProgress() {
      const html = document.documentElement;
      const scrollPx = html.scrollTop;
      const winHeightPx = html.scrollHeight - html.clientHeight;
      const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
      console.log(scrolled);

      this.scroll = scrolled;
    },
  },
  computed: {
    inlineStyle() {
      return {
        height: "6px",
        background: "#4C1D95",
        width: this.scroll,
      };
    },
  },
};
</script>

<style>
/* Tailwind CSS classes for the scroll indicator can be copied from the previous example */
</style>
