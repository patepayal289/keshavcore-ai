<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require '../config/database.php';

$id = $_POST['id'] ?? '';

if (empty($id)) {
    echo json_encode(["status" => "error", "message" => "Missing ID"]);
    exit();
}

try {
    $stmt = $conn->prepare("DELETE FROM generations WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
