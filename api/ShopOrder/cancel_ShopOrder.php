<?php
include_once(dirname(__FILE__, 2) . "/onload.php");
$action_by = $token->userid;
if($_POST["action"] == "Cancel" ){
    try {
    $sql = "SELECT * FROM so_detail WHERE so_no = '".$_POST["id"]."' ";
    $stmt = $conn->query($sql);

    $conn->beginTransaction();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $prod_code = $row['prod_code'];
        $amount = $row['amount'];
        $size_id = $row['size_id'];

        $strSQLUpdateStock = "UPDATE stock SET ";
        $strSQLUpdateStock .= "amount= amount+'".$amount."' ,price= amtprice*amount ,amtprice= price/amount ";
        $strSQLUpdateStock .= ",e_date='".date("Y-m-d H:i:s")."' ";
        $strSQLUpdateStock .= "WHERE prod_code = '".$prod_code."' and size_id = '".$size_id."' ";
        $stmtUpdateStock = $conn->prepare($strSQLUpdateStock);   
        $stmtUpdateStock->execute();   
    }
        $strSQLUpdateSO = "UPDATE so SET ";
        $strSQLUpdateSO .= "status='ยกเลิก'";
        $strSQLUpdateSO .= ",e_by='".$action_by."',e_date='".date("Y-m-d H:i:s")."' ";
        $strSQLUpdateSO .= "WHERE so_no = '".$_POST["id"]."'";
        $stmtUpdateSO = $conn->prepare($strSQLUpdateSO);   
        $stmtUpdateSO->execute();

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => '1', 'message' => $_POST["id"]));
    } catch (PDOException $e) {
        $conn->rollback();
        echo json_encode(array('status' => '0', 'message' => 'Error Cancel Order!'));
    }
}

?>
