import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAccountDetailDto } from './dto/create-account-detail.dto';
import { UpdateAccountDetailDto } from './dto/update-account-detail.dto';
import { AccountDetail } from './entities/account-detail.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Easer } from 'src/easers/schema/easer.schema';

@Injectable()
export class AccountDetailsService {
  constructor(
    @InjectModel(AccountDetail.name)
    private readonly accountDetailModel: Model<AccountDetail>,
    @InjectModel(Easer.name) private readonly easerModel: Model<Easer>,
  ) {}

  async create(
    createAccountDetailDto: CreateAccountDetailDto,
  ): Promise<AccountDetail> {
    // check if this easer account actually exists
    const found_easer = await this.easerModel.findById(
      createAccountDetailDto.easer,
    );

    // if this easer account does not exist throw error
    if (!found_easer) {
      throw new HttpException(
        'The easer account could not be found!',
        HttpStatus.NOT_FOUND,
      );
    }

    //check if easer already has their bank detils saved!
    const found_easer_account_details = await this.accountDetailModel.findOne({
      $and: [{ easer: found_easer }],
    });

    // if the user has already provided their bank details throw error
    if (found_easer_account_details) {
      throw new HttpException(
        'This easer has already provided their account details!',
        HttpStatus.CONFLICT,
      );
    }

    createAccountDetailDto.bank.toUpperCase();
    createAccountDetailDto.easer = found_easer;

    try {
      // if easer exists and they have not provided their bank details then save their information
      const new_bank_details = await this.accountDetailModel.create(
        createAccountDetailDto,
      );
      return new_bank_details;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<AccountDetail[]> {
    const bank_accounts = await this.accountDetailModel.find();

    if (!bank_accounts) {
      throw new HttpException(
        'No bank account information was found!',
        HttpStatus.NOT_FOUND,
      );
    }
    return bank_accounts;
  }

  async findOne(account_id: string): Promise<AccountDetail> {
    const bank_account_information = await this.accountDetailModel.findOne({
      _id: account_id,
    });

    if (!bank_account_information) {
      throw new HttpException(
        'The account was not found!',
        HttpStatus.NOT_FOUND,
      );
    }
    return bank_account_information;
  }

  async getEaserBankAccountDetails(easer_id): Promise<AccountDetail> {
    const easer_acct_details = await this.accountDetailModel.findOne({
      $and: [{ easer: easer_id }],
    });
    if (!easer_acct_details) {
      throw new HttpException(
        'No account information was found for this easer account!',
        HttpStatus.NOT_FOUND,
      );
    }
    return easer_acct_details;
  }

  update(id: number, updateAccountDetailDto: UpdateAccountDetailDto) {
    return `This action updates a #${id} accountDetail`;
  }

  async remove(account_id: string): Promise<any> {
    const deleted_account_id = await this.accountDetailModel.findByIdAndDelete(
      account_id,
    );
    return deleted_account_id;
  }
}
