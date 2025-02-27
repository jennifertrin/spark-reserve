import { IssuerWallet } from "@buildonspark/issuer-sdk";
import { Network } from "@buildonspark/spark-sdk/utils";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '../../');
const envPath = join(rootDir, '.env');

console.log("Looking for .env at:", envPath);
dotenv.config({ path: envPath });

console.log("Environment loaded, GOVT_MNEMONIC exists:", !!process.env.GOVT_MNEMONIC);

const SparkTokenConfig = {
    tokenName: "US Gov Stablecoin BTC",
    tokenTicker: "USBBTC",
    decimals: 6,
    feeRate: 2,
    isFreezeable: false,
};

// Remove these lines from the global scope - they need to be inside a function
// const { tokenName, tokenTicker, decimals, isFreezeable } = SparkTokenConfig;
// const maxSupply = 1000000000;
// await wallet.announceTokenL1(tokenName, tokenTicker, decimals, maxSupply, isFreezeable);

const wrappedBitcoinBanks = [
    {
        name: "Internet Computer Federal Reserve Bank",
        ticker: "ckBTC",
        issuer: "DFINITY Foundation",
        reserveRatio: "33%",
        website: "https://internetcomputer.org/docs/defi/chain-key-tokens/ckbtc/overview"
    },
    {
        name: "Wrapped Bitcoin Federal Reserve Bank",
        ticker: "WBTC",
        issuer: "BitGo",
        reserveRatio: "33%",
        website: "https://wbtc.network"
    },
    {
        name: "Spark Federal Reserve Bank",
        ticker: "USBTC",
        issuer: "Spark",
        reserveRatio: "34%",
        website: "https://www.spark.info"
    },
];

async function checkBitcoinBalance() {
    try {
        const address = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
        const response = await fetch(`https://blockchain.info/balance?active=${address}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data[address]) {
            const balanceInSatoshis = data[address].final_balance;
            const balanceInBTC = balanceInSatoshis / 100000000;

            return {
                address,
                balanceInSatoshis,
                balanceInBTC,
                success: true
            };
        } else {
            throw new Error('Address not found in response');
        }
    } catch (error) {
        console.error('Error fetching Bitcoin balance:', error);
        return {
            address,
            success: false,
            error: error.message
        };
    }
}

async function mintUSBTC(wallet, totalBalanceInSatoshis) {
    try {
        // Calculate 34% of the total balance for USBTC
        const usbtcRatio = 0.34;
        const usbtcAmountInSatoshis = Math.floor(totalBalanceInSatoshis * usbtcRatio);
        const usbtcAmountInBTC = usbtcAmountInSatoshis / 100000000;

        console.log(`Minting ${usbtcAmountInBTC} BTC equivalent of USBTC (34% of total balance)`);

        // Convert to the token's decimal precision (6 decimals as per config)
        // and convert to BigInt as required by the mintTokens function
        const tokenAmount = BigInt(Math.floor(usbtcAmountInBTC * Math.pow(10, SparkTokenConfig.decimals)));

        // Mint the USBTC tokens using the correct mintTokens function
        const mintTxId = await wallet.mintTokens(tokenAmount);

        console.log("USBTC minting successful!");
        console.log("Spark Transaction ID:", mintTxId);
        console.log("Amount minted:", usbtcAmountInBTC, "BTC equivalent");

        return {
            mintTxId,
            amountInBTC: usbtcAmountInBTC,
            amountInTokenUnits: tokenAmount.toString()
        };
    } catch (error) {
        console.error("Error minting USBTC:", error.message);
        throw error;
    }
}

async function announceMintToken() {
    try {
        const wallet = new IssuerWallet(Network.REGTEST);

        if (!process.env.GOVT_MNEMONIC) {
            throw new Error("Missing GOVT_MNEMONIC environment variable");
        }

        const mnemonicPhrase = await wallet.initWallet(process.env.GOVT_MNEMONIC);
        console.log("Wallet initialized successfully");

        const l1Address = wallet.getL1FundingAddress();
        console.log("L1 Address:", l1Address);

        // // Get deposit address for Bitcoin
        // const depositAddress = await wallet.getDepositAddress();
        // console.log("Deposit Address:", depositAddress);

        // Check Bitcoin balance
        const balanceResult = await checkBitcoinBalance();
        if (!balanceResult.success) {
            throw new Error(`Failed to check balance: ${balanceResult.error}`);
        }

        console.log("Current Bitcoin balance:", balanceResult.balanceInBTC, "BTC");

        // Extract properties from SparkTokenConfig
        const { tokenName, tokenTicker, decimals, isFreezeable } = SparkTokenConfig;
        // Define maxSupply
        const maxSupply = 1000000000;

        console.log("Announcing token with configuration:", SparkTokenConfig);
        // const txId = await wallet.announceTokenL1(tokenName, tokenTicker, decimals, maxSupply, isFreezeable);

        console.log("Token announcement successful!");
        // console.log("Transaction ID:", txId);
        console.log("Token Ticker:", SparkTokenConfig.tokenTicker);

        // Mint 34% of the balance as USBTC
        if (balanceResult.balanceInSatoshis > 0) {
            const mintResult = await mintUSBTC(wallet, balanceResult.balanceInSatoshis);
            console.log("USBTC minting details:", mintResult);
            return mintResult;
        } else {
            console.log("No balance available for minting USBTC");
        }
    } catch (error) {
        console.error("Error in token process:", error.message);
        throw error;
    }
}

announceMintToken()
    .then(mintResult => {
        console.log("Process completed with result:", mintResult);
    })
    .catch(error => {
        console.error("Process failed:", error);
        process.exit(1);
    });