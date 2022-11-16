// Import Solana web3 functinalities
const { Connection, PublicKey, clusterApiUrl, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");

const DEFAULT_AIRDROP_AMOUNT = 2;

// Create a new keypair
const newPair = new Keypair();

// Exact the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key of the generated keypair", publicKey);

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
  try {
    // Connect to the Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    // console.log("Connection object is:", connection);

    // Make a wallet (keypair) from privateKey and get its balance
    const myWallet = await Keypair.fromSecretKey(privateKey);
    const walletBalance = await connection.getBalance(new PublicKey(newPair.publicKey));
    console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
  } catch (err) {
    console.log(err);
  }
};

const airDropSol = async (airdropAmount) => {
  try {
    // Connect to the Devnet and make a wallet from privateKey
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const myWallet = await Keypair.fromSecretKey(privateKey);

    // Request airdrop of 2 SOL to the wallet
    console.log("Airdropping some SOL to my wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(myWallet.publicKey),
      airdropAmount * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirDropSignature);
  } catch (err) {
    console.log(err);
  }
};

const extractAirdropAmountFromParams = () => {
  const amount = parseInt(process.argv[2]);
  if (amount === undefined || amount === null) {
    console.log("---------", "No amount from params");
    return DEFAULT_AIRDROP_AMOUNT;
  }
  if (isNaN(amount)) {
    console.log("---------", "Invalid parameter detected for airdrop amount");
    return DEFAULT_AIRDROP_AMOUNT;
  }
  return amount;
};

// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
  const airdropAmount = extractAirdropAmountFromParams();
  console.log("---------", airdropAmount, "SOL will be requested for the airdrop");

  await getWalletBalance();
  await airDropSol(airdropAmount);
  await getWalletBalance();
};

mainFunction();
