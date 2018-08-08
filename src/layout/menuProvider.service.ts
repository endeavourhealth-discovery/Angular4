import {MenuOption} from "./models/MenuOption";

export abstract class AbstractMenuProvider {
	abstract getClientId() : string;
    abstract getMenuOptions() : MenuOption[];
    abstract getApplicationTitle() : string;
    abstract useUserManagerForRoles() : boolean;
}
