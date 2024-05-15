<?php
include_once(dirname(__FILE__, 2) . "/onload.php");
$action_by = $token->userid;

//PO Code
$sql_pocode = "SELECT CONCAT('PO',DATE_FORMAT(NOW(), '%y'),'/',LPAD(COUNT(id) + 1, 4, '0')) AS po_code FROM po where po_code LIKE  CONCAT('PO',DATE_FORMAT(NOW(), '%y'),'/%') ";
$stmt_pocode = $conn->prepare($sql_pocode);
$stmt_pocode->execute();
$row_po = $stmt_pocode->fetch(PDO::FETCH_ASSOC);
$pocode = $row_po['po_code'];
//end PO Code

//Insert PO
$strSQL = "INSERT INTO po (`po_code`, `supcode`, `po_date`, `del_date`, `payment`, `vat`, `remark`, `status`, `c_by`) ";
$strSQL .= " VALUES ('" . $pocode . "','" . $_POST["supcode"] . "','" . date('Y-m-d', strtotime($_POST["po_date"])) . "','" . date('Y-m-d', strtotime($_POST["del_date"])) . "','" . $_POST["payment"] . "','" . $_POST["vat"] . "','" . $_POST["remark"] . "','WR','" . $action_by . "' ";
$strSQL .= ")";
//echo $strSQL;
$stmt = $conn->prepare($strSQL);
//end Insert PO


if ($stmt->execute()) {
    //Insert PO Detail
    $st = 1;
    foreach ($_POST['Item'] as $index => $object) {
            $no = $object['No'];
            $prod_code = $object['prod_code'];
            $amount = $object['amount'];
            $size_id = $object['size_id'];
            $unit_id = $object['unit_id'];
            $price = $object['price'];
            $discount = $object['discount'];

            $strSqlDetail = "INSERT INTO po_detail ( `po_code`, `no`, `prod_code`, `size_id`, `amount`, `price`, `unit_id`, `discount`, `recamount`, `status` ) ";
            //  ,`s_date`,`s_time`, s_user) ";
            $strSqlDetail .= " VALUES ('" . $pocode . "','" . $no . "','" . $prod_code . "','" . $size_id . "','" . $amount . "','" . $price . "','".  $unit_id . "','". $discount . "','0', 'รอรับ' ";
            $strSqlDetail .= ")";
            //echo $strSqlDetail;
            $stmt_Detail = $conn->prepare($strSqlDetail);
            if($stmt_Detail->execute()){
                $st =1;
            }else{
                $st =0;
                return;
            }
    }
    //end Insert PO Detail
    if ($st==1) {
        http_response_code(200);
        echo json_encode(array('status' => '1', 'message' => $pocode));
    }else{
        echo json_encode(array('status' => '0', 'message' => 'Error insert Po Detail!'));
    }
} else {
    echo json_encode(array('status' => '0', 'message' => 'Error insert Po!'));
}
