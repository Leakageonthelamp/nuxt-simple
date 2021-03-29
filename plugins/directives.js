import Vue from "vue";

// Register a global custom directive called `v-click-outside`
Vue.directive("click-outside", {
  bind: function(el, binding, vNode) {
    // Check whether handler is a function
    if (typeof binding.value !== "function") {
      const compName = vNode.context.name;
      let warn = `[vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
      if (compName) {
        warn += `Found in component '${compName}'`;
      }

      console.error("warn", warn);
    }

    // Define handler and cache it on the element
    const bubble = binding.modifiers.bubble;
    const handler = e => {
      e.stopPropagation();
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e);
      }
    };
    el.__vueClickOutside__ = handler;

    document.addEventListener("click", handler);
  },

  unbind: function(el) {
    document.removeEventListener("click", el.__vueClickOutside__);
    el.__vueClickOutside__ = null;
  }
});
