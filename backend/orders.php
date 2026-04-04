<?php
require_once 'config.php';

function createOrder($order_type, $customer_address_id, $total_amount, $customer_id, $status) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO orders (order_type, customer_address_id, total_amount, customer_id, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iidii", $order_type, $customer_address_id, $total_amount, $customer_id, $status);
    $stmt->execute();
    return $stmt->insert_id;
}

function getOrder($order_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM orders WHERE order_id = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllOrders() {
    global $conn;
    return $conn->query("SELECT * FROM orders")->fetch_all(MYSQLI_ASSOC);
}

function updateOrder($order_id, $order_type, $customer_address_id, $total_amount, $customer_id, $status) {
    global $conn;
    $stmt = $conn->prepare("UPDATE orders SET order_type=?, customer_address_id=?, total_amount=?, customer_id=?, status=? WHERE order_id=?");
    $stmt->bind_param("iidiii", $order_type, $customer_address_id, $total_amount, $customer_id, $status, $order_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteOrder($order_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM orders WHERE order_id = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>