import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import { Dropdown } from "react-bootstrap";
import Blockie from "../Blockie";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Address from "../Address/Address";
// import { SelectOutlined } from "@ant-design/icons";
// import { getExplorer } from "helpers/networks";
import Text from "antd/lib/typography/Text";
import { connectors } from "./config";
const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
    borderColor: "transparent",
  },
  text: {
    color: "#21BF96",
  },
  connector: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "20px 5px",
    cursor: "pointer",
  },
  icon: {
    alignSelf: "center",
    fill: "rgb(40, 13, 95)",
    flexShrink: "0",
    marginBottom: "8px",
    height: "30px",
  },
};

function Account() {
  const { authenticate, isAuthenticated, account, logout, user } = useMoralis();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("userAddress", user.attributes.accounts[0]);
    }
  }, [])

  if (!isAuthenticated || !account) {
    return (
      <>
        <div onClick={() => setIsAuthModalVisible(true)}>
          <p style={{ fontSize: "20px", color: "#1890ff" }}>CONNECT WALLET</p>
        </div>
        <Modal
          visible={isAuthModalVisible}
          footer={null}
          onCancel={() => setIsAuthModalVisible(false)}
          bodyStyle={{
            padding: "15px",
            fontSize: "17px",
            fontWeight: "500",
          }}
          style={{ fontSize: "16px", fontWeight: "500" }}
          width="340px"
        >
          <div
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "20px",
            }}
          >
            Connect Wallet
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {connectors.map(({ title, icon, connectorId }, index) => (
              <div
                style={styles.connector}
                key={index}
                onClick={async () => {
                  try {
                    await authenticate({ provider: connectorId });
                    window.localStorage.setItem("connectorId", connectorId);
                    if (user) {
                      window.localStorage.setItem(
                        "userAddress",
                        user.attributes.accounts[0]
                      );
                    }
                    setIsAuthModalVisible(false);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <img src={icon} alt={title} style={styles.icon} />
                <Text style={{ fontSize: "14px" }}>{title}</Text>
              </div>
            ))}
          </div>
        </Modal>
      </>
    );
  }

  return (
    <>
      {/* <button
        onClick={async () => {
          try {
            console.log("change")
            await web3._provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x38" }],
            });
            console.log("changed")
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Hi
      </button> */}
      <Dropdown>
        <Dropdown.Toggle
          style={styles.account}
          id="dropdown-autoclose-true"
          className="account"
        >
          <p style={{ marginRight: "5px", ...styles.text }}>
            {getEllipsisTxt(account, 6)}
          </p>
          {user?.attributes.profile ? (
            <img
              src={user?.attributes.profile}
              style={{ width: "24px", height: "24px", borderRadius: "100%" }}
              alt="avatar"
            />
          ) : (
            <Blockie currentWallet scale={3} />
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: "200px" }}>
          <Dropdown.Item href={"/home/account-collector/" + account}>
            Profile
          </Dropdown.Item>
          <Dropdown.Item href={"/home/settings"}>Settings</Dropdown.Item>
          <Dropdown.Item
            onClick={async () => {
              await logout();
              window.localStorage.removeItem("connectorId");
            }}
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {/* <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
          padding: "15px",
          fontSize: "17px",
          fontWeight: "500",
        }}
        style={{ fontSize: "16px", fontWeight: "500" }}
        width="400px"
      >
        Account
        <Card
          style={{
            marginTop: "10px",
            borderRadius: "1rem",
          }}
          bodyStyle={{ padding: "15px" }}
        >
          <Address
            avatar="left"
            size={6}
            copyable
            style={{ fontSize: "20px" }}
          />
          <div style={{ marginTop: "10px", padding: "0 10px" }}>
            <a
              href={`${getExplorer(chainId)}/address/${account}`}
              target="_blank"
              rel="noreferrer"
            >
              <SelectOutlined style={{ marginRight: "5px" }} />
              View on Explorer
            </a>
          </div>
        </Card>
        <Button
          size="large"
          type="primary"
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "0.5rem",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={async () => {
            await logout();
            window.localStorage.removeItem("connectorId");
            setIsModalVisible(false);
          }}
        >
          Disconnect Wallet
        </Button>
      </Modal> */}
    </>
  );
}

export default Account;
