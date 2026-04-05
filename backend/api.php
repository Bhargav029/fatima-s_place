<?php
header("Access-Control-Allow-Origin: *"); // Allows your React app to talk to this PHP script
header("Content-Type: application/json; charset=UTF-8");

require_once 'config.php';
require_once 'food_items.php'; // Include the relevant CRUD file

$action = $_GET['action'] ?? '';

if ($action == 'get_menu') {
    $items = getAllFoodItems(); // Calling function from food_items.php
    echo json_encode($items);
}
?>