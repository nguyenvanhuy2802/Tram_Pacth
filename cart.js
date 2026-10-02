const CART_KEY = "tramPatchCart";
const DESIGN_KEY = "tramPatchDesign";

/* =========================
   CART CORE
========================= */

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN") + "đ";
}


/* =========================
   DESIGN
========================= */

function getSavedDesign() {

    try {
        return JSON.parse(
            localStorage.getItem(DESIGN_KEY)
        );
    } catch {
        return null;
    }
}


/* =========================
   CUSTOM DESIGN KEY
   Dùng để phân biệt 2 mẫu
========================= */

function getDesignKey(design) {

    return JSON.stringify({
        shape: design.shape,
        color: design.color,
        icon: design.icon,
        text: design.text
    });

}


/* =========================
   ADD CUSTOM
========================= */

function addCustomToCart(design, quantity = 1) {

    if (!design) {
        alert("Bạn chưa có thiết kế Custom.");
        return false;
    }

    const cart = getCart();

    const designKey = getDesignKey(design);

    /*
      Custom phải có ID riêng theo thiết kế.
      Vì vậy 2 thiết kế khác nhau không bị gộp.
    */
    const lineId = "custom-" + btoa(
        unescape(
            encodeURIComponent(designKey)
        )
    )
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 30);


    const existing = cart.find(
        item =>
            item.lineId === lineId &&
            item.type === "custom"
    );


    if (existing) {

        existing.quantity += quantity;

    } else {

        cart.push({

            lineId: lineId,

            id: "custom",

            type: "custom",

            name: "Tràm Patch Custom",

            price: 60000,

            quantity: quantity,

            image: "assets/custom.jpg",

            design: {
                shape: design.shape,
                color: design.color,
                icon: design.icon,
                text: design.text
            }

        });

    }


    saveCart(cart);

    updateCartCount();

    showToast(
        "Đã thêm mẫu Custom vào giỏ hàng 🛒"
    );

    return true;
}


/* =========================
   ADD BASIC / SEASONAL
========================= */

function addProductToCart(product) {

    const cart = getCart();

    const lineId = product.id;

    const existing = cart.find(
        item => item.lineId === lineId
    );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            lineId: lineId,

            id: product.id,

            type: "product",

            name: product.name,

            price: Number(product.price),

            quantity: 1,

            image: product.image

        });

    }


    saveCart(cart);

    updateCartCount();

    showToast(
        "Đã thêm sản phẩm vào giỏ hàng 🛒"
    );
}


/* =========================
   COUNT
========================= */

function getCartCount() {

    return getCart().reduce(
        (total, item) =>
            total + Number(item.quantity),
        0
    );

}


function updateCartCount() {

    const count =
        document.getElementById("cartCount");

    if (count) {
        count.textContent = getCartCount();
    }

}


/* =========================
   REMOVE
========================= */

function removeCartItem(lineId) {

    let cart = getCart();

    cart = cart.filter(
        item => item.lineId !== lineId
    );

    saveCart(cart);

    updateCartCount();

    if (typeof renderCart === "function") {
        renderCart();
    }

}


/* =========================
   QUANTITY
========================= */

function changeCartQuantity(
    lineId,
    amount
) {

    const cart = getCart();

    const item = cart.find(
        item => item.lineId === lineId
    );

    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        removeCartItem(lineId);

        return;
    }


    saveCart(cart);

    updateCartCount();

    if (typeof renderCart === "function") {
        renderCart();
    }

}


/* =========================
   TOTAL
========================= */

function getSubtotal() {

    return getCart().reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );

}


function getShipping() {

    const subtotal = getSubtotal();

    if (subtotal === 0) {
        return 0;
    }

    /*
      Từ 200.000đ miễn phí vận chuyển
    */
    return subtotal >= 200000
        ? 0
        : 20000;
}


function getTotal() {

    return getSubtotal() + getShipping();

}


/* =========================
   TOAST
========================= */

function showToast(message) {

    let toast =
        document.getElementById("toast");


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);

    }


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


/* =========================
   INIT
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();


        /*
          Sản phẩm Basic / Seasonal
        */

        document
            .querySelectorAll(".add-to-cart")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        addProductToCart({

                            id:
                                button.dataset.id,

                            name:
                                button.dataset.name,

                            price:
                                button.dataset.price,

                            image:
                                button.dataset.image

                        });

                    }
                );

            });

    }
);