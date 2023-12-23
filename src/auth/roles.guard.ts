import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/shared/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    /* console.log(requiredRoles); */
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (requiredRoles.includes(request.params.role)) {
      return true;
    } else {
      throw new UnauthorizedException('Access Denied!');
    }
  }
}
