<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;
    if($_POST["action"] == "Approve"){ 
        $strSQL = "UPDATE payment SET ";
        $strSQL .= "so_no='".$_POST["so_no"]."' ";
        $strSQL .= ",status='อนุมัติการชำระเงิน' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE id = '".$_POST["id"]."' ";
        $stmt = $conn->prepare($strSQL);
        if ($stmt->execute()) { 
            //Add receipt 
            //rcpt_no 
            $sql_rcpt_no = "SELECT CONCAT('RCPT',DATE_FORMAT(NOW(), '%y'),'/',LPAD(COUNT(rcpt_no) + 1, 6, '0')) AS rcpt_no FROM receipt where rcpt_no LIKE CONCAT('RCPT',DATE_FORMAT(NOW(), '%y'),'/%') ";
            $stmt_rcpt_no = $conn->prepare($sql_rcpt_no);
            $stmt_rcpt_no->execute();
            $row_rcpt_no = $stmt_rcpt_no->fetch(PDO::FETCH_ASSOC);
            $rcpt_no = $row_rcpt_no['rcpt_no'];
            $amounts = str_replace(",", "", $_POST["price"]);
            $strSQL_receipt = "INSERT INTO receipt (`rcpt_no`, `so_no`, `amounts`, `status`, `c_by`) ";
            $strSQL_receipt .= " VALUES ('" . $rcpt_no . "','" . $_POST["so_no"] . "','" . $amounts . "','1','" . $action_by . "'";
            $strSQL_receipt .= ")";
            $stmt_receipt = $conn->prepare($strSQL_receipt);
            //End Add receipt 
            //Update Order 
            $strSQL_SO = "UPDATE so SET ";
            $strSQL_SO .= "status='ชำระเงินแล้ว' where so_no = '".$_POST["so_no"]."'";
            $stmt_SO = $conn->prepare($strSQL_SO);
            //End Update Order 
            if ($stmt_receipt->execute() && $stmt_SO->execute()) {
                http_response_code(200);
                echo json_encode(array('status' => '1','message'=> ''));
            }else
            {
                echo json_encode(array('status' => '0','message'=> 'Error Approve Payment!'));
            }

        }else
        {
            echo json_encode(array('status' => '0','message'=> 'Error Cancel Payment!'));
        }
    }else{
        echo json_encode(array('status' => '0','message'=> 'Error not send Action!'));
    }

} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		
?>