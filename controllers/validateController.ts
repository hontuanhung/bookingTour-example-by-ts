import { NextFunction } from "express";
import {
  IS_ENUM,
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  ValidationError,
  validateOrReject,
} from "class-validator";
import { Match } from "../utils/match.dto";

export function validate(dto: DTO, body: any, next: NextFunction) {
  let decorator: any = filterOutDTO(dto);
  validateOrReject(assignFieldToDTO(decorator, body)).catch((errors) =>
    next(errors)
  );
}

type DTO =
  | "login"
  | "signup"
  | "forgotPassword"
  | "resetPassword"
  | "updatePassword"
  | "verifyEmail"
  | "updateUser"
  | "updateMe"
  | "createTour"
  | "updateTour"
  | "review";

function filterOutDTO(dto: DTO) {
  switch (dto) {
    case "login":
      return new LoginDTO();
    case "signup":
      return new SignupDTO();
    case "forgotPassword":
      return new ForgotPasswordDTO();
    case "resetPassword":
      return new ResetPasswordDTO();
    case "updatePassword":
      return new updatePasswordDTO();
    case "updateUser":
      return new updateUserDTO();
    case "updateMe":
      return new updateMeDTO();
    case "createTour":
      return new createTourDTO();
    case "updateTour":
      return new updateTourDTO();
    case "review":
      return new reviewDTO();
  }
}

function assignFieldToDTO(decorator: any, body: any) {
  for (const field in body) {
    decorator[field] = body[field];
  }
  return decorator;
}

class LoginDTO {
  @IsString()
  @IsEmail()
  email: string | undefined;

  @IsString()
  @MinLength(8, {
    message: "Your password must be at least 8 characters long",
  })
  password: string | undefined;
}

enum USER_ROLE {
  USER = "user",
  ADMIN = "admin",
  GUIDE = "guide",
  LEAD_GUIDE = "lead-guide",
}
class SignupDTO {
  @IsString()
  @Length(5, 40, {
    message: "The 'name' must be between 5-50 characters long",
  })
  name: string | undefined;

  @IsString()
  @IsEmail()
  email: string | undefined;

  @IsString()
  @MinLength(8, {
    message: "Your password must be at least 8 characters long",
  })
  password: string | undefined;

  @IsString()
  @MinLength(8, {
    message: "Your password must be at least 8 characters long",
  })
  @Match<LoginDTO>("password")
  readonly passwordConfirm: string | undefined;

  @IsOptional()
  @IsString()
  photo: string | undefined;

  @IsOptional()
  @IsString()
  @IsEnum(USER_ROLE, { message: "Please chose one of 4 default roles" })
  role: USER_ROLE | undefined;
}

class ForgotPasswordDTO {
  @IsString()
  @IsEmail()
  email: string | undefined;
}

class ResetPasswordDTO {
  @IsString()
  @MinLength(8, {
    message: "Your password must be at least 8 characters long",
  })
  password: string | undefined;

  @IsString()
  @MinLength(8, {
    message: "Your password must be at least 8 characters long",
  })
  @Match<LoginDTO>("password")
  readonly passwordConfirm: string | undefined;
}

class updatePasswordDTO {
  @IsString()
  @MinLength(8, {
    message: "Your password must be at least 8 characters long",
  })
  currentPassword: string | undefined;

  @IsString()
  @MinLength(8, {
    message: "Your password must be at least 8 characters long",
  })
  password: string | undefined;

  @IsString()
  @MinLength(8, {
    message: "Your password must be at least 8 characters long",
  })
  @Match<LoginDTO>("password")
  readonly passwordConfirm: string | undefined;
}

class updateUserDTO {
  @IsOptional()
  @IsString()
  name: string | undefined;

  @IsOptional()
  @IsString()
  photo: string | undefined;

  @IsOptional()
  @IsString()
  @IsEnum(USER_ROLE, { message: "Please chose one of 4 default roles" })
  role: USER_ROLE | undefined;
}

class updateMeDTO {
  @IsOptional()
  @IsString()
  name: string | undefined;

  @IsOptional()
  @IsString()
  photo: string | undefined;
}

enum DIFFICULTY {}
class createTourDTO {
  @IsString()
  @MinLength(10, {
    message: "A tour name must have more or equal then 10 characters",
  })
  @MaxLength(40, {
    message: "A tour name must have less or equal then 40 characters",
  })
  name: string | undefined;

  @IsNumber()
  duration: number | undefined;

  @IsNumber()
  maxGroupSize: number | undefined;

  @IsEnum(DIFFICULTY)
  difficulty: DIFFICULTY | undefined;

  @IsNumber()
  price: number | undefined;

  @IsOptional()
  @IsNumber()
  priceDiscount: number | undefined;

  @IsOptional()
  @IsString()
  summary: string | undefined;

  @IsString()
  description: string | undefined;

  @IsString()
  imageCover: string | undefined;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[] | undefined;

  @IsArray()
  @IsString({ each: true })
  startDates: string[] | undefined;

  @IsOptional()
  @IsString()
  startLocation: string | undefined;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations: string[] | undefined;
}
class updateTourDTO {
  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: "A tour name must have more or equal then 10 characters",
  })
  @MaxLength(40, {
    message: "A tour name must have less or equal then 40 characters",
  })
  name: string | undefined;

  @IsOptional()
  @IsNumber()
  duration: number | undefined;

  @IsOptional()
  @IsNumber()
  maxGroupSize: number | undefined;

  @IsEnum(DIFFICULTY)
  difficulty: DIFFICULTY | undefined;

  @IsOptional()
  @IsNumber()
  price: number | undefined;

  @IsOptional()
  @IsNumber()
  priceDiscount: number | undefined;

  @IsOptional()
  @IsString()
  summary: string | undefined;

  @IsOptional()
  @IsString()
  description: string | undefined;

  @IsOptional()
  @IsString()
  imageCover: string | undefined;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[] | undefined;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  startDates: string[] | undefined;

  @IsOptional()
  @IsString()
  startLocation: string | undefined;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations: string[] | undefined;
}

class reviewDTO {
  @IsOptional()
  @IsString()
  review: string | undefined;

  @IsOptional()
  @IsNumber()
  rating: number | undefined;
}
