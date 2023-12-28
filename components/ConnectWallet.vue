<script setup>
import { useWalletStore } from "~~/store/wallet";
import {useModalStore} from "~/store/modal";
import {BusEvents, Modal, WalletConnectStatus, WalletModalType} from "~/types";
import {Status, StatusType} from "@injectivelabs/utils";

const modalStore = useModalStore()
const walletStore = useWalletStore();

const status = reactive(new Status(StatusType.Loading))
const walletModalType = ref(WalletModalType.All)

const isModalOpen = computed(
    () => modalStore.modals[Modal.Connect]
)

const isLoading = computed(
    () => walletStore.walletConnectStatus === WalletConnectStatus.connecting
)

const injAddressShort = computed(
  () =>
    `${walletStore.injectiveAddress.slice(
      0,
      6
    )}...${walletStore.injectiveAddress.slice(-3)}`
);

function handleClick() {

  // walletStore.connectWallet().catch(alert);
  modalStore.openModal(Modal.Connect)
}

function onCloseModal() {
  modalStore.closeModal(Modal.Connect)
}

onMounted(() => {
  useEventBus(BusEvents.ShowLedgerConnect).on(connectLedger)

  Promise.all([
    walletStore.isMetamaskInstalled(),
    walletStore.isTrustWalletInstalled()
  ]).finally(() => status.setIdle())
})

function connectLedger() {
  walletModalType.value = WalletModalType.Ledger

  modalStore.openModal(Modal.Connect)
}

</script>

<template>
  <LayoutWalletDetails v-if="walletStore.isUserWalletConnected" />
  <Button
    @click="handleClick"
    class="bg-blue-500 text-blue-900 font-semibold whitespace-nowrap"
  >
    Connect Wallet
  </Button>

  <AppModal
      :is-open="isModalOpen"
      :is-loading="isLoading"
      :ignore="['.v-popper__popper']"
      is-md
      @modal:closed="onCloseModal"
  >
    <template #title>
      <h3>
        Connect To Wallet
      </h3>
    </template>

    <ul
        class="divide-y divide-gray-800 border-gray-700 rounded-lg max-h-[65vh]"
    >
      <LayoutWalletConnectWalletMetamask/>
    </ul>
  </AppModal>
</template>
