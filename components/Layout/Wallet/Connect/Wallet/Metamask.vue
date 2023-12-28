<script lang="ts" setup>
import { WalletConnectStatus } from '~/types'

const walletStore = useWalletStore()
const { success } = useNotifications()
const { $onError } = useNuxtApp()

const downloadMetamaskLink = ref<any>(null)

function connect() {
  if (walletStore.metamaskInstalled) {
    walletStore
      .connectMetamask()
      .then(() => {
        success({ title: 'Successfully connected' })
      })
      .catch((e) => {
        walletStore.setWalletConnectStatus(WalletConnectStatus.disconnected)
        $onError(e)
      })
  } else if (downloadMetamaskLink.value && downloadMetamaskLink.value.$el) {
    downloadMetamaskLink.value.$el.click()
  }
}
</script>

<template>
  <LayoutWalletConnectWrapper @click="connect">
    <template #logo>
      <BaseIcon name="wallet/metamask" class="w-8 h-8" />
    </template>

    <template #title>
      Metamask
    </template>

    <template #description>
      <span data-cy="connect-wallet-popup-metamask-button">
        Connect Using Browser
      </span>
    </template>

    <template v-if="!walletStore.metamaskInstalled" #icon>
      <NuxtLink
        ref="downloadMetamaskLink"
        to="https://metamask.io/download"
        target="_blank"
        rel="noreferrer"
      >
        <BaseIcon name="download" class="h-5 w-5 hover:text-blue-500" />
      </NuxtLink>
    </template>
  </LayoutWalletConnectWrapper>
</template>
