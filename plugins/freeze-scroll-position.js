import Vue from "vue";

const FreezeScrollPosition = {
  install(Vue) {
    Vue.popupStack = 0;
    Vue.rootScrollTop = 0;
    // Vue.pageYOffsetEnabled = false;
    // Vue.documentElementScrollTopEnabled = false;
    // Vue.bodyScrollTopEnabled = false;

    Vue.prototype.$freezeScrollPosition = function() {
      if (Vue.popupStack === 0) {
        const currentScrollTop = Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        );
        // Vue.pageYOffsetEnabled = window.pageYOffset === currentScrollTop;
        // Vue.documentElementScrollTopEnabled =
        //   document.documentElement.scrollTop === currentScrollTop;
        // Vue.bodyScrollTopEnabled = document.body.scrollTop === currentScrollTop;

        document.body.style.width = "100%";
        document.body.style.position = "fixed";
        // document.body.style.overflowY = "scroll";
        document.body.style.top = -currentScrollTop + "px";
        Vue.rootScrollTops = currentScrollTop;
      }
      ++Vue.popupStack;
    };

    Vue.prototype.$unfreezeScrollPosition = function() {
      if (Vue.popupStack <= 1) {
        document.body.style.width = null;
        document.body.style.position = null;
        document.body.style.overflowY = null;
        document.body.style.top = null;

        // if (Vue.pageYOffsetEnabled) {
        //   window.pageYOffset = Vue.rootScrollTops;
        // }
        // if (Vue.documentElementScrollTopEnabled) {
        //   document.documentElement.scrollTop = Vue.rootScrollTops;
        // }
        // if (Vue.bodyScrollTopEnabled) {
        //   document.scrollingElement.scrollTop = Vue.rootScrollTops;
        // }
        window.scrollTo(0, Vue.rootScrollTops);

        Vue.rootScrollTops = 0;
        Vue.popupStack = 0;
      } else {
        --Vue.popupStack;
      }
    };

    Vue.prototype.$unfreezeAndResetScrollPosition = function() {
      document.body.style.width = null;
      document.body.style.position = null;
      document.body.style.overflowY = null;
      document.body.style.top = null;

      window.scrollTo(0, 0);

      Vue.rootScrollTops = 0;
      Vue.popupStack = 0;
    };
  }
};

Vue.use(FreezeScrollPosition);
