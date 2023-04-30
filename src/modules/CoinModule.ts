import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';

export interface CoinInfo {
    id: string,
    balance: bigint,
    coinSymbol: string,
}

export interface CoinObjects {
    balance: bigint,
    objects: CoinInfo[]
}

export type CreateAdminMintPayloadParams = {
    coinTypeArg: string;
    coinCapLock: string,
    walletAddress: string,
    amount: number,
    gasBudget?: number,
}

export class CoinModule implements IModule {
    protected _sdk: SDK;

    get sdk() {
        return this._sdk;
    }

    constructor(sdk: SDK) {
        this._sdk = sdk;
    }

    async getCoinBalance(address: string, coinTypeArg: string) {
        const suiBalance = await this._sdk.jsonRpcProvider.getBalance({ owner: address, coinType: coinTypeArg });
        return suiBalance;
    }

    async getNFTs(address: string, coinTypeArg: string) {

        const nfts = await this._sdk.jsonRpcProvider.getOwnedObjects(
            {
                owner: address,
                options: {
                    showContent: true,
                    showType: true,
                },
                filter: {
                    StructType: coinTypeArg
                }
            })

        console.log('coins length:', nfts.data.length);

        return nfts;
    }
}
