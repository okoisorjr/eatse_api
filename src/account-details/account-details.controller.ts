import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountDetailsService } from './account-details.service';
import { CreateAccountDetailDto } from './dto/create-account-detail.dto';
import { UpdateAccountDetailDto } from './dto/update-account-detail.dto';

@Controller('bank_details')
export class AccountDetailsController {
  constructor(private readonly accountDetailsService: AccountDetailsService) {}

  @Post()
  create(@Body() createAccountDetailDto: CreateAccountDetailDto) {
    return this.accountDetailsService.create(createAccountDetailDto);
  }

  @Get()
  findAll() {
    return this.accountDetailsService.findAll();
  }

  @Get(':account_id')
  findOne(@Param('account_id') account_id: string) {
    return this.accountDetailsService.findOne(account_id);
  }

  @Get(':easer_id/easer')
  getEaserAccountDetails(@Param('easer_id') easer_id: string){
    return this.accountDetailsService.getEaserBankAccountDetails(easer_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDetailDto: UpdateAccountDetailDto,
  ) {
    return this.accountDetailsService.update(+id, updateAccountDetailDto);
  }

  @Delete(':account_id')
  remove(@Param('account_id') account_id: string) {
    return this.accountDetailsService.remove(account_id);
  }
}
