<?php
$conn = new mysqli("localhost", "root", "", "tailor_shop");

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$phone = $data['phone'];
$total = $data['total'];
$payment_id = $data['payment_id'];
$cart = $data['cart'];

$conn->query("INSERT INTO orders (customer_name, phone, total_amount, payment_id) 
              VALUES ('$name', '$phone', '$total', '$payment_id')");

$order_id = $conn->insert_id;

foreach ($cart as $item) {
    $product_id = $item['id'];
    $quantity = $item['quantity'];
    $price = $item['price'];

    $conn->query("INSERT INTO order_items (order_id, product_id, quantity, price)
                  VALUES ($order_id, $product_id, $quantity, $price)");
}

echo json_encode(["success" => true]);
?>