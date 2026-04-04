<?php
require_once 'config.php';

function createDeliveryDriver($contact_no, $status, $name) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO delivery_driver (contact_no, status, name) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $contact_no, $status, $name);
    $stmt->execute();
    return $stmt->insert_id;
}

function getDeliveryDriver($delivery_boy_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM delivery_driver WHERE delivery_boy_id = ?");
    $stmt->bind_param("i", $delivery_boy_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllDeliveryDrivers() {
    global $conn;
    return $conn->query("SELECT * FROM delivery_driver")->fetch_all(MYSQLI_ASSOC);
}

function updateDeliveryDriver($delivery_boy_id, $contact_no, $status, $name) {
    global $conn;
    $stmt = $conn->prepare("UPDATE delivery_driver SET contact_no=?, status=?, name=? WHERE delivery_boy_id=?");
    $stmt->bind_param("sssi", $contact_no, $status, $name, $delivery_boy_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteDeliveryDriver($delivery_boy_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM delivery_driver WHERE delivery_boy_id = ?");
    $stmt->bind_param("i", $delivery_boy_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>