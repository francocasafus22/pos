import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { categories } from './data/categories';
import { products } from './data/products';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRespository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async seed() {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();

    await this.categoryRespository.save(categories);
    for (const seedProduct of products) {
      const category = await this.categoryRespository.findOneBy({
        id: seedProduct.categoryId,
      });
      const product = new Product();
      product.name = seedProduct.name;
      product.image = seedProduct.image;
      product.inventory = seedProduct.inventory;
      product.price = seedProduct.price;
      product.category = category;
      await this.productRepository.save(product);
    }
  }
}
