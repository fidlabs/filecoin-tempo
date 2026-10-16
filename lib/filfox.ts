export type CreateAddressLinkOptions = {
  address: string;
  testnet?: boolean;
};

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
  return testnet ? "https://calibration.filfox.info" : "https://filfox.info";
}

export function createAddressLink(params: CreateAddressLinkParameters) {
  return createPrefix(params) + `/address/${params.address}`;
}

export function createTipsetLink(params: CreateTipsetLinkParameters): string {
  return createPrefix(params) + `/tipset/${params.tipset.toString()}`;
}

export function createTransactionLink(
  params: CreateTransactionLinkParameters
): string {
  return createPrefix(params) + `/message/${params.transactionHash}`;
}
