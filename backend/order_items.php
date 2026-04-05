<?php
require_once 'config.php';

function createOrderItem($order_id, $food_id, $price, $quantity) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, food_id, price, quantity) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iidi", $order_id, $food_id, $price, $quantity);
    $stmt->execute();
    return $stmt->affected_rows; // no auto-increment, returns rows affected
}

function getOrderItem($order_id, $food_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ? AND food_id = ?");
    $stmt->bind_param("ii", $order_id, $food_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllOrderItems() {
    global $conn;
    return $conn->query("SELECT * FROM order_items")->fetch_all(MYSQLI_ASSOC);
}

function updateOrderItem($order_id, $food_id, $price, $quantity) {
    global $conn;
    $stmt = $conn->prepare("UPDATE order_items SET price=?, quantity=? WHERE order_id=? AND food_id=?");
    $stmt->bind_param("diii", $price, $quantity, $order_id, $food_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteOrderItem($order_id, $food_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM order_items WHERE order_id = ? AND food_id = ?");
    $stmt->bind_param("ii", $order_id, $food_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>