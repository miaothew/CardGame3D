import { SkillBase } from "./SkillBase";
import { E_Skill_Type } from "../GameDefine";

export class NormalHurtSkill extends SkillBase{
	public constructor() {
		super();
		this.type = E_Skill_Type.NORMAL;
	}
}