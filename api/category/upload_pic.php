<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    
    include '../conn.php';

    $targetDir = "../../upload_logo/";

    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

     $uid = $_POST['uid'];
     $name =$_FILES["file"]["name"];
     $filename =$uid . '_' . basename($_FILES["file"]["name"]);
     $targetFile = $targetDir . $uid . '_' . basename($_FILES["file"]["name"]);
     $id = "";
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
        if(isset($_POST['ctgy_id'])){
            $strSQLimg = "UPDATE category SET ";
            $strSQLimg .= " img_uid='".$uid."',img_name='".$name."' ";
            $strSQLimg .= ",img_filename='".$filename."' ";
            $strSQLimg .= "WHERE ctgy_id = '".$_POST["ctgy_id"]."' ";
            $stmt_img = $conn->prepare($strSQLimg);  
            $stmt_img->execute();
            $id = $conn->lastInsertId();
        }
        echo json_encode(["status" => "1","id" => $id, "message" => "The file has been uploaded."]);
    } else {
        echo json_encode(["status" => "0", "message" => "Sorry, there was an error uploading your file."]);
    }
?>