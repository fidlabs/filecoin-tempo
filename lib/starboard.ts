type CreatePrefixParameters = {
  testnet?: boolean;
};

export type CreateAddressLinkParameters = CreatePrefixParameters & {
  address: string;
};

export type CreateTipsetLinkParameters = CreatePrefixParameters & {
  tipset: bigint | number;
};

export type CreateTransactionLinkParameters = CreatePrefixParameters & {
  transactionHash: string;
};

function createPrefix({ testnet = false }: CreatePrefixParameters): string {
  return (
    (testnet
      ? "https://fvm.starboard.ventures/calibration"
      : "https://fvm.starboard.ventures") + "/explorer"
  );
}

export function createAddressLink(params: CreateAddressLinkParameters) {
  return createPrefix(params) + `/address/${params.address}`;
}

export function createTipsetLink(params: CreateTipsetLinkParameters): string {
  return createPrefix(params) + `/block/${params.tipset.toString()}`;
}

export function createTransactionLink(
  params: CreateTransactionLinkParameters
): string {
  return createPrefix(params) + `/tx/${params.transactionHash}`;
}
