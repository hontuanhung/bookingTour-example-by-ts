import ValidateFeatures from "./validateFeatures";
import AppError from "./appError";

let password: string;

const validateFieldRule = (value: any, fieldRules: any, field: string) => {
  if (fieldRules.required && !value) {
    throw new AppError(`Please provide ${field}.`, 400);
  }
  if (value !== 0 && !value) {
    return;
  }
  for (const rule of Object.keys(fieldRules)) {
    switch (rule) {
      case "type":
        if (fieldRules.type === "number") {
          value = Number(value);
        }
        if (!ValidateFeatures.isValidType(value, fieldRules.type)) {
          throw new AppError(`Invalid typeof ${field} value`, 400);
        }
        break;
      case "maxlength":
        if (
          !ValidateFeatures.isGreater(fieldRules.maxlength[0], value.length)
        ) {
          throw new AppError(fieldRules.maxlength[1], 400);
        }
        break;
      case "minlength":
        if (
          !ValidateFeatures.isLessThan(fieldRules.minlength[0], value.length)
        ) {
          throw new AppError(fieldRules.minlength[1], 400);
        }
        break;
      case "max":
        if (!ValidateFeatures.isGreater(fieldRules.max, value)) {
          throw new AppError(
            `Field "${field}" have value (${value}) is more than maximum allowed value (${fieldRules.max}).`,
            400
          );
        }
        break;
      case "min":
        if (!ValidateFeatures.isLessThan(fieldRules.min, value)) {
          throw new AppError(
            `Field "${field}" have value (${value}) is less than minimum allowed value (${fieldRules.min}).`,
            400
          );
        }
        break;
      case "enum":
        if (!fieldRules.enum.includes(value)) {
          throw new AppError(
            `There is no "${value}" role! Please fill out one of ${fieldRules.enum.length} default roles`,
            400
          );
        }
        break;
      case "isEmail":
        if (fieldRules.isEmail && !ValidateFeatures.isValidEmail(value)) {
          throw new AppError(`Invalid email!`, 400);
        }
        break;
    }
  }
  if (
    field === "passwordConfirm" &&
    !ValidateFeatures.isMatch(password, value)
  ) {
    throw new AppError("Passwords do not match", 400);
  }
  return value;
};

export = (input: any, rules: any) => {
  const convertedBody: any = {};
  if (input.password) {
    password = input.password;
  }
  for (const field in rules) {
    const fieldRules: any = rules[field];
    const fieldValue: any = input[field];

    const value = validateFieldRule(fieldValue, fieldRules, field);
    convertedBody[field] = value;
  }
  return convertedBody;
};
