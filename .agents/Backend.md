---
name: ems-backend
description: >
  Backend rules for the Estate Management System (apps/api).
  Read SKILL.md first, then this file for any task involving Express routes,
  controllers, services, repositories, Typegoose models, DTOs, or middleware.
---

# EMS Backend — Agent Rules (apps/api)

> **Pre-check:** Read `SKILL.md` before this file. It has the monorepo structure, shared types, auth roles, and API response contract.

---

## Stack

| Concern      | Tool                                                  |
|--------------|-------------------------------------------------------|
| Runtime      | Node.js ≥ 20 LTS                                      |
| Framework    | Express.js                                            |
| Language     | TypeScript — strict mode                              |
| Architecture | Screaming Architecture (feature-first folders)        |
| Database     | MongoDB via Typegoose                                 |
| Validation   | class-validator + class-transformer                   |
| Auth         | JWT — httpOnly cookie `ems_token`                     |

---

## Screaming Architecture — Feature Folder

Every module gets **exactly** these six artefacts. No more, no less.

```
src/<feature>/
├── <feature>.model.ts          ← Typegoose schema
├── <feature>.repository.ts     ← MongoDB queries only
├── <feature>.service.ts        ← Business logic only
├── <feature>.controller.ts     ← HTTP layer only
├── <feature>.routes.ts         ← Route definitions + middleware
└── dtos/
    ├── create-<feature>.dto.ts
    └── update-<feature>.dto.ts
```

Register in `app.ts`:
```ts
app.use('/api/<feature>', featureRoutes);
```

---

## Layer Contracts (Never Break)

| Layer          | Allowed to…                               | Never…                          |
|----------------|-------------------------------------------|---------------------------------|
| `model.ts`     | Define Typegoose class + `@prop`          | Contain logic                   |
| `repository.ts`| Run MongoDB queries via Typegoose model   | Contain business logic          |
| `service.ts`   | Implement business rules, call repository | Touch `req`/`res`, call model directly |
| `controller.ts`| Read `req`, call service, call `sendSuccess`/`sendError` | Contain logic |
| `routes.ts`    | Define routes, chain middleware           | Contain logic                   |

---

## Route Access Matrix

Every route must declare which roles can access it. Use this as a reference when writing `requireRole()` calls.

| Module        | GET (list/read)               | POST (create)          | PATCH (update)              | DELETE (soft-delete)  |
|---------------|-------------------------------|------------------------|-----------------------------|-----------------------|
| `properties`  | `admin`, `landlord`           | `admin`, `landlord`    | `admin`, `landlord` (own)   | `admin`               |
| `tenants`     | `admin`, `landlord`           | `admin`                | `admin`, `landlord` (own)   | `admin`               |
| `leases`      | `admin`, `landlord`, `tenant` (own) | `admin`, `landlord` | `admin`, `landlord` (own) | `admin`             |
| `maintenance` | `admin`, `landlord`, `tenant` (own) | `admin`, `landlord`, `tenant` | `admin`, `landlord` | `admin`      |
| `payments`    | `admin`, `landlord`, `tenant` (own) | `admin`, `landlord` | `admin`, `landlord`        | `admin`               |
| `vendors`     | `admin`, `landlord`           | `admin`                | `admin`                     | `admin`               |
| `staff`       | `admin`                       | `admin`                | `admin`                     | `admin`               |
| `users`       | `admin`                       | `admin`                | `admin`                     | `admin`               |
| `reports`     | `admin`, `landlord`           | —                      | —                           | —                     |

**Ownership rule:** When a role says `(own)`, the service must filter by the `req.user.id` — the tenant can only read their own lease/payments, the landlord can only edit their own properties.

```ts
// Example — tenant fetching their own lease
router.get('/my', authenticate, requireRole('tenant'), asyncWrapper(ctrl.getMyLease));

// Example — landlord scoped to their own properties
router.get('/', authenticate, requireRole('admin', 'landlord'), asyncWrapper(ctrl.getAllProperties));
// → service checks: if role === 'landlord', filter by { landlordId: req.user.id }
```

---

## Model Pattern (Typegoose)

```ts
// src/properties/properties.model.ts
import { prop, modelOptions, Severity, getModelForClass } from '@typegoose/typegoose';

export type PropertyType   = 'apartment' | 'duplex' | 'commercial' | 'land';
export type PropertyStatus = 'available' | 'occupied' | 'maintenance' | 'inactive';

@modelOptions({
  schemaOptions: { collection: 'properties', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class Property {
  @prop({ required: true, trim: true })
  title!: string;

  @prop({ required: true, enum: ['apartment', 'duplex', 'commercial', 'land'] })
  type!: PropertyType;

  @prop({ required: true, enum: ['available', 'occupied', 'maintenance', 'inactive'], default: 'available' })
  status!: PropertyStatus;

  @prop({ required: true })
  address!: string;

  @prop({ required: true, min: 0 })
  rentAmount!: number;

  @prop({ required: true, min: 1 })
  bedrooms!: number;

  @prop({ required: true })
  estateZone!: string;

  @prop({ default: [] })
  amenities!: string[];

  @prop({ default: false })
  isDeleted!: boolean;
}

export const PropertyModel = getModelForClass(Property);
```

Rules:
- Always `Severity.ERROR` in `@modelOptions`.
- Always `timestamps: true` in `schemaOptions`.
- Always soft-delete with `isDeleted: boolean` (default `false`).
- All queries must filter `{ isDeleted: false }`.

---

## Repository Pattern

```ts
// src/properties/properties.repository.ts
import { PropertyModel, Property } from './properties.model';
import type { DocumentType } from '@typegoose/typegoose';

export class PropertyRepository {
  async findAll(filter: Record<string, unknown> = {}): Promise<DocumentType<Property>[]> {
    return PropertyModel.find({ ...filter, isDeleted: false }).lean();
  }

  async findById(id: string): Promise<DocumentType<Property> | null> {
    return PropertyModel.findOne({ _id: id, isDeleted: false }).lean();
  }

  async create(data: Partial<Property>): Promise<DocumentType<Property>> {
    return PropertyModel.create(data);
  }

  async update(id: string, data: Partial<Property>): Promise<DocumentType<Property> | null> {
    return PropertyModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async softDelete(id: string): Promise<void> {
    await PropertyModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
  }
}
```

---

## Service Pattern

Services must enforce **ownership scoping** for `landlord` and `tenant` roles. Never return data that belongs to another user.

```ts
// src/properties/properties.service.ts
import { PropertyRepository } from './properties.repository';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { Property } from './properties.model';

export class PropertyService {
  private repo = new PropertyRepository();

  async getAllProperties(role: string, userId: string): Promise<DocumentType<Property>[]> {
    // Landlords only see their own properties
    const filter = role === 'landlord' ? { landlordId: userId } : {};
    return this.repo.findAll(filter);
  }

  async getPropertyById(id: string): Promise<DocumentType<Property>> {
    const property = await this.repo.findById(id);
    if (!property) throw { status: 404, message: 'Property not found', code: 'NOT_FOUND' };
    return property;
  }

  async createProperty(dto: CreatePropertyDto): Promise<DocumentType<Property>> {
    return this.repo.create(dto);
  }

  async updateProperty(id: string, dto: UpdatePropertyDto): Promise<DocumentType<Property>> {
    await this.getPropertyById(id);
    const updated = await this.repo.update(id, dto);
    if (!updated) throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    return updated;
  }

  async deleteProperty(id: string): Promise<void> {
    await this.getPropertyById(id);
    await this.repo.softDelete(id);
  }
}
```

---

## Controller Pattern

```ts
// src/properties/properties.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../shared/middleware/authenticate';
import { PropertyService } from './properties.service';
import { sendSuccess, sendError } from '../shared/utils/response';

const service = new PropertyService();

export const getAllProperties = async (req: AuthRequest, res: Response) => {
  const data = await service.getAllProperties(req.user!.role, req.user!.id);
  sendSuccess(res, data, 'Properties fetched');
};

export const getPropertyById = async (req: AuthRequest, res: Response) => {
  const data = await service.getPropertyById(req.params.id);
  sendSuccess(res, data, 'Property fetched');
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  const data = await service.createProperty(req.body);
  sendSuccess(res, data, 'Property created', 201);
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  const data = await service.updateProperty(req.params.id, req.body);
  sendSuccess(res, data, 'Property updated');
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  await service.deleteProperty(req.params.id);
  sendSuccess(res, null, 'Property deleted');
};
```

---

## DTO Pattern (class-validator)

```ts
// src/properties/dtos/create-property.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsArray, IsOptional } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsEnum(['apartment', 'duplex', 'commercial', 'land'])
  type!: 'apartment' | 'duplex' | 'commercial' | 'land';

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsNumber()
  @Min(0, { message: 'Rent amount must be non-negative' })
  rentAmount!: number;

  @IsNumber()
  @Min(1)
  bedrooms!: number;

  @IsString()
  @IsNotEmpty()
  estateZone!: string;

  @IsArray()
  @IsOptional()
  amenities?: string[];
}
```

```ts
// src/properties/dtos/update-property.dto.ts
// Make every field optional by using a manual partial — copy CreatePropertyDto fields with ? marks.
// Or implement a lightweight PartialType helper in src/shared/utils/partialType.ts.
```

---

## Routes Pattern

```ts
// src/properties/properties.routes.ts
import { Router } from 'express';
import { authenticate }      from '../shared/middleware/authenticate';
import { requireRole }       from '../shared/middleware/requireRole';
import { validateDto }       from '../shared/middleware/validateDto';
import { asyncWrapper }      from '../shared/utils/asyncWrapper';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import * as ctrl from './properties.controller';

const router = Router();

router.get('/',      authenticate,                                                                  asyncWrapper(ctrl.getAllProperties));
router.get('/:id',   authenticate,                                                                  asyncWrapper(ctrl.getPropertyById));
router.post('/',     authenticate, requireRole('admin', 'landlord'), validateDto(CreatePropertyDto), asyncWrapper(ctrl.createProperty));
router.patch('/:id', authenticate, requireRole('admin', 'landlord'), validateDto(UpdatePropertyDto), asyncWrapper(ctrl.updateProperty));
router.delete('/:id',authenticate, requireRole('admin'),                                             asyncWrapper(ctrl.deleteProperty));

export default router;
```

## app.ts

```ts
// src/app.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from './shared/middleware/errorHandler';
import authRoutes        from './auth/auth.routes';
import propertyRoutes    from './properties/properties.routes';
import tenantRoutes      from './tenants/tenants.routes';
import leaseRoutes       from './leases/leases.routes';
import maintenanceRoutes from './maintenance/maintenance.routes';
import paymentRoutes     from './payments/payments.routes';
import vendorRoutes      from './vendors/vendors.routes';
import staffRoutes       from './staff/staff.routes';
import userRoutes        from './users/users.routes';
import reportRoutes      from './reports/reports.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',        authRoutes);
app.use('/api/properties',  propertyRoutes);
app.use('/api/tenants',     tenantRoutes);
app.use('/api/leases',      leaseRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/payments',    paymentRoutes);
app.use('/api/vendors',     vendorRoutes);
app.use('/api/staff',       staffRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/reports',     reportRoutes);

app.use(errorHandler);

export default app;
```

---

## Shared Utilities

### Response helpers

```ts
// src/shared/utils/response.ts
import { Response } from 'express';

export const sendSuccess = (res: Response, data: unknown, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

export const sendError = (res: Response, message = 'Something went wrong', statusCode = 500, code = 'INTERNAL_ERROR') =>
  res.status(statusCode).json({ success: false, message, code });
```

### Async wrapper

```ts
// src/shared/utils/asyncWrapper.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncWrapper = (fn: RequestHandler): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

### validateDto middleware

```ts
// src/shared/middleware/validateDto.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validateDto = (DtoClass: new () => object) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(DtoClass, req.body);
    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      const message = errors.map(e => Object.values(e.constraints ?? {}).join(', ')).join('; ');
      res.status(400).json({ success: false, message, code: 'VALIDATION_ERROR' });
      return;
    }
    req.body = instance;
    next();
  };
```

### authenticate middleware

```ts
// src/shared/middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.ems_token;
  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized', code: 'NO_TOKEN' });
    return;
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};
```

### requireRole middleware

```ts
// src/shared/middleware/requireRole.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';

export const requireRole = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden', code: 'INSUFFICIENT_ROLE' });
      return;
    }
    next();
  };
```

### Global error handler

```ts
// src/shared/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

interface AppError { status?: number; message?: string; code?: string; }

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status ?? 500).json({
    success: false,
    message: err.message ?? 'Internal Server Error',
    code:    err.code ?? 'SERVER_ERROR',
  });
};
```

---

## Backend Hard Rules

- ❌ No `any` in TypeScript
- ❌ Business logic only in services — never in controllers or repositories
- ❌ DB queries only in repositories — never in services
- ❌ Never call `res.json()` directly — use `sendSuccess` / `sendError`
- ❌ Every route must use `authenticate` middleware
- ❌ Every mutation route (`POST`, `PATCH`, `DELETE`) must use `validateDto()`
- ❌ Every route must be wrapped with `asyncWrapper()`
- ❌ Every Typegoose model must use `Severity.ERROR`
- ❌ Never hard-delete — always soft-delete with `isDeleted: true`
- ❌ Always check existence in service before update/delete (throw 404 if missing)