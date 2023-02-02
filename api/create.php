<?php

require_once("connection.php");

global $mysqli; // mysqli connection from connection.php

if (!isset($_FILES["file"]) || !isset($_POST["name"])) {
    exit(); // If send data null, exit
}
// [name],[full_path],[type],[tmp_name],[error],[size]
$fileArray = $_FILES["file"];

$local_directory = $fileArray["tmp_name"]; // Recieved File Path

$pdf_name = $_POST["name"] ?? $fileArray["name"]; //Recieved File name

if (empty($pdf_name)) {
    $pdf_name = $fileArray["name"];
}

// In server create upload folder if doesn't exist
if (!file_exists("uploads")) {
    mkdir("uploads");
}
// Server path where file will uploaded "uploads"
$new_directory = "uploads/" . (int)(microtime(true) * 1000) . "-"
    . preg_replace('/\s|[-]/i', '', $fileArray["name"]);

try {
    // upload local to server function
    if (move_uploaded_file($local_directory, $new_directory)) {
        // Insert data to database
        $insert_query = $mysqli->query("INSERT INTO pdf_table (name,url) VALUES ('$pdf_name','$new_directory')");
        if ($insert_query) { // Insert success
            http_response_code(200);
            echo "Successful";
        } else { // Insert Failed
            http_response_code(400);
            echo "Database insertion unsuccess";
        }
    } else {
        http_response_code(400); // File Upload Failed.
        echo "Upload Unsuccess";
    }
} catch (Exception $ex) {
    http_response_code(500); // Server error.
    echo "Server Error";
}
