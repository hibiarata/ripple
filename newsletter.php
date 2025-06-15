<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';

// Validate email
if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'メールアドレスを入力してください。']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => '有効なメールアドレスを入力してください。']);
    exit;
}

// Define CSV file path (outside web root)
$csvFile = __DIR__ . '/private/newsletter_subscribers.csv';

// Create directory if it doesn't exist
$privateDir = dirname($csvFile);
if (!is_dir($privateDir)) {
    mkdir($privateDir, 0755, true);
}

// Check if email already exists
if (file_exists($csvFile)) {
    $handle = fopen($csvFile, 'r');
    while (($data = fgetcsv($handle)) !== FALSE) {
        if (isset($data[0]) && $data[0] === $email) {
            fclose($handle);
            echo json_encode(['success' => false, 'message' => 'このメールアドレスは既に登録されています。']);
            exit;
        }
    }
    fclose($handle);
}

// Add email to CSV file
$handle = fopen($csvFile, 'a');
if ($handle === false) {
    echo json_encode(['success' => false, 'message' => 'データの保存に失敗しました。']);
    exit;
}

// Write email with timestamp
$data = [
    $email,
    date('Y-m-d H:i:s'),
    $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

if (fputcsv($handle, $data)) {
    fclose($handle);
    echo json_encode(['success' => true, 'message' => '登録ありがとうございました。']);
} else {
    fclose($handle);
    echo json_encode(['success' => false, 'message' => 'データの保存に失敗しました。']);
}
?>