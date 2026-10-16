"use client";

import { useFpvIndexerStatus } from "@/hooks/use-fpv-indexer-status";
import * as beryx from "@/lib/beryx";
import * as blockscout from "@/lib/blockscout";
import { filecoinCalibrationChainId } from "@/lib/constants";
import * as filfox from "@/lib/filfox";
import * as filscan from "@/lib/filscan";
import * as starboard from "@/lib/starboard";
import { cn } from "@/lib/utils";
import { CopyIcon, EllipsisVerticalIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { type ComponentProps, useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Spinner } from "./ui/spinner";
import { toast } from "./ui/toast";
import { capitalize } from "es-toolkit";

type Variant = "address" | "tipset" | "transaction";

export type ExplorerActionsMenuProps<V extends Variant = Variant> = {
  input: V extends "tipset" ? bigint | number : string;
  variant: "address" | "tipset" | "transaction";
  triggerButtonSize?: ComponentProps<typeof Button>["size"];
};

function variantObjectName(variant: Variant): string {
  switch (variant) {
    case "address":
      return "address";
    case "tipset":
      return "tipset number";
    case "transaction":
      return "transaction hash";
  }
}

export function ExplorerActionsMenu<V extends Variant>({
  input,
  variant,
  triggerButtonSize,
}: ExplorerActionsMenuProps<V>) {
  const { data: status, error, isLoading } = useFpvIndexerStatus();
  const linkIcon = isLoading ? <Spinner /> : <ExternalLinkIcon />;

  const explorersLinks = useMemo<[string, string][]>(() => {
    if (error) {
      return [];
    }

    const testnet = status?.chainId === filecoinCalibrationChainId;

    switch (variant) {
      case "address":
        const address = input as string;

        return [
          ["Beryx", beryx.createAddressLink({ address, testnet })],
          ["Filfox", filfox.createAddressLink({ address, testnet })],
          ["Filscan", filscan.createAddressLink({ address, testnet })],
          ["Starboard", starboard.createAddressLink({ address, testnet })],
          ["Blockscout", blockscout.createAddressLink({ address, testnet })],
        ];
      case "tipset":
        const tipset = input as bigint | number;

        return [
          ["Beryx", beryx.createTipsetLink({ tipset, testnet })],
          ["Filfox", filfox.createTipsetLink({ tipset, testnet })],
          ["Filscan", filscan.createTipsetLink({ tipset, testnet })],
          ["Starboard", starboard.createTipsetLink({ tipset, testnet })],
          ["Blockscout", blockscout.createTipsetLink({ tipset, testnet })],
        ];
      case "transaction":
        const transactionHash = input as string;

        return [
          ["Beryx", beryx.createTransactionLink({ transactionHash, testnet })],
          [
            "Filfox",
            filfox.createTransactionLink({ transactionHash, testnet }),
          ],
          [
            "Filscan",
            filscan.createTransactionLink({ transactionHash, testnet }),
          ],
          [
            "Starboard",
            starboard.createTransactionLink({ transactionHash, testnet }),
          ],
          [
            "Blockscout",
            blockscout.createTransactionLink({ transactionHash, testnet }),
          ],
        ];
    }
  }, [error, input, status, variant]);

  const copyToClipboard = useCallback(() => {
    const name = variantObjectName(variant);

    toast.promise(navigator.clipboard.writeText(input.toString()), {
      loading: `Copying ${name}...`,
      success: `${capitalize(name)} copied!`,
      error: `Could not copy ${name}.`,
    });
  }, [input, variant]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading}
        render={<Button size={triggerButtonSize} variant="ghost" />}
      >
        <span className="sr-only">Open menu</span>
        <EllipsisVerticalIcon
          className={cn(triggerButtonSize === "icon-lg" && "size-6")}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={copyToClipboard}>
            <CopyIcon />
            Copy
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {explorersLinks.length > 0 && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Explorers</DropdownMenuLabel>
            {explorersLinks.map(([label, url]) => {
              return (
                <DropdownMenuItem
                  key={label}
                  render={<Link href={url} target="_blank" />}
                >
                  {linkIcon}
                  {label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
