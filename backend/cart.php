<?php
require_once 'config.php';

function createCart($user_id) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO cart (user_id) VALUES (?)");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    return $stmt->insert_id;
}

function getCart($cart_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM cart WHERE cart_id = ?");
    $stmt->bind_param("i", $cart_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllCarts() {
    global $conn;
    return $conn->query("SELECT * FROM cart")->fetch_all(MYSQLI_ASSOC);
}

function updateCart($cart_id, $user_id) {
    global $conn;
    $stmt = $conn->prepare("UPDATE cart SET user_id = ? WHERE cart_id = ?");
    $stmt->bind_param("ii", $user_id, $cart_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteCart($cart_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM cart WHERE cart_id = ?");
    $stmt->bind_param("i", $cart_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>