<?php

try {
    $mysqli = mysqli_connect(
        "localhost",
        "root",
        "",
        "pdf_database"
    ) or die("Connection Failed");

    if ($mysqli->connect_errno) {
        echo "Connect to database failed";
        exit();
    }
} catch (Exception $e) {
    echo "Exception arisen";
}
