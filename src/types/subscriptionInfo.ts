// import { SubscriptionStatus } from "./subscriptionStatus"


interface SubscriptionInfo {
   
    subscription_id: number,
    sender: string,
    recipient: string,
    coin_type: string,
    interval: number,
    fixed_rate: number,
    start_time: string,
    stop_time: string,
    deposit_amount: number,
    remaining_amount: number,

    escrow_address: string,

    create_at: number,
    last_withdraw_time: number,
    withdraw_count: number,
    closed: boolean,
}

export default SubscriptionInfo;