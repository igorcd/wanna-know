export default interface Survey {
    id?: string;
    title: string;
    questions: { title: string, votes: string[] }[],
    token: string;
    active: boolean;
    userEmail: string;
}