export type Roles = string[];

export class UserInterface {
    id?: string;
    name?:  string | null;
    email?: string | null;
    roles?: Roles
}