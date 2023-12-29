import {Wallet, WalletStrategy} from "@injectivelabs/wallet-ts";
import {ErrorType, UnspecifiedErrorCode, WalletException, Web3Exception} from "@injectivelabs/exceptions";
import {
  CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  alchemyRpcEndpoint,
  alchemyWsRpcEndpoint,
} from "@/app/utils/constants";

export const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  ethereumOptions: {
    ethereumChainId: ETHEREUM_CHAIN_ID,
    wsRpcUrl: alchemyWsRpcEndpoint,
    rpcUrl: alchemyRpcEndpoint,
  },
});


export const connect = ({
                          wallet
                        }: {
  wallet: Wallet
  // onAccountChangeCallback?: (account: string) => void,
}) => {
  walletStrategy.setWallet(wallet)
}

export const getAddresses = async (): Promise<string[]> => {
  const addresses = await walletStrategy.getAddresses()

  if (addresses.length === 0) {
    throw new WalletException(
        new Error('There are no addresses linked in this wallet.'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError
        }
    )
  }

  if (!addresses.every((address) => !!address)) {
    throw new WalletException(
        new Error('There are no addresses linked in this wallet.'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError
        }
    )
  }


  return addresses
}

export const confirm = async (address: string) => {
  return await walletStrategy.confirm(address)
}
