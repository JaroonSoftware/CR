<?php

include_once(dirname(__FILE__, 2)."/onload.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $action_by = $token->userid;

        $strSQL = "UPDATE po SET ";
        $strSQL .= " po_date='".date('Y-m-d', strtotime($_POST["Editpo_date"]))."',del_date='".date('Y-m-d', strtotime($_POST["Editdel_date"]))."',payment='".$_POST["Editpayment"]."',vat='".$_POST["Editvat"]."',remark='".$_POST["Editremark"]."' ";
        $strSQL .= ",e_date='".date("Y-m-d H:i:s")."',e_by='".$action_by."'  ";
        $strSQL .= "WHERE po_code = '".$_POST["Editpo_no"]."' ";
        $stmt = $conn->prepare($strSQL);
        if ($stmt->execute()) {  
            //Update PO Detail
            foreach ($_POST['EditItem'] as $index => $object) {
                    $id = $object['podetail_id'];
                    $amount = $object['amount'];
                    $price = $object['price'];
                    $discount = $object['discount'];
                    $status = $object['status_item'];

                    if(!$status){ //ถ้าเป็น true คือรับครบแล้ว
                        $strSqlDetail = "UPDATE po_detail SET ";
                        $strSqlDetail .= " amount='".$amount."',price='".$price."',discount='".$discount."' ";
                        $strSqlDetail .= "WHERE id = '".$id."' ";
                        //echo $strSqlDetail;
                        $stmt_Detail = $conn->prepare($strSqlDetail);
                        if($stmt_Detail->execute()){
                            $st =1;
                        }else{
                            $st =0;
                            return;
                        }
                    }
            }
            //end Update PO Detail

            if ($stmt->execute()) {
                echo json_encode(array('status' => '1','message'=> $_POST["Editpo_no"]));
            }
            else
            {
                echo json_encode(array('status' => '0','message'=> 'Error Update Item data!'));
            }
        } else {
            echo json_encode(array('status' => '0', 'message' => 'Error Update Po!'));
        }  

} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}  
		
?>