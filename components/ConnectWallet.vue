<script setup>
import { useWalletStore } from "~~/store/wallet";
import {useModalStore} from "~/store/modal";
import {Modal, WalletConnectStatus, WalletModalType} from "~/types";
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

</script>

<template>
  <Button v-if="walletStore.injectiveAddress">{{ injAddressShort }}</Button>
  <Button
    v-else
    @click="handleClick"
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
    </ul>
  </AppModal>
</template>
