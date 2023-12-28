import { defineStore } from "pinia";
import {
  connect,
  getAddresses
} from "@/app/services/wallet";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import {Wallet} from "@injectivelabs/wallet-ts";
import {BusEvents, GrantDirection, WalletConnectStatus} from "~/types";
import {isTrustWalletInstalled} from "~/app/services/trust-wallet";
import {isMetamaskInstalled} from "~/app/services/metamask";


type WalletStoreState = {
  wallet: Wallet

  address: string
  addresses: string[]
  injectiveAddress: string
  defaultSubaccountId: string
  addressConfirmation: string

  trustWalletInstalled: boolean
  metamaskInstalled: boolean

  walletConnectStatus: WalletConnectStatus

  authZ: {
    address: string
    direction: GrantDirection
    injectiveAddress: string
    defaultSubaccountId: string
  }
}

const initialStateFactory = (): WalletStoreState => ({
  address: '',
  addresses: [],
  injectiveAddress: '',
  defaultSubaccountId: '',
  addressConfirmation: '',
  wallet: Wallet.Metamask,
  metamaskInstalled: false,
  trustWalletInstalled: false,
  walletConnectStatus: WalletConnectStatus.idle,

  authZ: {
    address: '',
    direction: GrantDirection.Grantee,
    injectiveAddress: '',
    defaultSubaccountId: ''
  }
})

export const useWalletStore = defineStore("wallet", {
  state: (): WalletStoreState => initialStateFactory(),

  getters:{
    isUserWalletConnected: (state) => {
      const addressConnectedAndConfirmed =
          !!state.address && !!state.addressConfirmation
      const hasAddresses = state.addresses.length > 0

      return (
          hasAddresses && addressConnectedAndConfirmed && !!state.injectiveAddress
      )
    },
  },

  actions: {
    async init() {
      const walletStore = useWalletStore()

      if (!walletStore.wallet) {
        return
      }
      await connect({ wallet: walletStore.wallet })
    },

    async connectWallet(wallet : Wallet) {
      const walletStore = useWalletStore()

      walletStore.$patch({
        wallet,
        walletConnectStatus: WalletConnectStatus.connecting
      })

      await connect({ wallet })
    },

    async connectMetamask() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Metamask)

      const addresses = await getAddresses()
      const [address] = addresses
      const addressConfirmation = await confirm(address)
      const injectiveAddress = getInjectiveAddress(address)

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation,
        defaultSubaccountId: getDefaultSubaccountId(injectiveAddress)
      })

      await walletStore.onConnect()
    },

    async isMetamaskInstalled() {
      const walletStore = useWalletStore()

      walletStore.$patch({
        metamaskInstalled: await isMetamaskInstalled()
      })
    },


    async onConnect() {
      // const accountStore = useAccountStore()
      const walletStore = useWalletStore()
      // const authZStore = useAuthZStore()
      // const exchangeStore = useExchangeStore()

      useEventBus(BusEvents.WalletConnected).emit()

      // await accountStore.fetchAccountPortfolio()
      // await exchangeStore.initFeeDiscounts()
      // await authZStore.fetchGrants()

      // amplitudeWalletTracker.submitWalletConnectedTrackEvent({
      //   wallet: walletStore.wallet,
      //   address: walletStore.injectiveAddress,
      //   tierLevel: exchangeStore.feeDiscountAccountInfo?.tierLevel || 0
      // })

      walletStore.$patch({
        walletConnectStatus: WalletConnectStatus.connected
      })
    },


    async isTrustWalletInstalled() {
      const walletStore = useWalletStore()

      walletStore.$patch({
        trustWalletInstalled: await isTrustWalletInstalled()
      })
    },

  },
});
