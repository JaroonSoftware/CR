<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
$action_by = $token->userid;

//GR Code
$sql_grcode = "SELECT CONCAT('GR',DATE_FORMAT(NOW(), '%y'),'/',LPAD(COUNT(gr_code) + 1, 4, '0')) AS gr_code FROM gr where gr_code LIKE  CONCAT('GR',DATE_FORMAT(NOW(), '%y'),'/%') ";
$stmt_grcode = $conn->prepare($sql_grcode);
$stmt_grcode->execute();
$row_gr = $stmt_grcode->fetch(PDO::FETCH_ASSOC);
$grcode = $row_gr['gr_code'];
//end PO Code

//Insert GR
$strSQL = "INSERT INTO gr (`gr_code`, `po_code`, `gr_date`, `payment`, `c_by`) ";
$strSQL .= " VALUES ('" . $grcode . "','" . $_POST["po_code"] . "','" . date('Y-m-d', strtotime($_POST["gr_date"])) . "','" . $_POST["payment"] . "','" . $action_by . "' ";
$strSQL .= ")";
//echo $strSQL;
$stmt = $conn->prepare($strSQL);
//end Insert GR


if ($stmt->execute()) {
    //Insert & Update Detail
    $st = 1;
    foreach ($_POST['Item'] as $index => $object) {
            $podetail_id = $object['podetail_id'];
            $po_code = $object['po_code'];
            $no = $object['No'];
            $prod_code = $object['prod_code'];
            $amount = $object['amount'];
            $size_id = $object['size_id'];
            $price = $object['price'];
            $discount = $object['discount'];

            //Check status
            $sts="";
            $sql_status = "Select amount,recamount From po_detail where po_code = '".$po_code."' and id = '".$podetail_id."' ";
            $stmt_status = $conn->prepare($sql_status);
            $stmt_status->execute();
            $row_sts = $stmt_status->fetch(PDO::FETCH_ASSOC);
            if($row_sts["amount"] != $row_sts["recamount"]+$amount){
                $sts = 'รับยังไม่ครบ';
            }else{
                $sts = 'รับครบแล้ว';
            }

            //End

            //Check stock 
            $sql_ckstock = "Select prod_code From stock where prod_code = '".$prod_code."' and size_id = '".$size_id."' ";
            $stmt_ckstock = $conn->prepare($sql_ckstock);
            $stmt_ckstock->execute();
            $row_ckstock = $stmt_ckstock->fetchColumn();
            if($row_ckstock > 0){
            //Update Stock
            $strSQLUpdateStock = "UPDATE stock SET ";
            $strSQLUpdateStock .= " price= price + '".(($price*$amount)-(($price*$amount)*$discount/100))."',amount= amount+'".$amount."',amtprice= price/amount ";
            $strSQLUpdateStock .= ",e_date='".date("Y-m-d H:i:s")."' ";
            $strSQLUpdateStock .= "WHERE prod_code = '".$prod_code."' and size_id = '".$size_id."' ";
            $stmtUpdateStock = $conn->prepare($strSQLUpdateStock);   
            $stmtUpdateStock->execute();
            }else{
            //Insert Stock
            $strSqlInsertStock = "INSERT INTO stock ( `prod_code`, `price`, `amtprice`, `amount`, `size_id`, `e_date` ) ";
            $strSqlInsertStock .= " VALUES ('" . $prod_code . "','" . (($price*$amount)-(($price*$amount)*$discount/100)) . "','" . ((($price*$amount)-(($price*$amount)*$discount/100))/$amount) . "','" . $amount . "','" . $size_id . "','". date("Y-m-d H:i:s") . "' ";
            $strSqlInsertStock .= ")";
            $stmt_InsertStock = $conn->prepare($strSqlInsertStock);
            $stmt_InsertStock->execute();
            }
            //End

            //Update Po Detail
            $strSQLUpdatePoDetail = "UPDATE po_detail SET ";
            $strSQLUpdatePoDetail .= " recamount= recamount + '".$amount."',status='".$sts."'";
            $strSQLUpdatePoDetail .= "WHERE po_code = '".$po_code."' and id = '".$podetail_id."' ";
            $stmtUpdatePoDetail = $conn->prepare($strSQLUpdatePoDetail);   
            $stmtUpdatePoDetail->execute();
            //End

            //Insert GR Detail
            $strSqlInsertGRDetail = "INSERT INTO gr_detail ( `gr_code`, `gr_no`, `prod_code`, `size_id`, `amount`, `discount`,  `id_po_detail` ) ";
            $strSqlInsertGRDetail .= " VALUES ('" . $grcode . "','" . $no . "','" . $prod_code . "','" . $size_id . "','" . $amount . "','".  $discount . "','". $podetail_id . "'";
            $strSqlInsertGRDetail .= ")";
            $stmt_InsertGRDetail = $conn->prepare($strSqlInsertGRDetail);
            if($stmt_InsertGRDetail->execute()){
                $st =1;
            }else{
                $st =0;
                return;
            }
    }
    //Update PO status
    $sql_ckpo = "Select po_code From po_detail where po_code = '".$po_code."' and (status = 'รับยังไม่ครบ' or status = 'รอรับ') ";
    $stmt_ckpo = $conn->prepare($sql_ckpo);
    $stmt_ckpo->execute();
    $row_ckpo = $stmt_ckpo->fetchColumn();
    if($row_ckpo > 0){
        $strSQLUpdatePoSts = "UPDATE po SET ";
        $strSQLUpdatePoSts .= "status='NC'";
        $strSQLUpdatePoSts .= ",e_date='".date("Y-m-d H:i:s")."' ";
        $strSQLUpdatePoSts .= "WHERE po_code = '".$po_code."'";
        $stmtUpdatePoSts = $conn->prepare($strSQLUpdatePoSts);   
        $stmtUpdatePoSts->execute();
    }else{
        $strSQLUpdatePoSts = "UPDATE po SET ";
        $strSQLUpdatePoSts .= "status='CP'";
        $strSQLUpdatePoSts .= ",e_date='".date("Y-m-d H:i:s")."' ";
        $strSQLUpdatePoSts .= "WHERE po_code = '".$po_code."'";
        $stmtUpdatePoSts = $conn->prepare($strSQLUpdatePoSts);   
        $stmtUpdatePoSts->execute();
    }
    //End

    //end Insert  Detail
    if ($st==1) {
        http_response_code(200);
        echo json_encode(array('status' => '1', 'message' => $grcode));
    }else{
        echo json_encode(array('status' => '0', 'message' => 'Error insert Gr Detail!'));
    }
} else {
    echo json_encode(array('status' => '0', 'message' => 'Error insert Gr!'));
}

ob_end_flush();
exit;
?>