import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { GetCategoryQueryDto } from './dto/get-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number, query?: GetCategoryQueryDto) {
    const options: FindOneOptions<Category> = {
      where: { id },
    };

    if (query.showProducts == 'true') {
      options.relations = { products: true };
      options.order = {
        products: {
          inventory: 'DESC',
        },
      };
    }

    const category = await this.categoryRepository.findOne(options);
    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return 'Category deleted successfully';
  }
}
