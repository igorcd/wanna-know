export default interface Conversation {
    id?: string;
    messages: Message[]
}

export interface Message {
    id?: string;
    author: string;
    content: string;
    timeStamp: number;
}