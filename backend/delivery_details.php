<?php
require_once 'config.php';

function createDeliveryDetail($order_id, $order_tracking, $status, $phone, $delivery_boy_id) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO delivery_details (order_id, order_tracking, status, phone, delivery_boy_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("isisi", $order_id, $order_tracking, $status, $phone, $delivery_boy_id);
    $stmt->execute();
    return $stmt->insert_id;
}

function getDeliveryDetail($delivery_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM delivery_details WHERE delivery_id = ?");
    $stmt->bind_param("i", $delivery_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllDeliveryDetails() {
    global $conn;
    return $conn->query("SELECT * FROM delivery_details")->fetch_all(MYSQLI_ASSOC);
}

function updateDeliveryDetail($delivery_id, $order_id, $order_tracking, $status, $phone, $delivery_boy_id) {
    global $conn;
    $stmt = $conn->prepare("UPDATE delivery_details SET order_id=?, order_tracking=?, status=?, phone=?, delivery_boy_id=? WHERE delivery_id=?");
    $stmt->bind_param("isissi", $order_id, $order_tracking, $status, $phone, $delivery_boy_id, $delivery_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteDeliveryDetail($delivery_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM delivery_details WHERE delivery_id = ?");
    $stmt->bind_param("i", $delivery_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>