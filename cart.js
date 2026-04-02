let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    alert(name + " added to your Royal Cart!");
}

function updateCartUI() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    // This updates the floating total in the checkout sidebar
    console.log("Total KES: " + total);
}

function processPayment() {
    const phone = prompt("Enter your M-Pesa Phone Number:");
    if(phone) {
        alert("STK Push Sent to " + phone + ". Please enter your PIN to complete the glow purchase.");
        // In the real version, this triggers the API I mentioned earlier.
    }
}
