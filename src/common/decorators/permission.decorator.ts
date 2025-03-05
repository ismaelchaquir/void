import { SetMetadata } from '@nestjs/common';
import { ActionPermission, ResourcePermission } from '@prisma/client';

import { ArrayUnique, IsEnum } from 'class-validator';

export class Permission {
  @IsEnum(ResourcePermission)
  resource: ResourcePermission;

  @IsEnum(ActionPermission, { each: true })
  @ArrayUnique()
  actions: ActionPermission[];
}

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
