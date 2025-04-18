# 🦄 DEX Deployer (Polygon Edition)

## What is this?  
A complete toolkit for deploying your own Uniswap V2 DEX (Decentralized Exchange) on the Polygon blockchain, creating liquidity pools, and managing your DEX — all from the command line, with no slow web interface needed!

---

## ✨ Features
- **Deploy Uniswap V2 contracts** (Factory, Router, WETH9 or use WMATIC)
- **Create your own pools** for any ERC20 token on Polygon
- **Add liquidity** to your pools via script
- **Fully scriptable**: No web UI, everything is automated and reproducible
- **Easy configuration** via JSON
- **Wallet management** via simple text file
- **Batch scripts** for Windows users
- **Cleanup/archiving** for legacy files

---

## 🌐 Changing the Blockchain Network (Chain)

To use a different blockchain (e.g. Polygon, Mumbai Testnet, or another EVM-compatible chain), simply edit these values in `pool-helper/pool-config.json`:

- `chainId`: The numeric chain ID (e.g. 137 for Polygon Mainnet, 80001 for Mumbai Testnet)
- `rpcUrl`: The RPC endpoint for your chosen network

**Example:**
```json
"chainId": 137,
"rpcUrl": "https://polygon-rpc.com"
```

You can also update the router and factory addresses if you want to use existing contracts on another chain.

---

## 🚀 Quick Start

1. **Clone this repo** and install dependencies:
   ```sh
   npm install
   ```

2. **Prepare your wallet:**
   - Create a `wallet.txt` file in the main directory:
     ```
     0xYourPolygonAddress
     your_private_key
     ```

3. **Configure your deployment:**
   - Edit `pool-helper/pool-config.json` to set your tokens, router, factory, RPC, etc.

4. **Deploy contracts (if needed):**
   - Use `direct-deploy.js` to deploy your own Uniswap V2 instance, or use existing contracts on Polygon.

5. **Create a pool:**
   - Run:
     ```sh
     cd pool-helper
     create-pair.bat
     # or
     node create-pair.js
     ```

6. **Add liquidity:**
   - (Script coming soon!)

---

## 📁 Project Structure

- `pool-helper/` — Scripts for pool creation and liquidity
- `direct-deploy.js` — Deploys Uniswap V2 contracts
- `wallet.txt` — Your wallet address and private key (never share this!)

- `package.json` — Node.js dependencies

---

## 🛡️ Security & Responsibility Notice
- **Never share your `wallet.txt` or private key!**
- Use a fresh wallet for testing/deployment.
- This is a developer tool — use at your own risk!
- **Disclaimer:** This project does not provide or recommend any automatic file cleanup scripts. The maintainers take no responsibility for file deletion, movement, or data loss. Please manage your files with care.

---

## 💡 Why?
- Tired of slow web UIs for creating pools?
- Want to automate DEX management?
- Need a reproducible, scriptable setup for Polygon?

**This repo is for you!**

---

## 🤝 Contributing
PRs welcome! Feel free to fork, adapt, or suggest improvements.

---

## 📝 License
MIT
