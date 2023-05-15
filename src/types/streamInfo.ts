import {StreamStatus} from "./streamStatus";


interface StreamInfo {
    status: StreamStatus,
    createTime: string,
    depositAmount: string, // stream's total deposit amount

    streamId: string, // streamId
    interval: string, // stream's interval
    lastWithdrawTime: string, // stream's last withdraw time
    ratePerInterval: string,
    recipientId: string, // recipient's address
    remainingAmount: string, // stream's remaining balance
    senderId: string, // sender's address
    startTime: string, // stream's start time
    stopTime: string,  // stream's end time
    withdrawnAmount: string, // 已经接收的金额
    pauseInfo: {
        accPausedTime: string,
        pauseAt: string,
        paused: boolean,
    },
    name: string, // stream's name
    streamedAmount: string,
    withdrawableAmount: string,
    escrowAddress: string,
}

export default StreamInfo;