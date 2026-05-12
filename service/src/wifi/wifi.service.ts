import { Injectable } from '@nestjs/common';
import { Wifi } from '../interface/wifi';

@Injectable()
export class WifiService {
  create(createWifiDto: Wifi) {
    return 'This action adds a new wifi';
  }

  findAll() {
    return `This action returns all wifi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wifi`;
  }

  update(id: number, updateWifiDto: Wifi) {
    return `This action updates a #${id} wifi`;
  }

  remove(id: number) {
    return `This action removes a #${id} wifi`;
  }
}
