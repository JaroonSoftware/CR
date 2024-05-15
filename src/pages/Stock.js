import { SearchOutlined, ToolTwoTone } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button,Input,Space,Table,Row,Col,Card,Modal,Form,Select,Badge,Upload} from "antd";
import Swal from "sweetalert2";
import StockService from "../service/StockService";

function Stock() {
  const [AllStock, setAllStock] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  useEffect(() => {
    GetAllStock();

  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}  
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "รายการสินค้า",
      dataIndex: "prod_name",
      key: "prod_name",
      ...getColumnSearchProps("prod_name"),
      sorter: (a, b) => a.prod_name.length - b.prod_name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
        title: "ประเภทสินค้า ",
        dataIndex: "type",
        key: "type",
        ...getColumnSearchProps("type"),
        sorter: (a, b) => a.type.length - b.type.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "ขนาดสินค้า ",
        dataIndex: "size",
        key: "size",
        ...getColumnSearchProps("size"),
        sorter: (a, b) => a.size.length - b.size.length,
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "จำนวนสินค้าในคลัง ",
        dataIndex: "count",
        key: "count",
        ...getColumnSearchProps("count"),
        sorter: (a, b) => a.count.length - b.count.length,
        sortDirections: ["descend", "ascend"],
        render: (data) => {
            if(data <= 5){ return <span style={{ color: 'red' }}>{data}</span>}
            else{ return <span>{data}</span>}
        },
    },
    // {
    //   title: "สถานะ",
    //   dataIndex: "status",
    //   key: "status",
    //   ...getColumnSearchProps("status"),
    //   sorter: (a, b) => a.status.length - b.status.length,
    //   sortDirections: ["descend", "ascend"],
    //   render: (data) => {
    //     if(data === "อนุมัติการชำระเงิน"){ return <Badge status="success" text="อนุมัติการชำระเงิน" />}
    //     if(data === "รอตรวจสอบ"){ return <Badge color="yellow" text="รอตรวจสอบ" />}  
    //     if(data === "ไม่อนุมัติการชำระเงิน"){ return <Badge color="red" text="ไม่อนุมัติการชำระเงิน" />} 
    //   },
    // },
  ].filter((item) => !item.hidden);

  const GetAllStock = () => {
    StockService.getAllStock()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
            setAllStock(data);
        }
      })
      .catch((err) => {});
  };
  return (
    <>      
      <div className="layout-content">
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllStock} rowKey="id" />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Stock;
