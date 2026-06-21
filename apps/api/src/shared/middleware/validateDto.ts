import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

type DtoConstructor = new () => object;

export const validateDto =
  (DtoClass: DtoConstructor) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const instance = plainToInstance(DtoClass, req.body);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const message = errors
        .map((e) => Object.values(e.constraints ?? {}).join(', '))
        .join('; ');
      res.status(400).json({ success: false, message, code: 'VALIDATION_ERROR' });
      return;
    }

    req.body = instance;
    next();
  };
