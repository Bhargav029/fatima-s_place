<?php
require_once 'config.php';

function createCategory($category_name) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO menu_categories (category_name) VALUES (?)");
    $stmt->bind_param("s", $category_name);
    $stmt->execute();
    return $stmt->insert_id;
}

function getCategory($category_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM menu_categories WHERE category_id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function getAllCategories() {
    global $conn;
    return $conn->query("SELECT * FROM menu_categories")->fetch_all(MYSQLI_ASSOC);
}

function updateCategory($category_id, $category_name) {
    global $conn;
    $stmt = $conn->prepare("UPDATE menu_categories SET category_name = ? WHERE category_id = ?");
    $stmt->bind_param("si", $category_name, $category_id);
    $stmt->execute();
    return $stmt->affected_rows;
}

function deleteCategory($category_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM menu_categories WHERE category_id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    return $stmt->affected_rows;
}
?>