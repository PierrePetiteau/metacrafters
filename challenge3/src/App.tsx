import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import { PhantomProvider } from "./types";

/**
 * @description gets Phantom provider, if it exists
 */
const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};

function App() {
  const [provider, setProvider] = useState<PhantomProvider>();
  const [walletKey, setWalletKey] = useState<string>();

  useEffect(() => {
    setProvider(getProvider() ?? undefined);
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        const response = await provider.connect();
        console.log("wallet account ", response.publicKey.toString());
        setWalletKey(response.publicKey.toString());
      } catch (err) {
        console.log("---------", "err", err);
      }
    }
  };

  const disconnectWallet = async () => {
    if (provider) {
      try {
        await provider.disconnect();
        setWalletKey(undefined);
      } catch (err) {
        console.log("---------", "err", err);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Connect to Phantom Wallet</h2>
      </header>
      {provider && !walletKey ? (
        <button
          style={{
            fontSize: "16px",
            padding: "15px",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            fontSize: "16px",
            padding: "15px",
            fontWeight: "bold",
            borderRadius: "5px",
            color: "red",
          }}
          onClick={disconnectWallet}
        >
          Disconnect Wallet
        </button>
      )}

      {provider && walletKey ? (
        <div>
          <h2 className="green">Connected</h2>
          <p className="white">{`${walletKey}`}</p>
        </div>
      ) : null}

      {!provider ? (
        <p>
          No provider found. Install <a href="https://phantom.app/">Phantom Browser extension</a>
        </p>
      ) : null}
    </div>
  );
}

export default App;
