import {getWalletItems, printBalances, untilPositiveBalance} from "./utils/cosmos-common.js"
import {sendConsolidatedTransactions} from "./utils/cosmos-tx.js"
import {readFile, sleep, until5SecLeft} from "./utils/other.js"

import {WalletItem} from "./datatypes/cosmos.js"
import {GENESIS_TIMESTAMP, RPC_ENDPOINT, COUNT_MINT, MINT_MS} from "./config.js"


async function main() {
    let fileStrings: string[] = readFile("../.././data/mnemonic.txt")
    // await sleep(2000)

    let walletItems: WalletItem[] = await getWalletItems(fileStrings, RPC_ENDPOINT)

    await untilPositiveBalance(walletItems)

    console.log('\n/////// TRANSFER ///////\n')
    for (let c = 0; c < COUNT_MINT; c++) {
        try {
            await sendConsolidatedTransactions(walletItems)
        } catch (e) {
            console.error("Error rpc");
        }

        console.log()
        await sleep(MINT_MS)
    }
        
    await printBalances(walletItems, true, true)
    await sleep(1_000, false)
}

await main()