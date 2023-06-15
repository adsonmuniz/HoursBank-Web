import { Coordinator } from "./coordinator";

export interface Team {
    id: number,
    name: string,
    coordinators: Array<Coordinator>
}
