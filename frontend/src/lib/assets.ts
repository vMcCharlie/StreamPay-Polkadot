export interface NativeAsset {
    name: string;
    symbol: string;
    decimals: number;
    color: string;
}

export const NATIVE_ASSETS: NativeAsset[] = [
    {
        name: "Paseo",
        symbol: "PAS",
        decimals: 18,
        color: "#34d399",
    },
];

export function getAssetByAddress(address: string): NativeAsset | undefined {
    if (address.toLowerCase() === "0x0000000000000000000000000000000000000000") {
        return NATIVE_ASSETS[0];
    }
    return undefined;
}

export function getAssetBySymbol(symbol: string): NativeAsset | undefined {
    return NATIVE_ASSETS.find((a) => a.symbol === symbol);
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
    const divisor = BigInt(10 ** decimals);
    const whole = amount / divisor;
    const fraction = amount % divisor;
    const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, 4);
    return `${whole.toString()}.${fractionStr}`;
}
