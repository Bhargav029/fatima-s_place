<?php
require_once 'config.php';

function createCartItem($cart_id, $quantity, $items_id, $price) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO cart_items (cart_id, quantity, items_id, price) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiid", $cart_id, $quantity, $items_id, $price);
    $stmt->execute();
    return $stmt->insert_id;
}

function getCartItem($cart_items_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM cart_items WHERE cart_items_id = ?");
    $stmt->bind_param("i", $cart_items_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllCartItems() {
    global $conn;
    return $conn->query("SELECT * FROM cart_items")->fetch_all(MYSQLI_ASSOC);
}

function updateCartItem($cart_items_id, $cart_id, $quantity, $items_id, $price) {
    global $conn;
    $stmt = $conn->prepare("UPDATE cart_items SET cart_id=?, quantity=?, items_id=?, price=? WHERE cart_items_id=?");
    $stmt->bind_param("iiidi", $cart_id, $quantity, $items_id, $price, $cart_items_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteCartItem($cart_items_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM cart_items WHERE cart_items_id = ?");
    $stmt->bind_param("i", $cart_items_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>