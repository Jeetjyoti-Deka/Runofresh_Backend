-- Insert dummy orders for user_id 1 with Razorpay details
INSERT INTO orders (
    user_id, total_amount, shipping_address, status, payment_status, razorpay_payment_id, razorpay_order_id
) 
VALUES
(1, 1299.00, '123 Main St, City, Country', 'pending', 'paid', 'razorpay_payment_001', 'razorpay_order_001'),
(1, 1599.00, '456 Oak St, City, Country', 'pending', 'paid', 'razorpay_payment_002', 'razorpay_order_002'),
(1, 899.00, '789 Pine St, City, Country', 'pending', 'paid', 'razorpay_payment_003', 'razorpay_order_003'),
(1, 1999.00, '321 Maple St, City, Country', 'pending', 'paid', 'razorpay_payment_004', 'razorpay_order_004'),
(1, 1099.00, '654 Birch St, City, Country', 'pending', 'paid', 'razorpay_payment_005', 'razorpay_order_005')
RETURNING id;

-- Insert corresponding order items for each order (assuming order ids are 1-5)

-- Order 1 items
INSERT INTO order_items (order_id, item_id, quantity, price) VALUES
(1, 1, 2, 299.00),
(1, 2, 1, 499.00),
(1, 3, 1, 399.00),
(1, 4, 1, 599.00);

-- Order 2 items
INSERT INTO order_items (order_id, item_id, quantity, price) VALUES
(2, 1, 1, 299.00),
(2, 3, 2, 399.00),
(2, 5, 1, 799.00),
(2, 6, 1, 149.00);

-- Order 3 items
INSERT INTO order_items (order_id, item_id, quantity, price) VALUES
(3, 2, 1, 499.00),
(3, 3, 2, 399.00),
(3, 6, 1, 149.00),
(3, 7, 1, 249.00);

-- Order 4 items
INSERT INTO order_items (order_id, item_id, quantity, price) VALUES
(4, 1, 3, 299.00),
(4, 4, 1, 599.00),
(4, 5, 1, 799.00),
(4, 7, 1, 249.00),
(4, 8, 1, 199.00);

-- Order 5 items
INSERT INTO order_items (order_id, item_id, quantity, price) VALUES
(5, 2, 2, 499.00),
(5, 3, 1, 399.00),
(5, 6, 1, 149.00),
(5, 9, 1, 299.00);
