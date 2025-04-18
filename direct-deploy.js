const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// ABIs und Bytecodes direkt aus den Uniswap-Paketen laden
const WETH9 = require("@uniswap/v2-periphery/build/WETH9.json");
const UniswapV2Factory = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const UniswapV2Router02 = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");

async function main() {
  try {
    console.log("Starte direktes Deployment von Uniswap V2 ohne Hardhat...");
    
    // RPC-URL und Chain-ID für die benutzerdefinierte Blockchain
    const RPC_URL = "https://polygon-rpc.com";
    const CHAIN_ID = 137;
    
    // Provider erstellen
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    console.log(`Verbunden mit Chain-ID: ${(await provider.getNetwork()).chainId}`);
    
    // Wallet aus wallet.txt laden
    const walletPath = path.join(__dirname, "wallet.txt");
    const walletContent = fs.readFileSync(walletPath, "utf8").trim().split("\n");
    
    if (walletContent.length < 2) {
      throw new Error("wallet.txt hat nicht das erwartete Format");
    }
    
    const addressLine = walletContent[0];
    const keyLine = walletContent[1];
    
    const address = addressLine.trim();
    const privateKey = keyLine.includes(":") ? keyLine.split(":")[1].trim() : keyLine.trim();
    
    // Wallet mit Provider verbinden
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`Deployer-Adresse: ${wallet.address}`);
    
    const balance = await provider.getBalance(wallet.address);
    console.log(`Guthaben: ${ethers.utils.formatEther(balance)} ETH`);
    
    // 1. WETH9 deployen
    console.log("\nDeploye WETH9...");
    const wethFactory = new ethers.ContractFactory(
      WETH9.abi,
      WETH9.bytecode,
      wallet
    );
    
    // Gaspreis abfragen und Minimum setzen
let currentGasPrice = await provider.getGasPrice();
const minGasPrice = ethers.utils.parseUnits("50", "gwei");
if (currentGasPrice.lt(minGasPrice)) {
  currentGasPrice = minGasPrice;
}
const weth = await wethFactory.deploy({
  gasLimit: 5000000,
  gasPrice: currentGasPrice
});
    
    console.log(`WETH9-Transaktion gesendet: ${weth.deployTransaction.hash}`);
    await weth.deployed();
    console.log(`WETH9 erfolgreich bereitgestellt: ${weth.address}`);
    
    // 2. Factory deployen
    console.log("\nDeploye UniswapV2Factory...");
    const factoryFactory = new ethers.ContractFactory(
      UniswapV2Factory.abi,
      UniswapV2Factory.bytecode,
      wallet
    );
    
    const factory = await factoryFactory.deploy(wallet.address, {
  gasLimit: 5000000,
  gasPrice: currentGasPrice
});
    
    console.log(`Factory-Transaktion gesendet: ${factory.deployTransaction.hash}`);
    await factory.deployed();
    console.log(`UniswapV2Factory erfolgreich bereitgestellt: ${factory.address}`);
    
    // 3. Router deployen
    console.log("\nDeploye UniswapV2Router02...");
    const routerFactory = new ethers.ContractFactory(
      UniswapV2Router02.abi,
      UniswapV2Router02.bytecode,
      wallet
    );
    
    const router = await routerFactory.deploy(factory.address, weth.address, {
  gasLimit: 6000000,
  gasPrice: currentGasPrice
});
    
    console.log(`Router-Transaktion gesendet: ${router.deployTransaction.hash}`);
    await router.deployed();
    console.log(`UniswapV2Router02 erfolgreich bereitgestellt: ${router.address}`);
    
    // Deployment-Informationen speichern
    const deploymentData = {
      chain: {
        name: "custom",
        id: CHAIN_ID,
        rpc: RPC_URL
      },
      deployer: wallet.address,
      contracts: {
        weth: weth.address,
        factory: factory.address,
        router: router.address
      },
      timestamp: new Date().toISOString()
    };
    
    // JSON-Datei speichern
    fs.writeFileSync(
      path.join(__dirname, "direct-deployments.json"),
      JSON.stringify(deploymentData, null, 2)
    );
    
    // Log-Datei mit menschenlesbaren Informationen erstellen
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const logFileName = `deployment-log-${timestamp}.txt`;
    
    const logContent = `
============================================================
  UNISWAP V2 DEPLOYMENT LOG - ${timestamp}
============================================================

Chain Information:
  - Name: Custom Blockchain
  - Chain ID: ${CHAIN_ID}
  - RPC URL: ${RPC_URL}

Deployer: 
  - Address: ${wallet.address}

Deployed Contracts:
  1. WETH9 (Wrapped ETH)
     - Address: ${weth.address}
     - Transaction: ${weth.deployTransaction.hash}

  2. UniswapV2Factory
     - Address: ${factory.address}
     - Transaction: ${factory.deployTransaction.hash}
     - Fee Recipient: ${wallet.address}

  3. UniswapV2Router02
     - Address: ${router.address}
     - Transaction: ${router.deployTransaction.hash}
     - Factory: ${factory.address}
     - WETH: ${weth.address}

============================================================
  DEPLOYMENT SUCCESSFUL
============================================================
`;
    
    fs.writeFileSync(
      path.join(__dirname, logFileName),
      logContent
    );
    
    console.log("\nUniswap V2 Deployment erfolgreich abgeschlossen!");
    console.log(`Deployment-Informationen wurden in direct-deployments.json gespeichert.`);
    console.log(`Ausführliches Deployment-Log wurde in ${logFileName} gespeichert.`);
    
  } catch (error) {
    console.error("Deployment fehlgeschlagen:", error.message);
    if (error.code) console.error("Fehlercode:", error.code);
    if (error.reason) console.error("Grund:", error.reason);
    
    // Versuche tiefere Fehlerdetails zu extrahieren
    if (error.error && error.error.message) {
      console.error("Fehlerdetails:", error.error.message);
    }
    
    // Stack Trace für tiefere Analyse
    console.error("\nStack Trace:");
    console.error(error.stack);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
