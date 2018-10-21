/**
 * Constructor type
 */
import { EntityLike } from "./EntityLike";
import { ValueObject } from "./ValueObject";

export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Get props type from Entity or ValueObject
 */
export type GetPropsType<T extends EntityLike<any> | ValueObject<any>> = () => T["props"];
