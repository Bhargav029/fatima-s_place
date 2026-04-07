<?php
// Handle CORS and Preflight Requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If it's an OPTIONS request, exit immediately with a 200 success status
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Require the Razorpay SDK
require('vendor/autoload.php');
// ... (rest of your PHP code stays the same)

use Razorpay\Api\Api;

// YOUR SECURE KEYS (Keep the secret safe!)
$keyId = 'rzp_live_SYAJaSHaJcjETB';
$keySecret = 'ecHbEEwvcxfgHOFeuPcw8Nip'; // <-- GET THIS FROM RAZORPAY DASHBOARD

$api = new Api($keyId, $keySecret);
$action = $_GET['action'] ?? '';

// 1. CREATE ORDER (Called right before opening the gateway)
if ($action === 'create_order') {
    $input = json_decode(file_get_contents('php://input'), true);
    $amountInRupees = $input['amount'] ?? 0;

    if ($amountInRupees <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid amount"]);
        exit;
    }

    try {
        $orderData = [
            'receipt' => 'rcptid_' . time(),
            'amount' => $amountInRupees * 100, // Razorpay expects amount in PAISE
            'currency' => 'INR',
            'payment_capture' => 1 // Auto capture
        ];

        $razorpayOrder = $api->order->create($orderData);

        echo json_encode([
            "id" => $razorpayOrder['id'],
            "amount" => $razorpayOrder['amount']
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// 2. VERIFY PAYMENT (Called after user enters OTP/Pin)
elseif ($action === 'verify_payment') {
    $input = json_decode(file_get_contents('php://input'), true);

    $razorpay_payment_id = $input['razorpay_payment_id'] ?? '';
    $razorpay_order_id = $input['razorpay_order_id'] ?? '';
    $razorpay_signature = $input['razorpay_signature'] ?? '';

    try {
        $attributes = array(
            'razorpay_order_id' => $razorpay_order_id,
            'razorpay_payment_id' => $razorpay_payment_id,
            'razorpay_signature' => $razorpay_signature
        );

        $api->utility->verifyPaymentSignature($attributes);
        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["status" => "failed", "error" => $e->getMessage()]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Invalid action"]);
}