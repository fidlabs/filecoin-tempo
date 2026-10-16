"use client";

import { ExplorerActionsMenu } from "@/components/explorer-actions-menu";
import { FilecoinPayRailButtonLink } from "@/components/filecoin-pay-rail-button-link";
import { TokenValue } from "@/components/token-value";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuarterContext } from "@/hooks/use-quarter-context";
import { createAppColumnHelper, useAppTable } from "@/lib/app-table";
import { fetchPaymentsList, Payment } from "@/lib/fpv-indexer";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import { shortenAddress } from "@/lib/utils";
import { OnChangeFn, PaginationState } from "@tanstack/react-table";
import {
  BanknoteArrowDownIcon,
  RefreshCcwIcon,
  ServerCrashIcon,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, type ReactNode } from "react";

type PaginationHandler = OnChangeFn<PaginationState>;

export type PaymentsTableProps = {
  serviceOrchestrator: string;
};

const usePayments = createFetcherHook(
  fetchPaymentsList,
  QueryKeys.FPV_INDEXER_PAYMENTS
);

const pageQueryParam = "plp";
const limitQueryParam = "pll";

const pricingFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const columnHelper = createAppColumnHelper<Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor("filecoinPayContract", {
    id: "FP Contract",
    header: "Filecoin Pay contract",
    cell({ getValue }) {
      const address = getValue();

      return (
        <div className="flex items-center gap-x-1">
          <span className="font-mono">{shortenAddress(address)}</span>
          <ExplorerActionsMenu variant="address" input={address} />
        </div>
      );
    },
  }),
  columnHelper.accessor("epoch", {
    header: "Epoch",
    cell({ getValue }) {
      const epoch = getValue();

      return (
        <div className="flex items-center gap-x-1">
          <span className="tabular-nums">{epoch}</span>
          <ExplorerActionsMenu variant="tipset" input={epoch} />
        </div>
      );
    },
  }),
  columnHelper.accessor("logIndex", {
    id: "Log Index",
    header: "Log Index",
    cell({ getValue }) {
      return <span className="tabular-nums">{getValue()}</span>;
    },
  }),
  columnHelper.accessor("transactionHash", {
    id: "transaction",
    header: "Transaction",
    cell({ getValue }) {
      const hash = getValue();

      return (
        <div className="flex items-center gap-x-1">
          <span className="font-mono">{shortenAddress(hash)}</span>
          <ExplorerActionsMenu variant="transaction" input={hash} />
        </div>
      );
    },
  }),
  columnHelper.accessor("railId", {
    header: "Rail",
    cell({ getValue }) {
      return <FilecoinPayRailButtonLink railId={getValue()} />;
    },
  }),
  columnHelper.accessor("payer", {
    header: "Payer",
    cell({ getValue }) {
      const address = getValue();

      return (
        <div className="flex items-center gap-x-1">
          <span className="font-mono">{shortenAddress(address)}</span>
          <ExplorerActionsMenu variant="address" input={address} />
        </div>
      );
    },
  }),
  columnHelper.accessor("payee", {
    header: "Payee",
    cell({ getValue }) {
      const address = getValue();

      return (
        <div className="flex items-center gap-x-1">
          <span className="font-mono">{shortenAddress(address)}</span>
          <ExplorerActionsMenu variant="address" input={address} />
        </div>
      );
    },
  }),
  columnHelper.accessor("operator", {
    header: "Operator",
    cell({ getValue }) {
      const address = getValue();

      return (
        <div className="flex items-center gap-x-1">
          <span className="font-mono">{shortenAddress(address)}</span>
          <ExplorerActionsMenu variant="address" input={address} />
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "token",
    header: "Token",
    cell({ row }) {
      return (
        <div className="flex items-center gap-x-1">
          <span className="font-mono">
            {row.original.tokenSymbol} ({row.original.tokenDecimals})
          </span>
          <ExplorerActionsMenu
            variant="address"
            input={row.original.tokenAddress}
          />
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "amount",
    header: "Amount",
    cell({ row }) {
      return (
        <TokenValue
          decimals={row.original.tokenDecimals}
          symbol={row.original.tokenSymbol}
          value={row.original.totalAmountBaseUnits}
        />
      );
    },
  }),
  columnHelper.display({
    id: "Net Amount",
    header: "Net Amount",
    cell({ row }) {
      return (
        <TokenValue
          decimals={row.original.tokenDecimals}
          symbol={row.original.tokenSymbol}
          value={row.original.netPayeeAmountBaseUnits}
        />
      );
    },
  }),
  columnHelper.display({
    id: "fee",
    header: "Fee",
    cell({ row }) {
      return (
        <TokenValue
          decimals={row.original.tokenDecimals}
          symbol={row.original.tokenSymbol}
          value={row.original.networkFeeBaseUnits}
        />
      );
    },
  }),
  columnHelper.display({
    id: "comission",
    header: "Comission",
    cell({ row }) {
      return (
        <TokenValue
          decimals={row.original.tokenDecimals}
          symbol={row.original.tokenSymbol}
          value={row.original.operatorComissionBaseUnits}
        />
      );
    },
  }),
  columnHelper.display({
    id: "price",
    header: "Price",
    cell({ row }) {
      const { pricingPeriod, tokenAddress } = row.original;

      if (!isFilToken(tokenAddress)) {
        return `1 USD`;
      }

      return pricingPeriod ? (
        <PricingPopover pricingPeriod={pricingPeriod} />
      ) : (
        "-"
      );
    },
  }),
  columnHelper.display({
    id: "Amount USD",
    header: "Amount USD",
    cell({ row }) {
      const { pricingPeriod, tokenAddress, totalAmount } = row.original;

      if (!isFilToken(tokenAddress)) {
        return usdFormatter.format(totalAmount);
      }

      return pricingPeriod
        ? "~" + usdFormatter.format(totalAmount * pricingPeriod.impliedRate)
        : "-";
    },
  }),
]);

function isFilToken(tokenAddress: string): boolean {
  try {
    return BigInt(tokenAddress) === 0n;
  } catch {
    return false;
  }
}

function EmptyState() {
  return (
    <Empty className="h-[350px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BanknoteArrowDownIcon />
        </EmptyMedia>
        <EmptyTitle>No payments found</EmptyTitle>
        <EmptyDescription>
          No Filecoin Pay payments attributed to this Service Orchestrator were
          made in this quarter.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ErrorState({ refresh }: { refresh: () => void }) {
  return (
    <Empty className="h-[350px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ServerCrashIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Error</EmptyTitle>
        <EmptyDescription>
          An error has occured when fetching payments. Please try again later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={refresh}>
          <RefreshCcwIcon />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function PricingPopover({
  pricingPeriod,
}: {
  pricingPeriod: NonNullable<Payment["pricingPeriod"]>;
}) {
  const parts = [
    [
      "Lot",
      <TokenValue
        key="lot"
        value={pricingPeriod.lotAttoUsd}
        decimals={18}
        symbol="USD"
        baseUnitName="attoUSD"
      />,
    ],
    [
      "Claim",
      <TokenValue
        key="claim"
        value={pricingPeriod.claimAttoFil}
        decimals={18}
        symbol="FIL"
        baseUnitName="attoFIL"
      />,
    ],
    [
      "Implied Rate",
      <span key="implied-rate" className="tabular-nums">
        {pricingPeriod.impliedRate}
      </span>,
    ],
    [
      "Range",
      <span key="range" className="tabular-nums">
        {pricingPeriod.startEpoch} ({pricingPeriod.startLogIndex}) -{" "}
        {pricingPeriod.endEpoch} ({pricingPeriod.endLogIndex})
      </span>,
    ],
    [
      "Auction Tx",
      <div key="auction-tx" className="inline-flex items-center">
        <span>{shortenAddress(pricingPeriod.auctionTransactionHash)}</span>
        <ExplorerActionsMenu
          variant="transaction"
          input={pricingPeriod.auctionTransactionHash}
        />
      </div>,
    ],
  ] satisfies [string, ReactNode][];

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" className="tabular-nums" />}
      >
        ~{pricingFormatter.format(pricingPeriod.impliedRate)} USD
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle>Price Breakdown</PopoverTitle>
          <PopoverDescription>
            Details on auction that priced this payment.
          </PopoverDescription>
        </PopoverHeader>

        {parts.map(([label, content]) => {
          return (
            <div key={label} className="grid grid-cols-3 items-center gap-2">
              <strong>{label}</strong>

              <div className="col-span-2">{content}</div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export function PaymentsTable({ serviceOrchestrator }: PaymentsTableProps) {
  const { quarter } = useQuarterContext();
  const [page, setPage] = useQueryState(
    pageQueryParam,
    parseAsInteger.withDefault(1)
  );
  const [limit, setLimit] = useQueryState(
    limitQueryParam,
    parseAsInteger.withDefault(10)
  );

  const {
    data,
    error,
    isLoading,
    mutate: refresh,
  } = usePayments(
    {
      fromEpoch: quarter.startEpoch,
      toEpoch: quarter.endEpoch,
      page,
      limit,
      serviceOrchestrator,
    },
    { keepPreviousData: true, errorRetryCount: 1 }
  );

  const onPaginationChange = useCallback<PaginationHandler>(
    (updaterOrValue) => {
      const { pageIndex, pageSize } =
        typeof updaterOrValue === "function"
          ? updaterOrValue({ pageIndex: page - 1, pageSize: limit })
          : updaterOrValue;

      setPage(pageIndex + 1);
      setLimit(pageSize);
    },
    [limit, page, setLimit, setPage]
  );

  const table = useAppTable({
    columns,
    data: data?.data ?? [],
    initialState: {
      columnVisibility: {
        "FP Contract": false,
        "Log Index": false,
        transaction: false,
        payee: false,
        token: false,
        "Net Amount": false,
        fee: false,
        comission: false,
      },
    },
    rowCount: data ? Number(data.pagination?.totalCount) : undefined,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onPaginationChange,
  });

  return (
    <table.AppTable>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            Q{quarter.q} Orchestrator&apos;s Payments List
          </h3>
        </div>
        <table.ColumnSelect />
      </div>
      <table.Content
        emptyState={EmptyState}
        error={error}
        errorState={() => <ErrorState refresh={refresh} />}
        loading={isLoading}
        loadingRowHeight={35}
      />
      <div className="mt-2 flex items-center justify-end gap-4">
        <table.RowCount />
        <table.PageSizeSelect options={[10, 25, 50, 100]} />
        <table.SimplePagination />
      </div>
    </table.AppTable>
  );
}
