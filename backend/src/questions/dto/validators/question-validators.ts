import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export const VALID_CATEGORIES = [
  'Cardiology',
  'MajorTrauma',
  'MinorTrauma',
  'Pediatrics',
  'Toxicology',
  'Resuscitation',
  'Eye',
  'ENT',
  'ObstetricAndGynaecology',
  'PainAndSedation',
  'Nephrology',
  'Neurology',
  'Gastroenterology',
  'EnvironmentalEmergencies',
  'ElderlyCare',
  'Dermatology',
  'Allergy',
  'OncologicalEmergencies',
  'Musculoskeletal',
  'Respiratory',
  'SurgicalEmergencies',
  'Urology',
  'Vascular',
  'Endocrinology',
  'Haematology',
  'InfectiousDiseases',
  'ProceduralSkills',
  'ComplexOrChallengingSituations',
] as const;

export const VALID_PLAN_LEVELS = ['Primary', 'Intermediate'] as const;

@ValidatorConstraint()
export class IsValidCategoryConstraint implements ValidatorConstraintInterface {
  validate(category: string): boolean {
    return VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number]);
  }

  defaultMessage(): string {
    return `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
  }
}

@ValidatorConstraint()
export class IsCorrectAnswerInChoicesConstraint implements ValidatorConstraintInterface {
  validate(correctAnswer: string, args: any): boolean {
    if (!correctAnswer || typeof correctAnswer !== 'string') return false;
    const choices = args?.object?.choices;
    if (!choices || typeof choices !== 'object') return false;
    return correctAnswer in choices;
  }

  defaultMessage(): string {
    return 'correctAnswer must be a key that exists in the choices object';
  }
}

@ValidatorConstraint()
export class IsValidPlanLevelConstraint implements ValidatorConstraintInterface {
  validate(planLevel: string): boolean {
    return VALID_PLAN_LEVELS.includes(planLevel as typeof VALID_PLAN_LEVELS[number]);
  }

  defaultMessage(): string {
    return `planLevel must be "${VALID_PLAN_LEVELS[0]}" or "${VALID_PLAN_LEVELS[1]}"`;
  }
}

export function IsValidCategory(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidCategoryConstraint,
    });
  };
}

export function IsCorrectAnswerInChoices(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCorrectAnswerInChoicesConstraint,
    });
  };
}

export function IsValidPlanLevel(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidPlanLevelConstraint,
    });
  };
}