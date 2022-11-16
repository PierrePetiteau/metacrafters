// Import Solana web3 functinalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const fs = require("fs");

const transferSol = async (to) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const from = Keypair.generate();

  // Aidrop 2 SOL to Sender wallet
  console.log("Airdopping some SOL to Sender wallet!");
  const fromAirDropSignature = await connection.requestAirdrop(new PublicKey(from.publicKey), 2 * LAMPORTS_PER_SOL);

  // Latest blockhash (unique identifer of the block) of the cluster
  let latestBlockHash = await connection.getLatestBlockhash();

  // Confirm transaction using the last valid block height (refers to its time)
  // to check for transaction expiration
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: fromAirDropSignature,
  });

  console.log("Airdrop completed for the Sender account");

  // Get the sender balance
  const balance = await connection.getBalance(from.publicKey);

  // Send money from "from" wallet and into "to" wallet
  var transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: balance / 2,
    })
  );

  // Sign transaction
  var signature = await sendAndConfirmTransaction(connection, transaction, [from]);
  console.log("Signature is ", signature);
};

const extractKeyPairFromJsonFile = (path) => {
  if (!path) {
    console.log("---------", "No path detected");
    return null;
  }

  console.log("---------", "Extracting secretKey from", path);

  const data = JSON.parse(fs.readFileSync(path));
  const secretKey = Uint8Array.from(data);
  const keyPair = Keypair.fromSecretKey(secretKey);

  return keyPair;
};

const handleTransfer = async () => {
  const path = process.argv[2];
  const to = extractKeyPairFromJsonFile(path);

  if (!to) {
    console.log("---------", "Cannot proceed to transfer");
  }

  console.log("---------", "Will proceed to transfer");
  transferSol(to);
};

handleTransfer();
