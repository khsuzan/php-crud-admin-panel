<?php

require_once("connection.php");

global $mysqli;

// If body data null, exit
if (!isset($_GET["id"])) {
    exit();
}

$id = $_GET["id"];

try {
    $query = $mysqli->query("SELECT * FROM pdf_table WHERE id='$id'");
    $fetched = $query->fetch_object();
    if (is_null($fetched)) {
        echo "No Item with this id";
        exit();
    }

    $delete_query = $mysqli->query("DELETE FROM pdf_table WHERE id='$id'");

    if ($delete_query) {
        $path = $fetched->url;
        $file_delete = unlink($path);
        if ($file_delete) {
            http_response_code(200);
            echo "Success";
        } else {
            http_response_code(200);
            echo "File Delete Unsuccess";
        }
    } else {
        http_response_code(400);
        echo "Database Failure";
    }
} catch (Exception $th) {
    http_response_code(500);
    echo "Server Failure";
}
