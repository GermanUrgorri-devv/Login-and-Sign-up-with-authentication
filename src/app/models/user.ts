export interface Roles{
    cats?: boolean;
    dogs?: boolean;
}

export class UserInterface {
    id?: string;
    name?:  string | null;
    email?: string | null;
    roles?: Roles
}