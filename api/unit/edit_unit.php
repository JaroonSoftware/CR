<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    
    include '../conn.php';
        

    $sql = "UPDATE unit SET ";
    $sql .= " unit='".$_POST["Editunitname"]."',status='".$_POST["Editstatusunit"]."' ";
    $sql .= ",e_date='".date("Y-m-d")."',e_time='".date("H:i:s")."',e_user='0' ";
    $sql .= "WHERE unitcode= '".$_POST["Editunitcode"]."' ";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'แก้ไข Unit สำเร็จ'];
    } else {
        $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
    }
    echo json_encode($response);   