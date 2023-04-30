import { readConfig } from './readConfig';
import { Command } from 'commander';
import { addHexPrefix } from '../utils/hex';
import { SUI_COIN_TYPE } from '../constants'

export const walletCmd = async (program: Command) => {

    const wallet = async () => {

        const { suiAmmSdk, rawSigner } = readConfig(program);
        const address = addHexPrefix(await rawSigner.getAddress())
        console.log(`address: ${address}`);

        const suiBalance = await suiAmmSdk.Coin.getCoinBalance(address,SUI_COIN_TYPE);
        console.log(`address: ${address} sui balance: ${  suiBalance }`);
        
    };
    program.command('moveflow:wallet')
        .description('print wallet ')
        .action(wallet)
}