<?php

header("Content-Type: application/json");

require_once("connection.php");

try {

    $query = $mysqli->query("SELECT * FROM pdf_table");

    if ($query == null || empty($query)) {
        exit();
    }
    $post = array();

    while ($data = mysqli_fetch_assoc($query)) {
        array_push($post, $data);
    }

    http_response_code(200);
    echo json_encode($post);
} catch (Exception $ex) {
    http_response_code(500);
    echo "Server Error";
}
