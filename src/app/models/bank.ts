export interface Bank {
    id: number,
    start: Date,
    end: Date,
    approved: boolean,
    dateApproved: Date,
    userId: number,
    typeId: number,
    description: string,
    status: string,
    userName: string
    teamName: string
}
