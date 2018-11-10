import SelectHeroUI from "./../script/SelectHeroUI";
import GameUI from "./../script/GameUI";
import BattleScene from "./../script/BattleScene";

export class GameStateManager {

	public static Instance: GameStateManager;
	private gameState: number = 0;
	public constructor() {

	}
	public changeGameState(type: number): void {

		this.gameState = type;
		switch (type) {
			case GameStateType.GameLoading:
				(new GameUI()).open(true);
				break;
			case GameStateType.GameStart:
				(new SelectHeroUI()).open(true);
				break;
			case GameStateType.GameEnter:
				(new BattleScene()).open(true);
				break;
			case GameStateType.GameEnd:

				break;
			case GameStateType.GameHple:

				break;
		}

	}

}

export const enum GameStateType {
	Continue = 0,
	GameLoading,
	GameStart,
	GameEnter,
	GameEnd,
	GameHple,
}