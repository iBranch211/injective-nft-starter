<script setup lang="ts">

import {WalletConnectStatus} from "~/types";
import {Admin_Address} from "~/app/utils/constants";


const router = useRouter()
const walletStore = useWalletStore()
const page = ref(1)
const limit = ref(10)
const totalCount = ref(45)

const holdDatas = [
  {
    address: "inj1wu3em28sedzdggqwrl72ll2nmemx2wzxzgvruw",
    tokenIds: [5, 7, 9],
    purchasedAt: "2023 Dec 11"
  },
]

function onLimitChange(value: number) {
  limit.value = Number(value)
}

function onPageChange(value: number) {
  page.value = Number(value)
}

watch(
    () => walletStore.walletConnectStatus,
    (newWalletConnectStatus) => {
      if (!(newWalletConnectStatus === WalletConnectStatus.connected && walletStore.injectiveAddress === Admin_Address)) {
        router.push("/")
      }
    }
)


</script>

<template>
  <Container class="place-items-center flex-1 flex flex-row items-baseline w-full mt-16 divide-x font-semibold">
    <div class="w-1/3 flex flex-col pr-12">
      <div class="text-3xl capitalize font-bold mb-6">admin setting</div>

      <div class="flex flex-col gap-5 bg-gray-800 rounded-3xl px-4 py-6 pt-10  font-mono">
        <div class="flex flex-col">
          <label class="block">
            <span class="block text-base font-medium capitalize mb-3">
              round
            </span>
            <input type="number" name="round"
                   class="mt-1 px-3 py-3 bg-gray-900 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                   placeholder="0"/>
          </label>
        </div>
        <div class="flex flex-col">
          <label class="block">
            <span class="block text-base font-medium capitalize mb-3">
              supply
            </span>
            <input type="number" name="round"
                   class="mt-1 px-3 py-3 bg-gray-900 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                   placeholder="0"/>
          </label>
        </div>
        <div class="flex flex-col">
          <label class="block">
            <span class="block text-base font-medium capitalize mb-3">
              token URI
            </span>
            <input type="text" name="round"
                   class="mt-1  px-3 py-3 bg-gray-900 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                   placeholder="https://ipfs.com"/>
          </label>
        </div>
        <Button
            class="capitalize bg-blue-500 text-blue-900 whitespace-nowrap mx-20 text-xl mt-2 tracking-widest"
        >
          start
        </Button>
      </div>
    </div>

    <div class="w-2/3 flex flex-col pl-12">
      <div class="text-3xl capitalize font-bold mb-2">holders</div>

      <table class="table-auto font-mono">
        <thead>
        <tr>
          <th class="text-xs text-left p-4 whitespace-nowrap">No</th>
          <th class="text-xs text-left p-4 whitespace-nowrap">Address</th>
          <th class="text-xs text-left p-4 whitespace-nowrap">Token IDs</th>
          <th class="text-xs text-left p-4 whitespace-nowrap">Balance</th>
          <th class="text-xs text-left p-4 whitespace-nowrap">Purchased At</th>
        </tr>
        </thead>
        <tbody v-if="totalCount>0" class="divide-y divide-gray-800">
        <tr v-for="n in 10">
          <td class="p-4 whitespace-nowrap">{{ n }}</td>
          <td class="p-4 whitespace-nowrap">inj1wu3em28sedzdggqwrl72ll2nmemx2wzxzgvruw</td>
          <td class="p-4 whitespace-nowrap">5,7,9</td>
          <td class="p-4 whitespace-nowrap">3</td>
          <td class="p-4 whitespace-nowrap">2023 Dec 11</td>
        </tr>
        </tbody>
      </table>


      <div v-if="totalCount<=0" class="w-full my-10 justify-center text-xl items-center flex gap-5  font-mono">
        <img class="h-10 w-10" src="/assets/img/drafts.svg" alt="drafts">
        <p>No Data</p>
      </div>


      <div v-if="totalCount>0" class="flex mt-5  font-mono">
        <Pagination
            v-bind="{
            page,
            limit,
            totalCount
          }"
            @update:limit="onLimitChange"
            @update:page="onPageChange"
        />

        <Button
            class="capitalize bg-blue-500 text-blue-900 whitespace-nowrap mx-20 text-base mt-2 tracking-widest"
        >
          export CSV
        </Button>
      </div>

    </div>
  </Container>
</template>
