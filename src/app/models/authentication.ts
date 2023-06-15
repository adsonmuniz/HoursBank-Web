// Models
import { Coordinator } from "./coordinator";
import { Team } from "./team";
import { User } from "./user";

export interface Authentication {
    authenticated: string,
    expiration: Date,
    accessToken: string,
    message: string,
    user: User,
    team: Team,
    coordinators: Array<Coordinator>
}
