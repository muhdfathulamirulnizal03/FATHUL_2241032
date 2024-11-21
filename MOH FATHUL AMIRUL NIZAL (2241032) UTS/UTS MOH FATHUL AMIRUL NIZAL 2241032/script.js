// Daftar produk
const products = [
    { id: 1, name: "Laptop", price: 1500 },
    { id: 2, name: "Smartphone", price: 800 },
    { id: 3, name: "Headphone", price: 200 },
];

// Keranjang belanja
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fungsi untuk menampilkan daftar produk
function renderProducts() {
    const productContainer = document.querySelector('.products');
    if (productContainer) {
        productContainer.innerHTML = ''; // Kosongkan kontainer
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productContainer.appendChild(productDiv);
        });
    }
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produk ditambahkan ke keranjang!');
}

// Fungsi untuk menampilkan keranjang belanja
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    let total = 0;

    if (cartContainer) {
        cartContainer.innerHTML = ''; // Kosongkan kontainer

        if (cart.length === 0) {
            cartContainer.innerHTML = '<tr><td colspan="5">Keranjang Anda kosong.</td></tr>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        ${item.quantity}
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </td>
                    <td>$${item.price}</td>
                    <td>$${itemTotal}</td>
                    <td><button onclick="removeFromCart(${item.id})">Hapus</button></td>
                `;
                cartContainer.appendChild(row);
            });
        }

        // Perbarui total harga di semua halaman
        document.getElementById('total-price').textContent = total;

        const checkoutTotal = document.getElementById('checkout-total');
        if (checkoutTotal) {
            checkoutTotal.textContent = total;
        }
    }
}

// Fungsi untuk memperbarui jumlah produk di keranjang
function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        renderCart();
    }
}

// Fungsi untuk menghapus produk dari keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Fungsi untuk menginisialisasi halaman sesuai path
document.addEventListener('DOMContentLoaded', () => {
    if (location.pathname.endsWith('index.html')) {
        renderProducts();
    } else if (location.pathname.endsWith('cart.html')) {
        renderCart();
    } else if (location.pathname.endsWith('checkout.html')) {
        renderCart();
        document.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Pembayaran Berhasil!');
            localStorage.removeItem('cart');
            cart = [];
            location.href = 'index.html';
        });
    }
});
