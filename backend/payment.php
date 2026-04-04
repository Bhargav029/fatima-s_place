<?php
// 1. CRITICAL CORS HEADERS - MUST BE AT THE VERY TOP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// 2. HANDLE THE PREFLIGHT "OPTIONS" REQUEST
// When React checks for permission, we must exit early and say "Yes, you are allowed"
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. YOUR RAZORPAY KEYS
$key_id = 'rzp_live_SYAJaSHaJcjETB'; // Make sure this matches React!
$key_secret = 'YOUR_RAZORPAY_SECRET'; // GET THIS FROM YOUR DASHBOARD

// 4. READ THE JSON FROM REACT
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ==========================================
// ACTION 1: CREATE THE ORDER
// ==========================================
if ($action === 'create_order') {
    $amount = isset($data['amount']) ? $data['amount'] : 0;

    $orderData = [
        "receipt" => "rcptid_" . rand(1000, 9999),
        "amount" => $amount * 100, // Amount in paise
        "currency" => "INR"
    ];

    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt($ch, CURLOPT_USERPWD, $key_id . ':' . $key_secret);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    http_response_code($http_code);
    echo $response;
    exit();
}

// ==========================================
// ACTION 2: VERIFY THE PAYMENT
// ==========================================
elseif ($action === 'verify_payment') {
    $razorpay_order_id = $data['razorpay_order_id'];
    $razorpay_payment_id = $data['razorpay_payment_id'];
    $razorpay_signature = $data['razorpay_signature'];

    $payload = $razorpay_order_id . '|' . $razorpay_payment_id;
    $generated_signature = hash_hmac('sha256', $payload, $key_secret);

    if (hash_equals($generated_signature, $razorpay_signature)) {
        echo json_encode(["status" => "success", "message" => "Payment verified!"]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid signature sent!"]);
    }
    exit();
}

// Fallback for invalid action
else {
    http_response_code(404);
    echo json_encode(["error" => "Invalid action specified."]);
    exit();
}
?>