import { RawCoinInfo } from "./types";

export const REQUESTS_MAINNET: RawCoinInfo[] = [
  {
    "name": "Tether USD",
    "symbol": "USDT",
    "official_symbol": "USDT",
    "coingecko_id": "tether",
    "decimals": 8,
    "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg",
    "project_url": "",
    "token_type": {
      "type": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1::usdt::USDT",
      "account_address": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1",
      "module_name": "usdt",
      "struct_name": "USDT"
    }
  },
  {
    "name": "XBTC",
    "symbol": "XBTC",
    "official_symbol": "XBTC",
    "coingecko_id": "",
    "decimals": 8,
    "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
    "project_url": "https://github.com/OmniBTC/OmniBridge",
    "token_type": {
      "type": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1::xbtc::XBTC",
      "account_address": "0x6674cb08a6ef2a155b3c341a8697572898f0e4d1",
      "module_name": "xbtc",
      "struct_name": "XBTC"
    }
  },
  {
    "name": "Sui Coin",
    "symbol": "SUI",
    "official_symbol": "SUI",
    "coingecko_id": "Sui",
    "decimals": 9,
    "logo_url": "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/wallet/src/ui/assets/images/sui-icon.png",
    "project_url": "http://sui.io/",
    "token_type": {
      "type": "0x2::sui::SUI",
      "account_address": "0x2",
      "module_name": "sui",
      "struct_name": "SUI"
    }
  }
]

export const REQUESTS_TESTNET: RawCoinInfo[] = [
  {
    "name": "Tether USD",
    "symbol": "USDT",
    "official_symbol": "USDT",
    "coingecko_id": "tether",
    "decimals": 8,
    "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg",
    "project_url": "",
    "token_type": {
      "type": "0x985c26f5edba256380648d4ad84b202094a4ade3::usdt::USDT",
      "account_address": "0x985c26f5edba256380648d4ad84b202094a4ade3",
      "module_name": "usdt",
      "struct_name": "USDT"
    }
  },
  {
    "name": "XBTC",
    "symbol": "XBTC",
    "official_symbol": "XBTC",
    "coingecko_id": "",
    "decimals": 8,
    "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
    "project_url": "https://github.com/OmniBTC/OmniBridge",
    "token_type": {
      "type": "0x985c26f5edba256380648d4ad84b202094a4ade3::xbtc::XBTC",
      "account_address": "0x985c26f5edba256380648d4ad84b202094a4ade3",
      "module_name": "xbtc",
      "struct_name": "XBTC"
    }
  },
  {
    "name": "Sui Coin",
    "symbol": "SUI",
    "official_symbol": "SUI",
    "coingecko_id": "Sui",
    "decimals": 9,
    "logo_url": "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/wallet/src/ui/assets/images/sui-icon.png",
    "project_url": "http://sui.io/",
    "token_type": {
      "type": "0x2::sui::SUI",
      "account_address": "0x2",
      "module_name": "sui",
      "struct_name": "SUI"
    }
  },
  {
    "name": "BTC",
    "symbol": "BTC",
    "official_symbol": "BTC",
    "coingecko_id": "",
    "decimals": 8,
    "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
    "project_url": "https://github.com/OmniBTC/OmniBridge",
    "token_type": {
      "type": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1::btc::BTC",
      "account_address": "0xed67ff7ca06c2af6353fcecc69e312a0588dbab1",
      "module_name": "btc",
      "struct_name": "BTC"
    }
  }
]

export const REQUESTS_DEVNET: RawCoinInfo[] = [
  {
    "name": "Tether USD",
    "symbol": "USDT",
    "official_symbol": "USDT",
    "coingecko_id": "tether",
    "decimals": 8,
    "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/USDT.svg",
    "project_url": "",
    "token_type": {
      "type": "0x7263b90384c15e1bffe5757d9eaa0235264bd294::coins::USDT",
      "account_address": "0x7263b90384c15e1bffe5757d9eaa0235264bd294",
      "module_name": "coins",
      "struct_name": "USDT"
    }
  },
  {
    "name": "XBTC",
    "symbol": "XBTC",
    "official_symbol": "XBTC",
    "coingecko_id": "",
    "decimals": 8,
    "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
    "project_url": "https://github.com/OmniBTC/OmniBridge",
    "token_type": {
      "type": "0x7263b90384c15e1bffe5757d9eaa0235264bd294::coins::XBTC",
      "account_address": "0x7263b90384c15e1bffe5757d9eaa0235264bd294",
      "module_name": "coins",
      "struct_name": "XBTC"
    }
  },
  {
    "name": "Sui Coin",
    "symbol": "SUI",
    "official_symbol": "SUI",
    "coingecko_id": "Sui",
    "decimals": 9,
    "logo_url": "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/wallet/src/ui/assets/images/sui-icon.png",
    "project_url": "http://sui.io/",
    "token_type": {
      "type": "0x2::sui::SUI",
      "account_address": "0x2",
      "module_name": "sui",
      "struct_name": "SUI"
    }
  },
  {
    "name": "BTC",
    "symbol": "BTC",
    "official_symbol": "BTC",
    "coingecko_id": "",
    "decimals": 8,
    "logo_url": "https://coming-website.s3.us-east-2.amazonaws.com/icon_xbtc_30.png",
    "project_url": "https://github.com/OmniBTC/OmniBridge",
    "token_type": {
      "type": "0x7263b90384c15e1bffe5757d9eaa0235264bd294::coins::BTC",
      "account_address": "0x7263b90384c15e1bffe5757d9eaa0235264bd294",
      "module_name": "coins",
      "struct_name": "BTC"
    }
  },
  {
    "name": "Binance Coin",
    "symbol": "BNB",
    "official_symbol": "BNB",
    "coingecko_id": "binancecoin",
    "decimals": 8,
    "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/BNB.svg",
    "project_url": "",
    "token_type": {
      "type": "0x7263b90384c15e1bffe5757d9eaa0235264bd294::coins::BNB",
      "account_address": "0x7263b90384c15e1bffe5757d9eaa0235264bd294",
      "module_name": "coins",
      "struct_name": "BNB"
    }
  },
  {
    "name": "Ethereum",
    "symbol": "ETH",
    "official_symbol": "ETH",
    "coingecko_id": "eth",
    "decimals": 6,
    "logo_url": "https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/icons/WETH.svg",
    "project_url": "",
    "token_type": {
      "type": "0x7263b90384c15e1bffe5757d9eaa0235264bd294::coins::ETH",
      "account_address": "0x7263b90384c15e1bffe5757d9eaa0235264bd294",
      "module_name": "coins",
      "struct_name": "ETH"
    }
  },
]