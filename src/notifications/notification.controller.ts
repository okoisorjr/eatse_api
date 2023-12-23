import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NewNotificationDto } from './notificationDto/newNotification.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/shared/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  //@UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.SERVICE_PROVIDER, Role.SUPPORT)
  @Post(':role')
  create(@Param('role') role: string, @Body() newNotificationDto: NewNotificationDto) {
    return this.notificationService.createNewNotification(newNotificationDto);
  }

  @Roles(Role.ADMIN, Role.OPERATOR, Role.SERVICE_PROVIDER, Role.SUPPORT)
  @Get()
  fetchAllNotifications() {
    return this.notificationService.retrieveAllNotifications();
  }

  @Roles(
    Role.ADMIN,
    Role.CLIENT,
    Role.EASER,
    Role.OPERATOR,
    Role.SERVICE_PROVIDER,
    Role.SUPPORT,
  )
  @Get(':role')
  fetchRoleNotification(@Param('role') role: string) {
    return this.notificationService.fetchRoleBasedNotifications(role);
  }
}
