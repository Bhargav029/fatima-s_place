<?php
require_once 'config.php';

function createRestaurantTable($capacity, $status, $table_no) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO restaurant_table (capacity, status, table_no) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $capacity, $status, $table_no);
    $stmt->execute();
    return $stmt->insert_id;
}

function getRestaurantTable($table_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM restaurant_table WHERE table_id = ?");
    $stmt->bind_param("i", $table_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllRestaurantTables() {
    global $conn;
    return $conn->query("SELECT * FROM restaurant_table")->fetch_all(MYSQLI_ASSOC);
}

function updateRestaurantTable($table_id, $capacity, $status, $table_no) {
    global $conn;
    $stmt = $conn->prepare("UPDATE restaurant_table SET capacity=?, status=?, table_no=? WHERE table_id=?");
    $stmt->bind_param("issi", $capacity, $status, $table_no, $table_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteRestaurantTable($table_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM restaurant_table WHERE table_id = ?");
    $stmt->bind_param("i", $table_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>