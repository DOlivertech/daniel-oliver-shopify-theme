/* DO Racing — theme behaviour. Vanilla, defensive null checks so it runs on
   every template. (1) product variant <select> updates price + button state;
   (2) cart quantity inputs auto-submit their form (debounced). */
(function () {
  "use strict";

  /* ---- Product: variant select → price + add-to-cart button ---- */
  function initProductForm() {
    var form = document.querySelector("[data-product-form]");
    if (!form) return;

    var select = form.querySelector("[data-variant-select]");
    var button = form.querySelector("[data-add-to-cart]");
    var priceEl = document.querySelector("[data-product-price]");
    if (!select) return;

    function update() {
      var opt = select.options[select.selectedIndex];
      if (!opt) return;

      var available = opt.getAttribute("data-available") === "true";
      var price = opt.getAttribute("data-price");

      if (priceEl && price) {
        priceEl.innerHTML = price;
      }
      if (button) {
        button.disabled = !available;
        var label = button.querySelector("[data-btn-label]") || button;
        label.textContent = available
          ? button.getAttribute("data-label-available") || "Add to cart"
          : button.getAttribute("data-label-soldout") || "Sold out";
      }
    }

    select.addEventListener("change", update);
    update();
  }

  /* ---- Cart: quantity inputs auto-submit (debounced) ---- */
  function initCartForm() {
    var form = document.querySelector("[data-cart-form]");
    if (!form) return;

    var timer = null;
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (!t || !t.matches || !t.matches("[data-qty-input]")) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.submit();
        }
      }, 550);
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initProductForm();
    initCartForm();
  });
})();
