"use client";

import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { STREAMPAY_ADDRESS, STREAMPAY_ABI } from "@/lib/contract";

export function useStreamBalance(streamId: bigint) {
    return useReadContract({
        address: STREAMPAY_ADDRESS,
        abi: STREAMPAY_ABI,
        functionName: "streamBalance",
        args: [streamId],
        query: {
            refetchInterval: 3000,
        },
    });
}

export function useStreamData(streamId: bigint) {
    return useReadContract({
        address: STREAMPAY_ADDRESS,
        abi: STREAMPAY_ABI,
        functionName: "streams",
        args: [streamId],
        query: {
            refetchInterval: 5000,
        },
    });
}

export function useOutgoingStreams(address: `0x${string}` | undefined) {
    return useReadContract({
        address: STREAMPAY_ADDRESS,
        abi: STREAMPAY_ABI,
        functionName: "getOutgoing",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useIncomingStreams(address: `0x${string}` | undefined) {
    return useReadContract({
        address: STREAMPAY_ADDRESS,
        abi: STREAMPAY_ABI,
        functionName: "getIncoming",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useCreateStream() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    function create(
        recipient: `0x${string}`,
        deposit: bigint,
        startTime: bigint,
        stopTime: bigint,
        curveType: number
    ) {
        writeContract({
            address: STREAMPAY_ADDRESS,
            abi: STREAMPAY_ABI,
            functionName: "createStream",
            args: [recipient, startTime, stopTime, curveType],
            value: deposit,
        });
    }

    return { create, isPending, isConfirming, isSuccess, hash, error };
}

export function useWithdraw() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    function withdraw(streamId: bigint) {
        writeContract({
            address: STREAMPAY_ADDRESS,
            abi: STREAMPAY_ABI,
            functionName: "withdraw",
            args: [streamId],
        });
    }

    return { withdraw, isPending, isConfirming, isSuccess, hash, error };
}

export function useCancelStream() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    function cancel(streamId: bigint) {
        writeContract({
            address: STREAMPAY_ADDRESS,
            abi: STREAMPAY_ABI,
            functionName: "cancel",
            args: [streamId],
        });
    }

    return { cancel, isPending, isConfirming, isSuccess, hash, error };
}
