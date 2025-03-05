import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ActionPermission, ResourcePermission } from '@prisma/client';

@Injectable()
export class RoleSeeder {
  private readonly logger = new Logger(RoleSeeder.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly initialRoles = [
    {
      name: 'manager',
      permissions: [
        {
          resource: ResourcePermission.products,
          actions: [
            ActionPermission.create,
            ActionPermission.read,
            ActionPermission.update,
            ActionPermission.delete,
          ],
        },
      ],
    },
    {
      name: 'user',
      permissions: [
        {
          resource: ResourcePermission.products,
          actions: [ActionPermission.create, ActionPermission.read],
        },
      ],
    },
  ];

  async seed() {
    try {
      // Check if roles already exist
      const existingRoles = await this.prisma.role.count();

      if (existingRoles > 0) {
        this.logger.log('Roles already exist in database. Skipping seed.');
        return;
      }

      this.logger.log('Starting database seed...');

      // Seed each role
      for (const roleData of this.initialRoles) {
        // Create the role first
        const role = await this.prisma.role.create({
          data: {
            name: roleData.name,
          },
        });

        // Create and connect specific permissions for each role
        for (const permissionData of roleData.permissions) {
          const permission = await this.prisma.permission.create({
            data: {
              resource: permissionData.resource,
              actions: permissionData.actions,
              roles: {
                connect: [{ id: role.id }],
              },
            },
          });

          this.logger.verbose(
            `Created permission for ${permissionData.resource} with actions ${permissionData.actions}`,
          );
        }

        this.logger.log(`Role ${roleData.name} seeded successfully`);
      }

      this.logger.log('Initial database seeding completed successfully');
    } catch (error) {
      this.logger.error('Error seeding database:', error);
      throw error;
    }
  }
}
