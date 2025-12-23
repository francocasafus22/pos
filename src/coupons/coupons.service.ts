import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    await this.couponRepository.save(createCouponDto);
    return 'Cupón creado correctamente';
  }

  findAll() {
    return this.couponRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOneBy({ id });
    if (!coupon) {
      throw new NotFoundException(['Cupón no encontrado']);
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, updateCouponDto);
    await this.couponRepository.save(coupon);
    return { message: `Cupón editado correctamente` };
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    await this.couponRepository.remove(coupon);
    return { message: `Cupón eliminado correctamente` };
  }

  async apply(applyCouponDto: ApplyCouponDto) {
    const coupon = await this.couponRepository.findOneBy({
      name: applyCouponDto.name,
    });
    if (!coupon) throw new NotFoundException(['El cupón no existe']);

    const today = new Date();
    const expirationDate = endOfDay(coupon.expirationDate);
    if (isAfter(today, expirationDate)) {
      throw new UnprocessableEntityException(['El cupón está expirado']);
    }
    return { message: 'Cupón válido', ...coupon };
  }
}
