import StreamPayABI from "@/abi/StreamPay.json";
import deployment from "@/lib/deployment.json";

export const STREAMPAY_ADDRESS = deployment.address as `0x${string}`;
export const STREAMPAY_ABI = StreamPayABI;

export interface StreamData {
    id: bigint;
    sender: `0x${string}`;
    recipient: `0x${string}`;
    token: `0x${string}`;
    deposit: bigint;
    withdrawn: bigint;
    startTime: bigint;
    stopTime: bigint;
    curveType: number;
    active: boolean;
    // Computed
    recipientBalance?: bigint;
    senderBalance?: bigint;
}

export function formatStreamRate(
    deposit: bigint,
    startTime: bigint,
    stopTime: bigint,
    decimals: number
): string {
    const duration = stopTime - startTime;
    if (duration === 0n) return "0";
    const perSecond = deposit / duration;
    const perDay = perSecond * 86400n;
    const divisor = BigInt(10 ** decimals);
    const whole = perDay / divisor;
    const fraction = perDay % divisor;
    const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, 2);
    return `${whole}.${fractionStr}`;
}

export function getStreamProgress(startTime: bigint, stopTime: bigint): number {
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (now <= startTime) return 0;
    if (now >= stopTime) return 100;
    const elapsed = now - startTime;
    const total = stopTime - startTime;
    return Number((elapsed * 100n) / total);
}

export function getTimeRemaining(stopTime: bigint): string {
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (now >= stopTime) return "Ended";
    const remaining = stopTime - now;
    const days = remaining / 86400n;
    const hours = (remaining % 86400n) / 3600n;
    const minutes = (remaining % 3600n) / 60n;
    if (days > 0n) return `${days}d ${hours}h remaining`;
    if (hours > 0n) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
}

export function shortenAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
