import { Cron } from '@nestjs/schedule'
import { Injectable } from "@nestjs/common";

@Injectable()
export class CronJobsService{

  @Cron('* * * * * *')
  handleCron(){
    console.log('CronJob called!');
  }
}