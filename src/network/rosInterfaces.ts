export interface TopicSettings {
    topic: string;
    messageType: string;
    throttleRate?: number;
    latch?: boolean;
    queueLength?: number;
    queueSize?: number;
}