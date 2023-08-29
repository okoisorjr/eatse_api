import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientModule } from './clients/client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EaserModule } from './easers/easer.module';
import { BookingModule } from './booking/booking.module';
import { NotificationModule } from './notifications/notification.module';
import { AuthModule } from './auth/auth.module';
import { ClientsController } from './clients/controllers/clients.controller';
import { EaserController } from './easers/easer.controller';
import { BookingController } from './booking/booking.controller';
import { NotificationController } from './notifications/notification.controller';
import { RatingModule } from './rating/rating.module';
import { ErrandModule } from './errands/errand.module';
import { AddressModule } from './address/address.module';
import { ApplicationModule } from './application/application.module';
import { AccountDetailsModule } from './account-details/account-details.module';
import { EatseServicesModule } from './eatse-services/eatse-services.module';
import { EatsePoliciesModule } from './eatse-policies/eatse-policies.module';
import { JobPostsModule } from './job-posts/job-posts.module';
import { EatseBlogsModule } from './eatse-blogs/eatse-blogs.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { EmployeeModule } from './employee/employee.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ClientModule,
    EaserModule,
    BookingModule,
    NotificationModule,
    ErrandModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    AuthModule,
    RatingModule,
    AddressModule,
    ApplicationModule,
    AccountDetailsModule,
    EatseServicesModule,
    EatsePoliciesModule,
    JobPostsModule,
    EatseBlogsModule,
    FeedbacksModule,
    AnnouncementsModule,
    InquiriesModule,
    EmployeeModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes(
        ClientsController,
        EaserController,
        BookingController,
        NotificationController,
      );

    consumer.apply().forRoutes();
  }
}
