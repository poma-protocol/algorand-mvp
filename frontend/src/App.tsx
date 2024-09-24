import "./App.css";
import { HashRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { TokenTransfer } from "./components/TokenTransfer";
import { ReferralClaim1 } from "./components/ReferralClaim1";
import { ReferralClaim2 } from "./components/ReferralClaim2";
import { NFTClaim } from "./components/NFTClaim";
import { useWallet } from "@txnlab/use-wallet-react";
import {
  DownOutlined,
  CheckCircleTwoTone,
  DisconnectOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Button, message } from "antd";
import {  error } from "./utils";

function App() {
  const { wallets, activeWallet, activeAccount, transactionSigner } =
    useWallet();
  const [messageApi, contextHolder] = message.useMessage();

  const wlist = wallets.map((wallet) => ({
    label: wallet.isConnected ? (
      <>
        <Space style={{ color: "#52c41a" }}>
          {wallet.metadata.name}
          {`[${wallet.activeAccount?.address.slice(
            0,
            3
          )}...${wallet.activeAccount?.address.slice(-3)}]`}
          <CheckCircleTwoTone twoToneColor="#52c41a" />
          <Button
            onClick={async () => {
              const r = wallet.disconnect();
              console.log(r);
            }}
            type="dashed"
            danger={true}
            icon={<DisconnectOutlined />}
          />
        </Space>
      </>
    ) : (
      wallet.metadata.name
    ),
    key: wallet.id,
    onClick: async () => {
      if (wallet.isConnected) {
        wallet.setActive();
      } else {
        try {
          const account = await wallet.connect();
          console.log(account);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          error(messageApi, e.message);
          console.log(e);
        }
      }
    },
  }));
  const items: MenuProps["items"] = [
    ...wlist,
    {
      type: "divider",
    },
    {
      label:
        activeWallet && activeWallet.activeAccount ? (
          <>
            <Space>
              <b>
                {`Active wallet: `}
                <span style={{ color: "#52c41a" }}>
                  {activeWallet.metadata.name}
                </span>
              </b>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            </Space>
          </>
        ) : (
          <>No Wallet Connected</>
        ),
      disabled: activeWallet ? false : true,
      key: "999",
    },
    activeAccount && {
      label: (
        <>
          <Space>
            <b>
              {`Active account: `}
              <span style={{ color: "#52c41a" }}>
                {activeAccount.address.slice(0, 3)}...
                {activeAccount.address.slice(-3)}
              </span>
            </b>
          </Space>
        </>
      ),
      key: "999",
    },
  ];

  return (
    <>
      <Router>
        <div className="navbar">
          <Dropdown menu={{ items }}>
            <Button>
              <Space>
                {activeAccount
                  ? `Connected as ${activeAccount.address.slice(
                      0,
                      3
                    )}...${activeAccount.address.slice(-3)}`
                  : "Connect Wallet"}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        <div className="mainWrapper">
          <div className="header">
            <NavLink to="/token">Token</NavLink>

            <NavLink to="/nft">NFT</NavLink>

            <NavLink to="/referral">Referral</NavLink>

            <NavLink to="/performance">Performance</NavLink>
          </div>
          <main>
            <Routes>
              <Route
                path="/token"
                element={
                  <TokenTransfer
                    messageApi={messageApi}
                    activeAccount={activeAccount}
                    transactionSigner={transactionSigner}
                  />
                }
              />
              <Route
                path="/nft"
                element={
                  <NFTClaim
                    messageApi={messageApi}
                    activeAccount={activeAccount}
                    transactionSigner={transactionSigner}
                  />
                }
              />
              <Route
                path="/referral"
                element={
                  <ReferralClaim1
                    messageApi={messageApi}
                    activeAccount={activeAccount}
                    transactionSigner={transactionSigner}
                  />
                }
              />
              <Route
                path="/performance"
                element={
                  <ReferralClaim2
                    messageApi={messageApi}
                    activeAccount={activeAccount}
                    transactionSigner={transactionSigner}
                  />
                }
              />
            </Routes>
          </main>
          {contextHolder}
        </div>
      </Router>
    </>
  );
}

export default App;
