import {MenuOption} from "./models/MenuOption";

export abstract class MenuService {
	abstract getClientId() : string;
  abstract getMenuOptions() : MenuOption[];
  abstract getApplicationTitle() : string;
}
