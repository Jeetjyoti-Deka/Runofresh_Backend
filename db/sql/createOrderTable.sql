CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered');
CREATE TYPE order_payment_status AS ENUM ('paid', 'unpaid');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL, -- Assuming you have a users table
    total_amount NUMERIC(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status order_status DEFAULT 'pending', -- Could be 'Pending', 'Shipped', 'Delivered', etc.
    shipping_address TEXT,
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- 'Paid', 'Unpaid'
    razorpay_payment_id VARCHAR(100) NOT NULL UNIQUE,
    razorpay_order_id VARCHAR(100) NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    item_id INT REFERENCES items(id),
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL, -- Store the price at the time of order
    PRIMARY KEY (order_id, item_id)
);
