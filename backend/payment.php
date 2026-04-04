<?php
require_once 'config.php';

function createPayment($amount, $order_id, $method, $status, $paid_at) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO payment (amount, order_id, method, status, paid_at) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("diss", $amount, $order_id, $method, $status, $paid_at);
    $stmt->execute();
    return $stmt->insert_id;
}

function getPayment($payment_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM payment WHERE payment_id = ?");
    $stmt->bind_param("i", $payment_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllPayments() {
    global $conn;
    return $conn->query("SELECT * FROM payment")->fetch_all(MYSQLI_ASSOC);
}

function updatePayment($payment_id, $amount, $order_id, $method, $status, $paid_at) {
    global $conn;
    $stmt = $conn->prepare("UPDATE payment SET amount=?, order_id=?, method=?, status=?, paid_at=? WHERE payment_id=?");
    $stmt->bind_param("disssi", $amount, $order_id, $method, $status, $paid_at, $payment_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deletePayment($payment_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM payment WHERE payment_id = ?");
    $stmt->bind_param("i", $payment_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>