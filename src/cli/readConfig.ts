import { Ed25519Keypair, RawSigner } from '@mysten/sui.js';
import { Command } from 'commander';
import * as fs from 'fs';
import { SDK } from '../sdk';
import { CONFIGS } from '../config';

export const readConfig = (program: Command) => {

    const mnemonics = "future please eager illness dog pitch horror quit use access mom endless";
    const keypair = Ed25519Keypair.deriveKeypair(mnemonics);
    
    const suiAmmSdk = new SDK(CONFIGS.testnet);
    const rawSigner = new RawSigner(keypair, suiAmmSdk.jsonRpcProvider);
    
    return { suiAmmSdk, rawSigner };
}