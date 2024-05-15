<?php
include_once(dirname(__FILE__, 2) . "/onload.php");
$action_by = $token->userid;

    //Add receipt 
    //rcpt_no 
    $sql_rcpt_no = "SELECT CONCAT('RCPT',DATE_FORMAT(NOW(), '%y'),'/',LPAD(COUNT(rcpt_no) + 1, 6, '0')) AS rcpt_no FROM receipt where rcpt_no LIKE CONCAT('RCPT',DATE_FORMAT(NOW(), '%y'),'/%') ";
    $stmt_rcpt_no = $conn->prepare($sql_rcpt_no);
    $stmt_rcpt_no->execute();
    $row_rcpt_no = $stmt_rcpt_no->fetch(PDO::FETCH_ASSOC);
    $rcpt_no = $row_rcpt_no['rcpt_no'];
    
    $order_no = $_POST["so_no"];
    $amounts = $_POST["amounts"];
    
    $strSQL_receipt = "INSERT INTO receipt (`rcpt_no`, `so_no`, `amounts`, `status`, `c_by`) ";
    $strSQL_receipt .= " VALUES ('" . $rcpt_no . "','" . $order_no . "','" . $amounts . "','1','" . $action_by . "'";
    $strSQL_receipt .= ")";
    $stmt_receipt = $conn->prepare($strSQL_receipt);
    if ($stmt_receipt->execute()) {
        //Update Order 
        $strSQL_SO = "UPDATE so SET ";
        $strSQL_SO .= "status='ชำระเงินแล้ว' where so_no = '".$order_no."'";
        $stmt_SO = $conn->prepare($strSQL_SO);
        //End Update Order 
        if ($stmt_SO->execute()) {
            http_response_code(200);
            echo json_encode(array('status' => '1', 'message' => $rcpt_no));
        }
    } else {
        echo json_encode(array('status' => '0', 'message' => 'Error insert data!'));
    }

?>