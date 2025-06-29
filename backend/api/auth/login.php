<?php
// Include CORS configuration first
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/User.php';

// Add error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$user = new User($db);

// Get the raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input);

// Log the received data for debugging
error_log("Login attempt - Raw input: " . $input);
error_log("Login attempt - Parsed data: " . print_r($data, true));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $user->password = $data->password;

    if($user->login()) {
        http_response_code(200);
        echo json_encode(array(
            "message" => "Login successful.",
            "user" => array(
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "age" => $user->age,
                "gender" => $user->gender,
                "height" => $user->height,
                "weight" => $user->weight,
                "medicalHistory" => $user->medical_history,
                "fitnessGoals" => $user->fitness_goals,
                "pregnancyStatus" => $user->pregnancy_status,
                "contactInfo" => array(
                    "phone" => $user->phone,
                    "address" => $user->address,
                    "emergencyContact" => $user->emergency_contact
                ),
                "createdAt" => $user->created_at
            )
        ));
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Invalid credentials."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Email and password are required."));
}
?>