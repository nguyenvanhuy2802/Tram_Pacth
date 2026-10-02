const ORDER_KEY = "tramPatchOrders";

function generateOrderCode() {

    const now = new Date();

    const date =
        now.getFullYear().toString().slice(-2) +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");

    const random =
        Math.floor(1000 + Math.random() * 9000);

    return `TP${date}${random}`;
}


function getOrders() {

    return JSON.parse(
        localStorage.getItem(ORDER_KEY)
    ) || [];

}


function saveOrder(order) {

    const orders = getOrders();

    orders.push(order);

    localStorage.setItem(
        ORDER_KEY,
        JSON.stringify(orders)
    );

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById("orderForm");

        if (!form) return;


        form.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const cart = getCart();


                if (cart.length === 0) {

                    showToast(
                        "Giỏ hàng đang trống!"
                    );

                    return;
                }


                const payment =
                    document.querySelector(
                        'input[name="payment"]:checked'
                    ).value;


                const subtotal =
                    calculateSubtotal();


                const shipping =
                    subtotal >= 200000
                        ? 0
                        : 20000;


                const order = {

                    id: generateOrderCode(),

                    createdAt:
                        new Date().toISOString(),

                    customer: {

                        name:
                            document
                            .getElementById(
                                "customerName"
                            ).value.trim(),

                        phone:
                            document
                            .getElementById(
                                "customerPhone"
                            ).value.trim(),

                        email:
                            document
                            .getElementById(
                                "customerEmail"
                            ).value.trim(),

                        city:
                            document
                            .getElementById(
                                "customerCity"
                            ).value.trim(),

                        address:
                            document
                            .getElementById(
                                "customerAddress"
                            ).value.trim()

                    },

                    note:
                        document
                        .getElementById(
                            "orderNote"
                        ).value.trim(),

                    paymentMethod:
                        payment,

                    items:
                        cart.map(item => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            total:
                                item.price *
                                item.quantity
                        })),

                    subtotal: subtotal,

                    shipping: shipping,

                    total:
                        subtotal + shipping,

                    status:
                        "Chờ xác nhận"

                };


                saveOrder(order);


                localStorage.removeItem(
                    CART_KEY
                );


                document
                    .getElementById(
                        "cartContent"
                    )
                    .style.display = "none";


                document
                    .getElementById(
                        "checkout"
                    )
                    .style.display = "none";


                document
                    .getElementById(
                        "emptyCart"
                    )
                    .style.display = "none";


                document
                    .getElementById(
                        "successOrder"
                    )
                    .style.display = "block";


                document
                    .getElementById(
                        "orderCode"
                    )
                    .textContent =
                        order.id;


                updateCartCount();

                window.scrollTo({
                    top:0,
                    behavior:"smooth"
                });

            }
        );

    }
);