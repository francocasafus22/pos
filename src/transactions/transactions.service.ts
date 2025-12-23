import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  Transaction,
  TransactionContents,
} from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { GetTransactionQueryDto } from './dto/get-transaction.dto';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly couponService: CouponsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        const transaction = new Transaction();

        const errors = [];
        let total = 0;

        for (const contents of createTransactionDto.contents) {
          console.log(contents);
          const product = await transactionEntityManager.findOneBy(Product, {
            id: contents.productId,
          });

          if (!product) {
            errors.push(`El producto con ID ${contents.productId} no existe`);
            throw new NotFoundException(errors);
          }

          if (contents.quantity > product.inventory) {
            errors.push(
              `El articulo ${product.name} excede la cantidad disponible`,
            );
            throw new BadRequestException(errors);
          }

          product.inventory -= contents.quantity;

          // Create TransactionContents instance

          const transactionContent = new TransactionContents();
          transactionContent.price = product.price;
          transactionContent.product = product;
          transactionContent.quantity = contents.quantity;
          total += product.price * contents.quantity;
          transaction.total = total;
          transactionContent.transaction = transaction;

          await transactionEntityManager.save(transactionContent);
        }

        if (createTransactionDto.coupon) {
          const coupon = await this.couponService.apply({
            name: createTransactionDto.coupon,
          });
          console.log(transaction.total);
          transaction.total =
            transaction.total - (transaction.total * coupon.percentage) / 100;
          transaction.coupon = coupon.name;
          transaction.discount = coupon.percentage;
        }

        console.log(transaction);
        await transactionEntityManager.save(transaction);
      },
    );

    return { message: 'Venta guardada correctamente' };
  }

  async findAll(query?: GetTransactionQueryDto) {
    const page = Number(query.page) || 1;
    const limit = query.take || 10;
    const skip = (page - 1) * limit;

    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true,
      },
      order: {
        id: 'DESC',
      },
      skip: skip,
      take: limit,
    };

    if (query.date) {
      const date = parseISO(query.date);
      if (!isValid(date)) throw new BadRequestException('Fecha no válida');
      const start = startOfDay(date);
      const end = endOfDay(date);

      options.where = {
        transactionDate: Between(start, end),
      };
    }

    const [transactions, total] =
      await this.transactionRepository.findAndCount(options);

    return {
      transactions,
      total,
      totalPages: Math.ceil(total / limit),
      page: page,
    };
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        contents: true,
      },
    });
    const errors = [];
    if (!transaction) {
      errors.push('Venta no encontrada');
      throw new NotFoundException(errors);
    }
    return transaction;
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    for (const contents of transaction.contents) {
      const product = await this.productRepository.findOneBy({
        id: contents.product.id,
      });
      product.inventory += contents.quantity;
      await this.productRepository.save(product);

      const transactionContents =
        await this.transactionContentsRepository.findOneBy({ id: contents.id });
      await this.transactionContentsRepository.remove(transactionContents);
    }
    await this.transactionRepository.remove(transaction);
    return { message: 'Venta eliminada correctamente' };
  }
}
