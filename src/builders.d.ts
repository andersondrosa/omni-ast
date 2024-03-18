import { Expression, Identifier, MemberExpression } from "./types";

declare function memberExpression(
  object: Expression,
  property: Expression | Identifier,
  computed?: boolean,
  optional?: true | false | null
): MemberExpression;
