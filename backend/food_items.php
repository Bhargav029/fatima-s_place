<?php
require_once 'config.php';

function createFoodItem($category, $is_available, $description, $name, $price) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO food_items (category, is_available, description, name, price) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("isssd", $category, $is_available, $description, $name, $price);
    $stmt->execute();
    return $stmt->insert_id;
}

function getFoodItem($food_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM food_items WHERE food_id = ?");
    $stmt->bind_param("i", $food_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllFoodItems() {
    global $conn;
    return $conn->query("SELECT * FROM food_items")->fetch_all(MYSQLI_ASSOC);
}

function updateFoodItem($food_id, $category, $is_available, $description, $name, $price) {
    global $conn;
    $stmt = $conn->prepare("UPDATE food_items SET category=?, is_available=?, description=?, name=?, price=? WHERE food_id=?");
    $stmt->bind_param("isssdi", $category, $is_available, $description, $name, $price, $food_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteFoodItem($food_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM food_items WHERE food_id = ?");
    $stmt->bind_param("i", $food_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>