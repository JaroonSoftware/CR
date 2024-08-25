<?php
include_once(dirname(__FILE__, 2) . "/onload.php");
$action_by = $token->userid;
if($_POST["action"] == "Delivery" ){
    try {

    $conn->beginTransaction();

        $strSQLUpdateSO = "UPDATE so SET ";
        $strSQLUpdateSO .= "status_delivery = 'จัดส่งแล้ว'";
        $strSQLUpdateSO .= ",e_by='".$action_by."' ,e_date='".date("Y-m-d H:i:s")."' ";
        $strSQLUpdateSO .= "WHERE so_no = '".$_POST["id"]."'";
        $stmtUpdateSO = $conn->prepare($strSQLUpdateSO);   
        $stmtUpdateSO->execute();

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => '1', 'message' => $_POST["id"]));
    } catch (PDOException $e) {
        $conn->rollback();
        echo json_encode(array('status' => '0', 'message' => 'Error action Delivery!'));
    }
}

?>
