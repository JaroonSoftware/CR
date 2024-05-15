<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;
    if($_POST["action"] == "Cancel"){
        $strSQL = "UPDATE receipt SET ";
        $strSQL .= " status='ยกเลิก' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE rcpt_no = '".$_POST["id"]."' ";
        $stmt = $conn->prepare($strSQL);
        if ($stmt->execute()) { 
            //qry
            $sql_so_no = "select * from receipt where rcpt_no = '".$_POST["id"]."'";
            $stmt_so_no = $conn->prepare($sql_so_no);
            $stmt_so_no->execute();
            $row_so_no = $stmt_so_no->fetch(PDO::FETCH_ASSOC);
            $so_no = $row_so_no['so_no'];

            $strSQL_update = "UPDATE so SET ";
            $strSQL_update .= " status='รอชำระ' ";
            $strSQL_update .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
            $strSQL_update .= "WHERE so_no = '".$so_no."' ";
            $stmt_update = $conn->prepare($strSQL_update);
            if ($stmt_update->execute()) { 
                echo json_encode(array('status' => '1','message'=> $_POST["id"]));
            }

        }else
        {
            echo json_encode(array('status' => '0','message'=> 'Error Cancel receipt!'));
        }
    }else{
        echo json_encode(array('status' => '0','message'=> 'Error not send Action!'));
    }

} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  	

?>