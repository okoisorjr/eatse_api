import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './service/clients.service';
import { Client, ClientSchema } from './schema/client.schema';
import { Easer, EaserSchema } from 'src/easers/schema/easer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Easer.name, schema: EaserSchema },
    ]),
  ],
  exports: [MongooseModule, ClientsService],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientModule {}
